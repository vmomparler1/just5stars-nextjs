import { NextRequest, NextResponse } from "next/server";
import { createOrder, initializeDatabase, OrderStatus } from "@/app/utils/database";
import { getStoredUTMParameters } from "@/app/utils/utmTracking";

// Initialize database on first request
let isDbInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isDbInitialized) {
      await initializeDatabase();
      isDbInitialized = true;
    }

    const requestData = await request.json();
    
    // Debug: Log incoming request data
    console.log('=== STORE ORDER DEBUG ===');
    console.log('Received request data:', JSON.stringify(requestData, null, 2));
    
    // Validate required fields
    const requiredFields = [
      'product_name', 'product_id', 'quantity', 'price',
      'customer_email', 'customer_phone', 'business_name', 
      'business_postcode', 'business_country', 'stand_colors'
    ];
    
    for (const field of requiredFields) {
      if (!requestData[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Extract UTM parameters from request headers or body
    const utmParams = requestData.utm_params || {};
    console.log('Extracted UTM params:', utmParams);
    
    // Prepare order data
    const orderData = {
      product_name: requestData.product_name,
      product_id: requestData.product_id,
      quantity: requestData.quantity,
      price: requestData.price,
      discount_amount: requestData.discount_amount || 0,
      voucher_code: requestData.voucher_code || null,
      customer_email: requestData.customer_email,
      customer_phone: requestData.customer_phone,
      business_name: requestData.business_name,
      business_postcode: requestData.business_postcode,
      business_country: requestData.business_country,
      google_business_id: requestData.google_business_id || null,
      stand_colors: JSON.stringify(requestData.stand_colors),
      utm_source: utmParams.utm_source || null,
      utm_medium: utmParams.utm_medium || null,
      utm_campaign: utmParams.utm_campaign || null,
      utm_term: utmParams.utm_term || null,
      utm_content: utmParams.utm_content || null,
      stripe_payment_intent_id: requestData.stripe_payment_intent_id || null,
      stripe_session_id: requestData.stripe_session_id || null,
      status: OrderStatus.PENDING
    };

    console.log('Prepared order data for database:', JSON.stringify(orderData, null, 2));

    // Create order in database
    const orderId = await createOrder(orderData);

    console.log('Order stored successfully:', { orderId, customer_email: orderData.customer_email });

    // Send data to Zapier webhook
    try {
      const zapierData = {
        order_id: orderId,
        product_name: orderData.product_name,
        product_id: orderData.product_id,
        quantity: orderData.quantity,
        price: orderData.price,
        discount_amount: orderData.discount_amount,
        voucher_code: orderData.voucher_code,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        business_name: orderData.business_name,
        business_postcode: orderData.business_postcode,
        business_country: orderData.business_country,
        google_business_id: orderData.google_business_id,
        stand_colors: orderData.stand_colors,
        utm_source: orderData.utm_source,
        utm_medium: orderData.utm_medium,
        utm_campaign: orderData.utm_campaign,
        utm_term: orderData.utm_term,
        utm_content: orderData.utm_content,
        status: orderData.status,
        created_at: new Date().toISOString()
      };

      const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/12169059/uu9x15w/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zapierData),
      });

      if (zapierResponse.ok) {
        console.log('✅ Data sent to Zapier webhook successfully');
      } else {
        console.error('❌ Failed to send data to Zapier webhook:', zapierResponse.status);
      }
    } catch (zapierError) {
      console.error('❌ Error sending data to Zapier webhook:', zapierError);
      // Don't fail the entire request if Zapier webhook fails
    }

    console.log('=== END STORE ORDER DEBUG ===');

    return NextResponse.json({ 
      success: true, 
      order_id: orderId 
    }, { status: 201 });

  } catch (error) {
    console.error('Error storing order:', error);
    return NextResponse.json(
      { error: 'Failed to store order' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve order by ID
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('id');
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Initialize database if not already done
    if (!isDbInitialized) {
      await initializeDatabase();
      isDbInitialized = true;
    }

    const { getOrderById } = await import('@/app/utils/database');
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });

  } catch (error) {
    console.error('Error retrieving order:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
} 