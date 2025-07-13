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

    // Create base event data from request
    const baseEventData = createEventDataFromRequest(request, eventData);

    let success = false;

    switch (eventType) {
      case 'AddToCart':
        success = await trackAddToCart(baseEventData);
        break;
      case 'InitiateCheckout':
        success = await trackInitiateCheckout(baseEventData);
        break;
      case 'PageView':
        success = await trackPageView(baseEventData);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
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