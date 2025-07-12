// UTM parameter tracking utilities

// UTM parameters to track
const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content'
];

// Cookie settings
const COOKIE_NAME = 'just5stars_utm';
const COOKIE_DURATION = 30; // days

/**
 * Captures UTM parameters from the current URL and stores them in cookies
 */
export const captureUTMParameters = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData: { [key: string]: string } = {};
    let hasUTMParams = false;

    // Check for UTM parameters
    UTM_PARAMS.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmData[param] = value;
        hasUTMParams = true;
      }
    });

    // If we found UTM parameters, store them in cookies
    if (hasUTMParams) {
      const utmString = JSON.stringify(utmData);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + COOKIE_DURATION);
      
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(utmString)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
      
      console.log('UTM parameters captured and stored:', utmData);
    }
  } catch (error) {
    console.error('Error capturing UTM parameters:', error);
  }
};

/**
 * Retrieves UTM parameters from cookies
 */
export const getStoredUTMParameters = (): { [key: string]: string } | null => {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    const utmCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );

    if (utmCookie) {
      const utmString = decodeURIComponent(utmCookie.split('=')[1]);
      return JSON.parse(utmString);
    }
  } catch (error) {
    console.error('Error retrieving UTM parameters:', error);
  }

  return null;
};

/**
 * Appends UTM parameters to a given URL
 */
export const appendUTMToUrl = (url: string): string => {
  const utmParams = getStoredUTMParameters();
  
  if (!utmParams || Object.keys(utmParams).length === 0) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    
    // Add UTM parameters to the URL
    Object.entries(utmParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });

    const finalUrl = urlObj.toString();
    console.log('UTM parameters appended to URL:', { originalUrl: url, finalUrl, utmParams });
    
    return finalUrl;
  } catch (error) {
    console.error('Error appending UTM parameters to URL:', error);
    return url;
  }
};

/**
 * Clears stored UTM parameters from cookies
 */
export const clearUTMParameters = (): void => {
  if (typeof window === 'undefined') return;

  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log('UTM parameters cleared');
};

/**
 * Gets a summary of currently stored UTM parameters (for debugging)
 */
export const getUTMSummary = (): string => {
  const utmParams = getStoredUTMParameters();
  
  if (!utmParams || Object.keys(utmParams).length === 0) {
    return 'No UTM parameters stored';
  }

  return `Stored UTM parameters: ${Object.entries(utmParams)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ')}`;
}; 