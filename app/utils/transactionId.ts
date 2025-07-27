
/**
 * Generates a unique transaction ID for tracking purposes
 * Format: YYYYMMDD-HHMMSS-RANDOM
 */
export const generateTransactionId = (): string => {
  const now = new Date();
  
  // Format date as YYYYMMDD
  const date = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  
  // Format time as HHMMSS
  const time = now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  
  // Generate random 6-digit number
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `${date}-${time}-${random}`;
};

/**
 * Stores transaction ID in sessionStorage for consistent use across events
 */
export const getOrCreateTransactionId = (): string => {
  if (typeof window === 'undefined') return generateTransactionId();
  
  const stored = sessionStorage.getItem('transaction_id');
  if (stored) {
    return stored;
  }
  
  const newId = generateTransactionId();
  sessionStorage.setItem('transaction_id', newId);
  return newId;
};

/**
 * Clears the stored transaction ID (call this when starting a new transaction session)
 */
export const clearTransactionId = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('transaction_id');
  }
};
