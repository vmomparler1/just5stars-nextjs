// Price parameter tracking utilities
import pricesData from '../data/prices.json';
import pricesBData from '../data/prices_b.json';

// Cookie settings
const PR_COOKIE_NAME = 'just5stars_pr';
const COOKIE_DURATION = 30; // days

// Type definition for price entry
interface PriceEntry {
  number_of_stands: number;
  local_seo: number;
  full_service: number;
  price: number;
  stands_units_discount: number;
  shipping: number;
  payment_link: string;
  voucher: boolean;
  voucher_percent: number;
}

/**
 * Captures the 'pr' parameter from the current URL and stores it in cookies
 * Always overrides existing stored parameter when a new one is present
 */
export const capturePriceParameter = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const prValue = urlParams.get('pr');

    // If we found a pr parameter, always store it (override existing)
    if (prValue) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + COOKIE_DURATION);
      
      document.cookie = `${PR_COOKIE_NAME}=${encodeURIComponent(prValue)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
      
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
};

/**
 * Gets the appropriate prices data based on stored parameter
 * If cookie pr=1419, use prices_b.json, else use prices.json
 */
export const getPricesData = (): PriceEntry[] => {
  const storedParam = getStoredPriceParameter();
  
  // If stored parameter is 1419, use prices_b.json, otherwise use prices.json
  if (storedParam === '1419') {
    return pricesBData as PriceEntry[];
  }
  
  return pricesData as PriceEntry[];
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