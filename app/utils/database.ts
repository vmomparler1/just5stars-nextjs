import { createClient } from '@libsql/client';

// Create Turso client
const client = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
});

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

// Order data interface
export interface OrderData {
  id?: string;
  product_name: string;
  product_id: string;
  quantity: number;
  price: number;
  discount_amount?: number;
  voucher_code?: string;
  customer_email: string;
  customer_phone: string;
  business_name: string;
  business_postcode: string;
  business_country: string;
  google_business_id?: string;
  stand_colors: string; // JSON string of stand configurations
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  status: OrderStatus;
  created_at?: string;
  updated_at?: string;
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create orders table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        product_name TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        voucher_code TEXT,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        business_name TEXT NOT NULL,
        business_postcode TEXT NOT NULL,
        business_country TEXT NOT NULL,
        google_business_id TEXT,
        stand_colors TEXT NOT NULL,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_term TEXT,
        utm_content TEXT,
        stripe_payment_intent_id TEXT,
        stripe_session_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email for faster lookups
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)
    `);

    // Create index on status for faster filtering
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
    `);

    // Create index on created_at for time-based queries
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Create a new order
export async function createOrder(orderData: Omit<OrderData, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  try {
    const result = await client.execute({
      sql: `
        INSERT INTO orders (
          product_name, product_id, quantity, price, discount_amount, voucher_code,
          customer_email, customer_phone, business_name, business_postcode, business_country,
          google_business_id, stand_colors, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          stripe_payment_intent_id, stripe_session_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        orderData.product_name,
        orderData.product_id,
        orderData.quantity,
        orderData.price,
        orderData.discount_amount || 0,
        orderData.voucher_code || null,
        orderData.customer_email,
        orderData.customer_phone,
        orderData.business_name,
        orderData.business_postcode,
        orderData.business_country,
        orderData.google_business_id || null,
        orderData.stand_colors,
        orderData.utm_source || null,
        orderData.utm_medium || null,
        orderData.utm_campaign || null,
        orderData.utm_term || null,
        orderData.utm_content || null,
        orderData.stripe_payment_intent_id || null,
        orderData.stripe_session_id || null,
        orderData.status
      ]
    });

    const orderId = result.rows[0][0] as string;
    console.log('Order created successfully:', orderId);
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Update order status and Stripe information
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  stripePaymentIntentId?: string,
  stripeSessionId?: string
): Promise<void> {
  try {
    await client.execute({
      sql: `
        UPDATE orders 
        SET status = ?, 
            stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
            stripe_session_id = COALESCE(?, stripe_session_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [status, stripePaymentIntentId || null, stripeSessionId || null, orderId]
    });

    console.log('Order status updated successfully:', { orderId, status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<OrderData | null> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [orderId]
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
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
      status: row[21] as OrderStatus,
      created_at: row[22] as string,
      updated_at: row[23] as string,
    };
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw error;
  }
}

// Get orders by email
export async function getOrdersByEmail(email: string): Promise<OrderData[]> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC',
      args: [email]
    });

    return result.rows.map(row => ({
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
      status: row[21] as OrderStatus,
      created_at: row[22] as string,
      updated_at: row[23] as string,
    }));
  } catch (error) {
    console.error('Error getting orders by email:', error);
    throw error;
  }
}

// Get order statistics
export async function getOrderStats(): Promise<{
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  cancelled_orders: number;
  total_revenue: number;
}> {
  try {
    const result = await client.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN status = 'confirmed' THEN (price - discount_amount) ELSE 0 END) as total_revenue
      FROM orders
    `);

    const row = result.rows[0];
    return {
      total_orders: row[0] as number,
      pending_orders: row[1] as number,
      confirmed_orders: row[2] as number,
      cancelled_orders: row[3] as number,
      total_revenue: row[4] as number,
    };
  } catch (error) {
    console.error('Error getting order stats:', error);
    throw error;
  }
}

// Export the client for custom queries if needed
export { client }; 