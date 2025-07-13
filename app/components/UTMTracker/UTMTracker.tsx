"use client";

import { useEffect } from 'react';
import { captureUTMParameters } from '@/app/utils/utmTracking';

/**
 * UTM Tracker component that captures UTM parameters from any page
 * This component should be included in the root layout to work on all pages
 */
export default function UTMTracker() {
  useEffect(() => {
    // Capture UTM parameters when any page loads
    captureUTMParameters();
    
    // Track PageView event for Meta Ads
    fetch('/api/meta-ads/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'PageView',
        eventData: {
          eventId: `pageview_${Date.now()}`,
        }
      }),
    }).catch(error => {
      console.error('Error tracking PageView:', error);
    });
  }, []);

  // This component doesn't render anything visible
  return null;
} 