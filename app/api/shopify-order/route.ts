import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { initializeDatabase, client, OrderStatus, OrderSource } from "@/app/utils/database";

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

let isDbInitialized = false;

const PRODUCT_MAPPING: { [key: string]: { [key: string]: string } | string } = {
  '10455931093325': {
    '53055309185357': 'Expositor NFC Blanco',
    '53055309218125': 'Expositor NFC Negro'
  },
  '10382133395789': 'Placa NFC Blanca'
};

function getProductName(productId: string, variantId: string): string {
  const mapping = PRODUCT_MAPPING[productId];
  if (typeof mapping === 'string') {
    return mapping;
  } else if (mapping && variantId && mapping[variantId]) {
    return mapping[variantId];
  }
  return 'Producto Shopify';
}

function extractBusinessInfo(properties: Array<{ name: string; value: string }> | undefined): { businessName: string; address: string } {
  if (!properties || properties.length === 0) {
    return { businessName: '', address: '' };
  }
  
  const empresaProperty = properties.find(p => p.name === 'Empresa');
  if (!empresaProperty || !empresaProperty.value) {
    return { businessName: '', address: '' };
  }
  
  const parts = empresaProperty.value.split(' - ');
  const businessName = parts[0]?.trim() || '';
  const address = parts.slice(1).join(' - ').trim() || '';
  
  return { businessName, address };
}

async function getGooglePlaceId(address: string): Promise<string | null> {
  if (!address || !GOOGLE_MAPS_API_KEY) {
    return null;
  }
  
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedAddress}&inputtype=textquery&fields=place_id&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].place_id;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Google Place ID:', error);
    return null;
  }
}

function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.error('SHOPIFY_WEBHOOK_SECRET is not configured');
    return false;
  }

  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(generatedHash),
    Buffer.from(hmacHeader)
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!isDbInitialized) {
      await initializeDatabase();
      isDbInitialized = true;
    }

    const body = await request.text();
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');

    if (!hmacHeader) {
      console.error('Missing Shopify HMAC header');
      return NextResponse.json(
        { error: 'Missing HMAC signature' },
        { status: 401 }
      );
    }

    if (!verifyShopifyWebhook(body, hmacHeader)) {
      console.error('Invalid Shopify webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const shopifyOrder = JSON.parse(body);
    console.log('Shopify order received:', shopifyOrder.id, shopifyOrder.order_number);

    const existingOrder = await client.execute({
      sql: 'SELECT id FROM orders WHERE shopify_order_id = ?',
      args: [String(shopifyOrder.id)]
    });

    if (existingOrder.rows.length > 0) {
      console.log('Shopify order already exists:', shopifyOrder.id);
      return NextResponse.json({ success: true, message: 'Order already exists' });
    }

    const customerEmail = shopifyOrder.email || shopifyOrder.customer?.email || '';
    const customerPhone = shopifyOrder.phone || shopifyOrder.customer?.phone || shopifyOrder.shipping_address?.phone || '';
    
    const shippingAddress = shopifyOrder.shipping_address || {};
    const billingAddress = shopifyOrder.billing_address || {};
    
    const businessPostcode = shippingAddress.zip || billingAddress.zip || '';
    const businessCountry = shippingAddress.country || billingAddress.country || 'ES';

    const lineItems = shopifyOrder.line_items || [];
    
    let extractedBusinessName = '';
    let extractedAddress = '';
    
    for (const item of lineItems) {
      if (item.properties && item.properties.length > 0) {
        console.log('Line item properties:', JSON.stringify(item.properties));
        const info = extractBusinessInfo(item.properties);
        console.log('Extracted business info:', info);
        if (info.businessName) {
          extractedBusinessName = info.businessName;
          extractedAddress = info.address;
          break;
        }
      }
    }
    
    const businessName = extractedBusinessName || shippingAddress.company || billingAddress.company || `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || 'Shopify Customer';
    console.log('Final business name:', businessName);
    console.log('Extracted address for Place ID lookup:', extractedAddress);
    
    let googlePlaceId: string | null = null;
    if (extractedAddress) {
      googlePlaceId = await getGooglePlaceId(extractedAddress);
      console.log('Google Place ID result:', googlePlaceId);
    } else {
      console.log('No address to look up for Place ID');
    }
    
    const productNames = lineItems.map((item: any) => {
      const productId = String(item.product_id);
      const variantId = String(item.variant_id);
      return getProductName(productId, variantId);
    }).join(', ') || 'Producto Shopify';
    
    const productIds = lineItems.map((item: any) => item.product_id || item.sku).join(', ') || '';
    const totalQuantity = lineItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    
    const standColors: Array<{color: string}> = [];
    for (const item of lineItems) {
      const productId = String(item.product_id);
      const variantId = String(item.variant_id);
      
      if (productId === '10455931093325') {
        const color = variantId === '53055309218125' ? 'negro' : 'blanco';
        for (let i = 0; i < (item.quantity || 1); i++) {
          standColors.push({ color });
        }
      }
    }
    console.log('Stand colors:', JSON.stringify(standColors));

    const totalPrice = parseFloat(shopifyOrder.total_price) || 0;
    const discountAmount = parseFloat(shopifyOrder.total_discounts) || 0;

    const discountCodes = shopifyOrder.discount_codes || [];
    const voucherCode = discountCodes.length > 0 ? discountCodes.map((d: any) => d.code).join(', ') : null;

    const utmSource = shopifyOrder.landing_site_ref || null;
    const refSource = shopifyOrder.referring_site || null;

    const result = await client.execute({
      sql: `
        INSERT INTO orders (
          product_name, product_id, quantity, price, discount_amount, voucher_code,
          customer_email, customer_phone, business_name, business_postcode, business_country,
          google_business_id, stand_colors, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          all_businesses, stripe_payment_intent_id, stripe_session_id, stripe_shipping_name,
          stripe_shipping_address_1, stripe_shipping_address_2, stripe_shipping_city, 
          stripe_shipping_postal_code, stripe_shipping_country, status, order_source,
          shopify_order_id, shopify_order_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        productNames,
        productIds,
        totalQuantity,
        totalPrice,
        discountAmount,
        voucherCode,
        customerEmail,
        customerPhone,
        businessName,
        businessPostcode,
        businessCountry,
        googlePlaceId,
        JSON.stringify(standColors),
        utmSource || refSource,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        shippingAddress.name || `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim(),
        shippingAddress.address1 || '',
        shippingAddress.address2 || '',
        shippingAddress.city || '',
        shippingAddress.zip || '',
        shippingAddress.country_code || shippingAddress.country || '',
        shopifyOrder.financial_status === 'paid' ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
        OrderSource.SHOPIFY,
        String(shopifyOrder.id),
        String(shopifyOrder.order_number || shopifyOrder.name || '')
      ]
    });

    const orderId = result.rows[0][0] as string;
    console.log('Shopify order stored successfully:', orderId, 'Shopify ID:', shopifyOrder.id);

    return NextResponse.json({ 
      success: true, 
      order_id: orderId,
      shopify_order_id: shopifyOrder.id 
    });

  } catch (error) {
    console.error('Error processing Shopify webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process Shopify order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Shopify webhook endpoint is active. Configure your Shopify webhook to POST to this URL.' 
  });
}
