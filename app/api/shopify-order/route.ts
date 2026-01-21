import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { initializeDatabase, client, OrderStatus, OrderSource } from "@/app/utils/database";

function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

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

interface BusinessInfo {
  business_number: number;
  business_name: string;
  business_postcode: string;
  business_country: string;
  google_business_id: string;
  copy_from_first: boolean;
}

function extractBusinessFromProperties(properties: Array<{ name: string; value: string }> | undefined): { businessName: string; googlePlaceId: string } {
  if (!properties || properties.length === 0) {
    return { businessName: '', googlePlaceId: '' };
  }
  
  const empresaProperty = properties.find(p => p.name === 'Empresa');
  const placeIdProperty = properties.find(p => p.name === 'Google_Place_ID');
  
  let businessName = '';
  if (empresaProperty && empresaProperty.value) {
    const parts = empresaProperty.value.split(' - ');
    businessName = parts[0]?.trim() || '';
  }
  
  const googlePlaceId = placeIdProperty?.value || '';
  
  return { businessName, googlePlaceId };
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

    const lineItems = shopifyOrder.line_items || [];
    
    const allBusinesses: BusinessInfo[] = [];
    const standColors: Array<{color: string}> = [];
    let businessNumber = 0;
    let firstBusinessName = '';
    let firstGooglePlaceId = '';
    
    for (const item of lineItems) {
      const productId = String(item.product_id);
      const variantId = String(item.variant_id);
      
      // Handle Expositor (Stand) products
      if (productId === '10455931093325') {
        const color = variantId === '53055309218125' ? 'negro' : 'blanco';
        const quantity = item.quantity || 1;
        
        for (let i = 0; i < quantity; i++) {
          standColors.push({ color });
        }
        
        if (item.properties && item.properties.length > 0) {
          const { businessName, googlePlaceId } = extractBusinessFromProperties(item.properties);
          console.log('Extracted from stand properties:', { businessName, googlePlaceId });
          
          if (businessName || googlePlaceId) {
            // Expand business entries based on quantity
            for (let i = 0; i < quantity; i++) {
              businessNumber++;
              
              const isFirstBusiness = businessNumber === 1;
              if (isFirstBusiness) {
                firstBusinessName = businessName;
                firstGooglePlaceId = googlePlaceId;
              }
              
              allBusinesses.push({
                business_number: businessNumber,
                business_name: businessName,
                business_postcode: shippingAddress.zip || '',
                business_country: shippingAddress.country || 'España',
                google_business_id: googlePlaceId,
                copy_from_first: !isFirstBusiness
              });
            }
          }
        }
      }
      // Handle Metacrilato/Placa (Plaque) products
      else if (productId === '10382133395789') {
        const quantity = item.quantity || 1;
        
        // Add plaque to standColors with color 'blanco' (plaques are white)
        for (let i = 0; i < quantity; i++) {
          standColors.push({ color: 'blanco' });
        }
        
        if (item.properties && item.properties.length > 0) {
          const { businessName, googlePlaceId } = extractBusinessFromProperties(item.properties);
          console.log('Extracted from plaque properties:', { businessName, googlePlaceId });
          
          if (businessName || googlePlaceId) {
            // Expand business entries based on quantity
            for (let i = 0; i < quantity; i++) {
              businessNumber++;
              
              const isFirstBusiness = businessNumber === 1;
              if (isFirstBusiness) {
                firstBusinessName = businessName;
                firstGooglePlaceId = googlePlaceId;
              }
              
              allBusinesses.push({
                business_number: businessNumber,
                business_name: businessName,
                business_postcode: shippingAddress.zip || '',
                business_country: shippingAddress.country || 'España',
                google_business_id: googlePlaceId,
                copy_from_first: !isFirstBusiness
              });
            }
          }
        }
      }
    }
    
    console.log('All businesses:', JSON.stringify(allBusinesses));
    console.log('Stand colors:', JSON.stringify(standColors));
    
    const businessName = firstBusinessName || shippingAddress.company || billingAddress.company || `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || 'Shopify Customer';
    const businessPostcode = shippingAddress.zip || billingAddress.zip || '';
    const businessCountry = shippingAddress.country || billingAddress.country || 'ES';
    const googlePlaceId = firstGooglePlaceId || null;
    
    const expandedProductNames: string[] = [];
    const expandedProductIds: string[] = [];
    
    for (const item of lineItems) {
      const productId = String(item.product_id);
      const variantId = String(item.variant_id);
      const productName = getProductName(productId, variantId);
      const quantity = item.quantity || 1;
      
      for (let i = 0; i < quantity; i++) {
        expandedProductNames.push(productName);
        expandedProductIds.push(item.product_id || item.sku);
      }
    }
    
    const productNames = expandedProductNames.join(', ') || 'Producto Shopify';
    const productIds = expandedProductIds.join(', ') || '';
    const totalQuantity = lineItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

    const totalPrice = parseFloat(shopifyOrder.total_price) || 0;
    const discountAmount = parseFloat(shopifyOrder.total_discounts) || 0;

    const discountCodes = shopifyOrder.discount_codes || [];
    const voucherCode = discountCodes.length > 0 ? discountCodes.map((d: any) => d.code).join(', ') : null;

    const utmSource = shopifyOrder.landing_site_ref || null;
    const refSource = shopifyOrder.referring_site || null;

    const orderId = generateUUID();
    
    const result = await client.execute({
      sql: `
        INSERT INTO orders (
          id, product_name, product_id, quantity, price, discount_amount, voucher_code,
          customer_email, customer_phone, business_name, business_postcode, business_country,
          google_business_id, stand_colors, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          all_businesses, stripe_payment_intent_id, stripe_session_id, stripe_shipping_name,
          stripe_shipping_address_1, stripe_shipping_address_2, stripe_shipping_city, 
          stripe_shipping_postal_code, stripe_shipping_country, status, order_source,
          shopify_order_id, shopify_order_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(shopify_order_id) DO NOTHING
      `,
      args: [
        orderId,
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
        allBusinesses.length > 0 ? JSON.stringify(allBusinesses) : null,
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

    console.log('Shopify order stored successfully:', orderId, 'Shopify ID:', shopifyOrder.id, 'Rows affected:', result.rowsAffected);

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
