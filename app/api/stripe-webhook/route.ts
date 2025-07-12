import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, OrderStatus, initializeDatabase, getOrderById } from "@/app/utils/database";
import { headers } from "next/headers";
import crypto from "crypto";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Initialize database on first request
let isDbInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isDbInitialized) {
      await initializeDatabase();
      isDbInitialized = true;
    }

    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature manually
    const expectedSignature = crypto
      .createHmac('sha256', endpointSecret)
      .update(body, 'utf8')
      .digest('hex');
    
    const actualSignature = signature.replace('v1=', '');
    
    if (expectedSignature !== actualSignature) {
      console.error('Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    console.log('Stripe webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  try {
    console.log('Checkout session completed:', session.id);
    
    // Try to find order by client_reference_id first (most accurate)
    const clientReferenceId = session.client_reference_id;
    
    if (clientReferenceId) {
      console.log('Found client_reference_id:', clientReferenceId);
      
      // Update order status using the direct order ID
      await updateOrderStatus(
        clientReferenceId,
        OrderStatus.CONFIRMED,
        session.payment_intent as string,
        session.id
      );
      console.log('Order confirmed via client_reference_id:', clientReferenceId);
      return;
    }
    
    // Fallback: Try to find order by customer email
    const customerEmail = session.customer_details?.email || session.customer_email;
    
    if (!customerEmail) {
      console.error('No client_reference_id or customer email found in session');
      return;
    }

    console.log('Fallback: searching by customer email:', customerEmail);
    
    // Import the function to get orders by email
    const { getOrdersByEmail } = await import('@/app/utils/database');
    const orders = await getOrdersByEmail(customerEmail);
    
    // Find the most recent pending order for this customer
    const pendingOrder = orders.find(order => order.status === OrderStatus.PENDING);
    
    if (pendingOrder) {
      await updateOrderStatus(
        pendingOrder.id!,
        OrderStatus.CONFIRMED,
        session.payment_intent as string,
        session.id
      );
      console.log('Order confirmed via customer email fallback:', pendingOrder.id);
    } else {
      console.log('No pending order found for customer:', customerEmail);
    }

  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('Payment intent succeeded:', paymentIntent.id);
    
    // Try to find order by payment intent ID
    const { client } = await import('@/app/utils/database');
    const result = await client.execute({
      sql: 'SELECT id FROM orders WHERE stripe_payment_intent_id = ? AND status = ?',
      args: [paymentIntent.id, OrderStatus.PENDING]
    });

    if (result.rows.length > 0) {
      const orderId = result.rows[0][0] as string;
      await updateOrderStatus(orderId, OrderStatus.CONFIRMED, paymentIntent.id);
      console.log('Order confirmed via payment intent:', orderId);
    } else {
      console.log('No pending order found for payment intent:', paymentIntent.id);
    }

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    console.log('Payment intent failed:', paymentIntent.id);
    
    // Try to find order by payment intent ID
    const { client } = await import('@/app/utils/database');
    const result = await client.execute({
      sql: 'SELECT id FROM orders WHERE stripe_payment_intent_id = ? AND status = ?',
      args: [paymentIntent.id, OrderStatus.PENDING]
    });

    if (result.rows.length > 0) {
      const orderId = result.rows[0][0] as string;
      await updateOrderStatus(orderId, OrderStatus.CANCELLED, paymentIntent.id);
      console.log('Order cancelled due to payment failure:', orderId);
    } else {
      console.log('No pending order found for failed payment intent:', paymentIntent.id);
    }

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
} 