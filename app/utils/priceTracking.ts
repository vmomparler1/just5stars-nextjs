// Price parameter tracking utilities
import pricesData from '../data/prices.json';

// Cookie settings
const PR_COOKIE_NAME = 'just5stars_pr';
const COOKIE_DURATION = 30; // days

// Type definition for price entry
interface PriceEntry {
  pr_id?: string;
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
      
      console.log('Price parameter captured and stored (overriding any existing):', prValue);
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
 * Gets pricing configuration based on the stored price parameter
 * Returns the appropriate pricing data for pr=1419 or pr=2324
 * Defaults to pr=2324 configuration if no valid pr parameter or unrecognized value
 */
export const getPriceByParam = (): PriceEntry | null => {
  const prValue = getStoredPriceParameter();
  
  // Define valid pr values
  const validPrValues = ['1419', '2324'];
  const defaultPrValue = '2324';
  
  // Determine which pr value to use
  let targetPrValue = defaultPrValue;
  
  if (prValue && validPrValues.includes(prValue)) {
    targetPrValue = prValue;
    console.log(`Using stored price parameter: pr=${prValue}`);
  } else if (prValue) {
    console.log(`Invalid price parameter pr=${prValue}, defaulting to pr=${defaultPrValue}`);
  } else {
    console.log(`No price parameter stored, defaulting to pr=${defaultPrValue}`);
  }

  // Find the price entry with the target pr_id
  const priceEntry = pricesData.find((entry: any) => entry.pr_id === targetPrValue);
  
  if (priceEntry) {
    console.log(`Price configuration found for pr=${targetPrValue}:`, priceEntry);
    return priceEntry as PriceEntry;
  }

  console.log(`Error: No price configuration found for pr=${targetPrValue}`);
  return null;
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