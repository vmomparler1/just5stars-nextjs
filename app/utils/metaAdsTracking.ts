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
async function sendMetaEvent(serverEvent: ServerEvent): Promise<boolean> {
  if (!ACCESS_TOKEN || !PIXEL_ID) {
    console.error('Meta Ads tracking not configured - missing ACCESS_TOKEN or PIXEL_ID');
    return false;
  }

  try {
    const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_ID);
    eventRequest.setEvents([serverEvent]);
    
    const response = await eventRequest.execute();
    console.log('Meta Ads event sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending Meta Ads event:', error);
    return false;
  }
}

// Track Add to Cart event
export async function trackAddToCart(eventData: BaseEventData): Promise<boolean> {
  console.log('Tracking Add to Cart event');
  
  const serverEvent = createServerEvent('AddToCart', eventData);
  return await sendMetaEvent(serverEvent);
}

// Track Initiate Checkout event
export async function trackInitiateCheckout(eventData: BaseEventData): Promise<boolean> {
  console.log('Tracking Initiate Checkout event');
  
  const serverEvent = createServerEvent('InitiateCheckout', eventData);
  return await sendMetaEvent(serverEvent);
}

// Track Purchase event
export async function trackPurchase(eventData: BaseEventData & { value: number; currency: string }): Promise<boolean> {
  console.log('Tracking Purchase event');
  
  const serverEvent = createServerEvent('Purchase', eventData);
  return await sendMetaEvent(serverEvent);
}

// Track PageView event
export async function trackPageView(eventData: BaseEventData): Promise<boolean> {
  console.log('Tracking PageView event');
  
  const serverEvent = createServerEvent('PageView', eventData);
  return await sendMetaEvent(serverEvent);
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