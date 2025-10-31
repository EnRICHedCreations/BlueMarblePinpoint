/**
 * Formatting Utilities
 * Helper functions for data formatting
 */

import { Coordinates } from '../types/location';

/**
 * Format coordinates for display
 * @param coords - Coordinates object
 * @param precision - Decimal places (default: 6)
 * @returns Formatted string "lat, lng"
 */
export function formatCoordinates(coords: Coordinates, precision: number = 6): string {
  return `${coords.lat.toFixed(precision)}, ${coords.lng.toFixed(precision)}`;
}

/**
 * Format address for display (truncate if too long)
 * @param address - Address string
 * @param maxLength - Maximum length (default: 100)
 * @returns Formatted address
 */
export function formatAddress(address: string, maxLength: number = 100): string {
  if (address.length <= maxLength) {
    return address;
  }
  return address.substring(0, maxLength - 3) + '...';
}

/**
 * Format timestamp to readable string
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Generate unique ID
 * @returns Unique string ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
