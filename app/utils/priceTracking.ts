// Price parameter tracking utilities

// Cookie settings
const PR_COOKIE_NAME = 'just5stars_pr';
const COOKIE_DURATION = 30; // days

/**
 * Captures the 'pr' parameter from the current URL and stores it in cookies
 */
export const capturePriceParameter = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const prValue = urlParams.get('pr');

    // If we found a pr parameter, store it in cookies
    if (prValue) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + COOKIE_DURATION);
      
      document.cookie = `${PR_COOKIE_NAME}=${encodeURIComponent(prValue)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
      
      console.log('Price parameter captured and stored:', prValue);
    }
  } catch (error) {
    console.error('Error capturing price parameter:', error);
  }
};

/**
 * Retrieves the stored price parameter from cookies
 */
export const getStoredPriceParameter = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    const prCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${PR_COOKIE_NAME}=`)
    );

    if (prCookie) {
      const prValue = decodeURIComponent(prCookie.split('=')[1]);
      return prValue;
    }
  } catch (error) {
    console.error('Error retrieving price parameter:', error);
  }

  return null;
};

/**
 * Clears stored price parameter from cookies
 */
export const clearPriceParameter = (): void => {
  if (typeof window === 'undefined') return;

  document.cookie = `${PR_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log('Price parameter cleared');
};

/**
 * Gets a summary of currently stored price parameter (for debugging)
 */
export const getPriceParameterSummary = (): string => {
  const prValue = getStoredPriceParameter();
  
  if (!prValue) {
    return 'No price parameter stored';
  }

  return `Stored price parameter: pr=${prValue}`;
};