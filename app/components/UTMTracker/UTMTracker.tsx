"use client";

import { useEffect, useState } from 'react';
import { captureUTMParameters } from '@/app/utils/utmTracking';

/**
 * UTM Tracker component that captures UTM parameters from any page
 * This component should be included in the root layout to work on all pages
 */
export default function UTMTracker() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Only run on client side after mount
    
    // Capture UTM parameters when any page loads
    captureUTMParameters();
  }, [mounted]);

  // This component doesn't render anything visible
  return null;
} 