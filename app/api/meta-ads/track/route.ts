import { NextRequest, NextResponse } from "next/server";
import { 
  trackAddToCart, 
  trackInitiateCheckout, 
  trackPageView,
  createEventDataFromRequest 
} from "@/app/utils/metaAdsTracking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, eventData = {} } = body;

    console.log(`📥 Meta Ads API - Received ${eventType} tracking request`);

    // Create base event data from request
    const baseEventData = createEventDataFromRequest(request, eventData);

    let success = false;

    switch (eventType) {
      case 'AddToCart':
        console.log('🛒 Processing AddToCart event');
        success = await trackAddToCart(baseEventData);
        break;
      case 'InitiateCheckout':
        console.log('💳 Processing InitiateCheckout event');
        success = await trackInitiateCheckout(baseEventData);
        break;
      case 'PageView':
        console.log('👁️ Processing PageView event');
        success = await trackPageView(baseEventData);
        break;
      default:
        console.log(`❌ Unknown event type: ${eventType}`);
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        );
    }

    if (success) {
      console.log(`✅ Meta Ads API - ${eventType} tracking completed successfully`);
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      console.log(`❌ Meta Ads API - ${eventType} tracking failed`);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error tracking Meta Ads event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
} 