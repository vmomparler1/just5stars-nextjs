import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, OrderStatus, initializeDatabase, getOrderById, getOrdersByEmail } from "@/app/utils/database";
import { headers } from "next/headers";
import crypto from "crypto";
import { trackPurchase, createEventDataFromRequest } from "@/app/utils/metaAdsTracking";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!endpointSecret) {
  console.error('STRIPE_WEBHOOK_SECRET environment variable is not set');
};

// Initialize database on first request
let isDbInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isDbInitialized) {
      await initializeDatabase();
      isDbInitialized = true;
    }

    // Check if webhook secret is configured
    if (!endpointSecret) {
      console.error('STRIPE_WEBHOOK_SECRET environment variable is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    console.log('Webhook request received:', {
      bodyLength: body.length,
      hasSignature: !!signature,
      secretConfigured: !!endpointSecret
    });

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature manually
    // Parse the signature header: t=timestamp,v1=signature1,v1=signature2
    const sigElements = signature.split(',');
    const timestamp = sigElements.find(el => el.startsWith('t='))?.split('=')[1];
    const signatures = sigElements.filter(el => el.startsWith('v1=')).map(el => el.split('=')[1]);
    
    if (!timestamp || signatures.length === 0) {
      console.error('Invalid signature format');
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      );
    }
    
    // Create the signed payload
    const signedPayload = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', endpointSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');
    
    // Check if any of the signatures match
    const isSignatureValid = signatures.some(sig => sig === expectedSignature);
    
    if (!isSignatureValid) {
      console.error('Webhook signature verification failed');
      console.error('Expected signature:', expectedSignature);
      console.error('Received signatures:', signatures);
      console.error('Timestamp:', timestamp);
      console.error('Body length:', body.length);
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
      
      // Get order details for Meta tracking
      const order = await getOrderById(clientReferenceId);
      
      // Update order status using the direct order ID
      await updateOrderStatus(
        clientReferenceId,
        OrderStatus.CONFIRMED,
        session.payment_intent as string,
        session.id
      );
      console.log('Order confirmed via client_reference_id:', clientReferenceId);
      
      // Track Purchase event
      if (order) {
        await trackPurchase({
          eventSourceUrl: 'https://just5stars.com',
          clientUserAgent: 'Stripe-Webhook',
          eventId: `purchase_${clientReferenceId}`,
          email: order.customer_email,
          phone: order.customer_phone,
          zipCode: order.business_postcode,
          value: order.price - (order.discount_amount || 0),
          currency: 'EUR'
        });
      }
      
      return;
    }
    
    // Fallback: Try to find order by customer email
    const customerEmail = session.customer_details?.email || session.customer_email;
    
    if (!customerEmail) {
      console.error('No client_reference_id or customer email found in session');
      return;
    }

    console.log('Fallback: searching by customer email:', customerEmail);
    
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
      
      // Track Purchase event
      await trackPurchase({
        eventSourceUrl: 'https://just5stars.com',
        clientUserAgent: 'Stripe-Webhook',
        eventId: `purchase_${pendingOrder.id}`,
        email: pendingOrder.customer_email,
        phone: pendingOrder.customer_phone,
        zipCode: pendingOrder.business_postcode,
        value: pendingOrder.price - (pendingOrder.discount_amount || 0),
        currency: 'EUR'
      });
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