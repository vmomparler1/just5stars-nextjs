import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, OrderStatus, initializeDatabase, getOrderById, getOrdersByEmail } from "@/app/utils/database";
import { headers } from "next/headers";
import crypto from "crypto";

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
    
    let confirmedOrderId: string | null = null;
    let confirmedOrder: any = null;
    
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
      
      confirmedOrderId = clientReferenceId;
      confirmedOrder = await getOrderById(clientReferenceId);
    } else {
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
        
        confirmedOrderId = pendingOrder.id!;
        confirmedOrder = await getOrderById(pendingOrder.id!);
      } else {
        console.log('No pending order found for customer:', customerEmail);
      }
    }
    
    // Send confirmed order data to Zapier webhook
    if (confirmedOrder && confirmedOrderId) {
      try {
        const zapierData = {
          order_id: confirmedOrderId,
          product_name: confirmedOrder.product_name,
          product_id: confirmedOrder.product_id,
          quantity: confirmedOrder.quantity,
          price: confirmedOrder.price,
          discount_amount: confirmedOrder.discount_amount,
          voucher_code: confirmedOrder.voucher_code,
          customer_email: confirmedOrder.customer_email,
          customer_phone: confirmedOrder.customer_phone,
          business_name: confirmedOrder.business_name,
          business_postcode: confirmedOrder.business_postcode,
          business_country: confirmedOrder.business_country,
          google_business_id: confirmedOrder.google_business_id,
          stand_colors: confirmedOrder.stand_colors,
          utm_source: confirmedOrder.utm_source,
          utm_medium: confirmedOrder.utm_medium,
          utm_campaign: confirmedOrder.utm_campaign,
          utm_term: confirmedOrder.utm_term,
          utm_content: confirmedOrder.utm_content,
          status: 'confirmed',
          stripe_payment_intent_id: session.payment_intent,
          stripe_session_id: session.id,
          confirmed_at: new Date().toISOString()
        };

        const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/12169059/uu9x15w/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(zapierData),
        });

        if (zapierResponse.ok) {
          console.log('✅ Confirmed order sent to Zapier webhook successfully');
        } else {
          console.error('❌ Failed to send confirmed order to Zapier webhook:', zapierResponse.status);
        }
      } catch (zapierError) {
        console.error('❌ Error sending confirmed order to Zapier webhook:', zapierError);
      }

      // Send customer confirmation email with BCC to business
      try {
        console.log('📧 Sending customer confirmation email...');
        const customerEmailResponse = await fetch('http://localhost:3000/api/send-customer-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...confirmedOrder,
            stripe_session_id: session.id
          }),
        });

        if (customerEmailResponse.ok) {
          console.log('✅ Customer confirmation email sent successfully');
        } else {
          console.error('❌ Failed to send customer confirmation email:', await customerEmailResponse.text());
        }
      } catch (emailError) {
        console.error('❌ Error sending customer confirmation email:', emailError);
      }
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