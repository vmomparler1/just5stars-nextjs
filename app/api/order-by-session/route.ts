import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, client } from "@/app/utils/database";

// Initialize database on first request
let isDbInitialized = false;

export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isDbInitialized) {
      await initializeDatabase();
      isDbInitialized = true;
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Checkout session ID is required' },
        { status: 400 }
      );
    }

    // Query order by Stripe session ID
    const result = await client.execute({
      sql: 'SELECT * FROM orders WHERE stripe_session_id = ? AND status = ?',
      args: [sessionId, 'confirmed']
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not confirmed' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const order = {
      id: row[0] as string,
      product_name: row[1] as string,
      product_id: row[2] as string,
      quantity: row[3] as number,
      price: row[4] as number,
      discount_amount: row[5] as number,
      voucher_code: row[6] as string,
      customer_email: row[7] as string,
      customer_phone: row[8] as string,
      business_name: row[9] as string,
      business_postcode: row[10] as string,
      business_country: row[11] as string,
      google_business_id: row[12] as string,
      stand_colors: row[13] as string,
      utm_source: row[14] as string,
      utm_medium: row[15] as string,
      utm_campaign: row[16] as string,
      utm_term: row[17] as string,
      utm_content: row[18] as string,
      stripe_payment_intent_id: row[19] as string,
      stripe_session_id: row[20] as string,
      status: row[21] as string,
      created_at: row[22] as string,
      updated_at: row[23] as string,
    };

    // Calculate estimated delivery date (3-5 business days)
    const orderDate = new Date(order.created_at);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 4); // 4 days delivery estimate
    
    // Format delivery date as YYYY-MM-DD
    const estimatedDeliveryDate = deliveryDate.toISOString().split('T')[0];
    
    // Map country names to ISO codes
    const countryCodeMap: { [key: string]: string } = {
      'España': 'ES',
      'Spain': 'ES',
      'France': 'FR',
      'Francia': 'FR',
      'Italy': 'IT',
      'Italia': 'IT',
      'Portugal': 'PT',
      'Germany': 'DE',
      'Alemania': 'DE'
    };
    
    const countryCode = countryCodeMap[order.business_country] || 'ES';

    const orderInfo = {
      order_id: order.id,
      customer_email: order.customer_email,
      delivery_country: countryCode,
      estimated_delivery_date: estimatedDeliveryDate,
      business_name: order.business_name,
      product_name: order.product_name,
      quantity: order.quantity,
      total_price: order.price - (order.discount_amount || 0),
      voucher_code: order.voucher_code
    };

    return NextResponse.json({ success: true, order: orderInfo }, { status: 200 });

  } catch (error) {
    console.error('Error retrieving order by session ID:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order information' },
      { status: 500 }
    );
  }
} 