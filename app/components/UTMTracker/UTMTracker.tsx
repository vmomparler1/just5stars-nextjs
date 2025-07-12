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
  }, []);

  // This component doesn't render anything visible
  return null;
} 