
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleAnalytics() {
  const [mounted, setMounted] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check cookie consent status
  useEffect(() => {
    if (!mounted) return;

    const checkCookieConsent = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      setCookiesAccepted(cookieConsent === 'accepted');
    };

    // Check initially
    checkCookieConsent();

    // Listen for storage changes (when user makes a choice in the banner)
    window.addEventListener('storage', checkCookieConsent);
    
    // Also listen for custom event when banner choice is made on same tab
    const handleCookieChoice = (event: CustomEvent) => {
      setCookiesAccepted(event.detail === 'accepted');
    };

    window.addEventListener('cookieChoice', handleCookieChoice as EventListener);

    return () => {
      window.removeEventListener('storage', checkCookieConsent);
      window.removeEventListener('cookieChoice', handleCookieChoice as EventListener);
    };
  }, [mounted]);

  if (!mounted || !cookiesAccepted) {
    return null;
  }

  return (
    <>
      {/* Initialize dataLayer */}
      <Script
        id="init-datalayer"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];`,
        }}
      />
      
      {/* Google Tag Manager */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T6PW5XLV');`,
        }}
      />
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-T6PW5XLV"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
