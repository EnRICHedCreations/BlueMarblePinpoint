/**
 * Authentication Service
 * Email-based membership verification using lowballoffer.ai API
 */

import axios from 'axios';

const API_URL = 'https://lowballoffer.ai/api/check-member';
const STORAGE_KEY = 'geoflipper_user_email';

export interface AuthResult {
  success: boolean;
  isMember?: boolean;
  isPremiumAnnual?: boolean;
  error?: string;
  status?: number;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check membership status via API
 * Only allows Premium (Annual) members
 */
export async function checkMemberStatus(email: string): Promise<AuthResult> {
  try {
    const response = await axios.post(API_URL, {
      email: email,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    const data = response.data;

    // Check if user is a member
    if (data.isMember === true) {
      // Check if annual member (skool_annual_member === 1)
      const isPremiumAnnual = data.member && data.member.skool_annual_member === 1;

      if (isPremiumAnnual) {
        console.log('✅ SUCCESS: Annual member confirmed.');
        return { success: true, isMember: true, isPremiumAnnual: true };
      } else {
        console.log('❌ FAILURE: User is a member but not an annual member.');
        console.log('Member data:', data.member);
        return { success: true, isMember: true, isPremiumAnnual: false };
      }
    } else {
      console.log('❌ FAILURE: User is NOT a member.');
      return { success: true, isMember: false, isPremiumAnnual: false };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
        return {
          success: false,
          error: error.response.statusText,
          status: error.response.status,
        };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Save email to localStorage
 */
export function saveEmail(email: string): void {
  localStorage.setItem(STORAGE_KEY, email);
}

/**
 * Get stored email from localStorage
 */
export function getStoredEmail(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Clear stored email from localStorage
 */
export function clearStoredEmail(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if user is authenticated (has stored email)
 */
export function isAuthenticated(): boolean {
  return !!getStoredEmail();
}
