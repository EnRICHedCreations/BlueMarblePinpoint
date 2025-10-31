/**
 * Validation Utilities
 * Helper functions for input validation
 */

/**
 * Validate if input is not empty
 * @param input - String to validate
 * @returns true if input has content
 */
export function isNotEmpty(input: string): boolean {
  return input.trim().length > 0;
}

/**
 * Validate if coordinates are within valid ranges
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns true if coordinates are valid
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 200); // Limit length
}

/**
 * Validate address string format
 * @param address - Address to validate
 * @returns Object with isValid boolean and error message
 */
export function validateAddress(address: string): {
  isValid: boolean;
  error?: string;
} {
  const sanitized = sanitizeInput(address);

  if (!isNotEmpty(sanitized)) {
    return {
      isValid: false,
      error: 'Please enter an address',
    };
  }

  if (sanitized.length < 3) {
    return {
      isValid: false,
      error: 'Address is too short',
    };
  }

  return { isValid: true };
}
