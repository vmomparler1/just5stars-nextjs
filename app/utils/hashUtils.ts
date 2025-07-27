
import crypto from 'crypto';

/**
 * Hash an email address using SHA-256
 * @param email - The email address to hash
 * @returns The hashed email as a hexadecimal string
 */
export function hashEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  // Normalize email (lowercase and trim)
  const normalizedEmail = email.toLowerCase().trim();
  
  // Create SHA-256 hash
  return crypto.createHash('sha256').update(normalizedEmail).digest('hex');
}

/**
 * Hash a phone number using SHA-256
 * @param phone - The phone number to hash
 * @returns The hashed phone as a hexadecimal string
 */
export function hashPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Normalize phone (remove spaces, dashes, parentheses, and leading +)
  const normalizedPhone = phone.replace(/[\s\-\(\)\+]/g, '').trim();
  
  // Create SHA-256 hash
  return crypto.createHash('sha256').update(normalizedPhone).digest('hex');
}
