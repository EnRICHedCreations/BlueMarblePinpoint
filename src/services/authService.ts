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
      console.log('✅ SUCCESS: Member confirmed.');
      return { success: true, isMember: true };
    } else {
      console.log('❌ FAILURE: User is NOT a member.');
      return { success: true, isMember: false };
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
