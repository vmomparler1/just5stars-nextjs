import { ServerEvent, EventRequest, UserData, CustomData } from 'facebook-nodejs-business-sdk';
import crypto from 'crypto';

// Meta Ads configuration
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PIXEL_ID = process.env.META_PIXEL_ID;

// Helper function to hash data (required for some fields)
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

// Helper function to get client IP from request
function getClientIP(request: any): string {
  return request.headers['x-forwarded-for']?.split(',')[0] || 
         request.headers['x-real-ip'] || 
         request.connection?.remoteAddress || 
         '127.0.0.1';
}

// Base event interface
interface BaseEventData {
  eventSourceUrl: string;
  clientUserAgent: string;
  clientIPAddress?: string;
  email?: string;
  phone?: string;
  eventId?: string;
  value?: number;
  currency?: string;
}

// Create a server event for Meta Ads
function createServerEvent(eventName: string, eventData: BaseEventData): ServerEvent {
  const serverEvent = new ServerEvent();
  
  // Set event details
  serverEvent.setEventName(eventName);
  serverEvent.setEventTime(Math.floor(Date.now() / 1000));
  serverEvent.setEventSourceUrl(eventData.eventSourceUrl);
  serverEvent.setActionSource('website');
  
  if (eventData.eventId) {
    serverEvent.setEventId(eventData.eventId);
  }

  // Set user data
  const userData = new UserData();
  
  if (eventData.clientIPAddress) {
    userData.setClientIpAddress(eventData.clientIPAddress);
  }
  
  if (eventData.clientUserAgent) {
    userData.setClientUserAgent(eventData.clientUserAgent);
  }
  
  if (eventData.email) {
    userData.setEmail(hashData(eventData.email));
  }
  
  if (eventData.phone) {
    userData.setPhone(hashData(eventData.phone));
  }
  
  // zipCode removed - not needed for Meta Ads tracking
  
  serverEvent.setUserData(userData);

  // Set custom data for purchase events
  if (eventData.value !== undefined || eventData.currency) {
    const customData = new CustomData();
    
    if (eventData.value !== undefined) {
      customData.setValue(eventData.value);
    }
    
    if (eventData.currency) {
      customData.setCurrency(eventData.currency);
    }
    
    serverEvent.setCustomData(customData);
  }

  return serverEvent;
}

// Send event to Meta Ads
async function sendMetaEvent(serverEvent: ServerEvent, eventType: string, context?: string): Promise<boolean> {
  if (!ACCESS_TOKEN || !PIXEL_ID) {
    console.error('Meta Ads tracking not configured - missing ACCESS_TOKEN or PIXEL_ID');
    return false;
  }

  try {
    const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_ID);
    eventRequest.setEvents([serverEvent]);
    
    console.log(`📊 Meta Ads - Sending ${eventType} event${context ? ` (${context})` : ''}`);
    
    const response = await eventRequest.execute();
    console.log(`✅ Meta Ads - ${eventType} event sent successfully:`, {
      eventType,
      context: context || 'unknown',
      eventsReceived: response._events_received,
      facebookTraceId: response._fbtrace_id
    });
    return true;
  } catch (error) {
    console.error(`❌ Meta Ads - Error sending ${eventType} event:`, error);
    return false;
  }
}

// Track Add to Cart event
export async function trackAddToCart(eventData: BaseEventData): Promise<boolean> {
  console.log('🛒 Preparing AddToCart event with data:', {
    eventId: eventData.eventId,
    hasEmail: !!eventData.email,
    hasPhone: !!eventData.phone,
    value: eventData.value,
    currency: eventData.currency
  });
  
  const serverEvent = createServerEvent('AddToCart', eventData);
  return await sendMetaEvent(serverEvent, 'AddToCart', 'Order Modal Opened');
}

// Track Initiate Checkout event
export async function trackInitiateCheckout(eventData: BaseEventData): Promise<boolean> {
  console.log('💳 Preparing InitiateCheckout event with data:', {
    eventId: eventData.eventId,
    hasEmail: !!eventData.email,
    hasPhone: !!eventData.phone,
    value: eventData.value,
    currency: eventData.currency
  });
  
  const serverEvent = createServerEvent('InitiateCheckout', eventData);
  return await sendMetaEvent(serverEvent, 'InitiateCheckout', 'Payment Button Clicked');
}

// Track Purchase event
export async function trackPurchase(eventData: BaseEventData & { value: number; currency: string }): Promise<boolean> {
  console.log('💰 Preparing Purchase event with data:', {
    eventId: eventData.eventId,
    hasEmail: !!eventData.email,
    hasPhone: !!eventData.phone,
    value: eventData.value,
    currency: eventData.currency
  });
  
  const serverEvent = createServerEvent('Purchase', eventData);
  return await sendMetaEvent(serverEvent, 'Purchase', 'Stripe Payment Confirmed');
}

// Track PageView event
export async function trackPageView(eventData: BaseEventData): Promise<boolean> {
  console.log('👁️ Preparing PageView event with data:', {
    eventId: eventData.eventId,
    eventSourceUrl: eventData.eventSourceUrl
  });
  
  const serverEvent = createServerEvent('PageView', eventData);
  return await sendMetaEvent(serverEvent, 'PageView', 'Page Load');
}

// Helper function to create event data from Next.js request
export function createEventDataFromRequest(
  request: any, 
  additionalData: Partial<BaseEventData> = {}
): BaseEventData {
  return {
    eventSourceUrl: request.headers.referer || request.url || 'https://just5stars.com',
    clientUserAgent: request.headers['user-agent'] || 'Unknown',
    clientIPAddress: getClientIP(request),
    ...additionalData
  };
}

// Client-side tracking helper (for browser events)
export function createEventDataFromBrowser(additionalData: Partial<BaseEventData> = {}): BaseEventData {
  return {
    eventSourceUrl: typeof window !== 'undefined' ? window.location.href : 'https://just5stars.com',
    clientUserAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    ...additionalData
  };
} 