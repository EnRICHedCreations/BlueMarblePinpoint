/**
 * Geocoding Service
 * Handles address geocoding using OpenCage Data API
 */

import axios, { AxiosError } from 'axios';
import { GeocodingResponse, GeocodingError, GeocodingResult } from '../types/api';
import { LocationData } from '../types/location';

const OPENCAGE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

/**
 * Geocode an address string to coordinates
 * @param address - The address to geocode
 * @returns Promise with location data
 * @throws GeocodingError if request fails
 */
export async function geocodeAddress(address: string): Promise<LocationData> {
  if (!API_KEY) {
    throw {
      message: 'OpenCage API key not found. Please add VITE_OPENCAGE_API_KEY to your .env file.',
      code: 403,
      retryable: false,
    } as GeocodingError;
  }

  if (!address || address.trim().length === 0) {
    throw {
      message: 'Please enter a valid address',
      retryable: false,
    } as GeocodingError;
  }

  try {
    const response = await axios.get<GeocodingResponse>(OPENCAGE_API_URL, {
      params: {
        q: address.trim(),
        key: API_KEY,
        limit: 1,
        no_annotations: 0,
      },
      timeout: 10000, // 10 second timeout
    });

    const data = response.data;

    // Check if we got any results
    if (!data.results || data.results.length === 0) {
      throw {
        message: `No results found for "${address}". Please try a different address.`,
        code: 404,
        retryable: false,
      } as GeocodingError;
    }

    const result: GeocodingResult = data.results[0];

    return {
      lat: result.geometry.lat,
      lng: result.geometry.lng,
      address: address.trim(),
      formatted: result.formatted,
      components: result.components,
    };
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<GeocodingResponse>;

      if (axiosError.code === 'ECONNABORTED') {
        throw {
          message: 'Request timed out. Please check your internet connection and try again.',
          retryable: true,
        } as GeocodingError;
      }

      if (axiosError.response) {
        const status = axiosError.response.status;

        if (status === 401 || status === 403) {
          throw {
            message: 'API key is invalid or expired. Please check your configuration.',
            code: status,
            retryable: false,
          } as GeocodingError;
        }

        if (status === 429) {
          throw {
            message: 'Rate limit exceeded. Please try again later.',
            code: status,
            retryable: true,
          } as GeocodingError;
        }

        throw {
          message: `Geocoding failed: ${axiosError.response.data?.status?.message || 'Unknown error'}`,
          code: status,
          retryable: status >= 500,
        } as GeocodingError;
      }

      // Network error
      throw {
        message: 'Network error. Please check your internet connection.',
        retryable: true,
      } as GeocodingError;
    }

    // Re-throw if it's already a GeocodingError
    if ((error as GeocodingError).message) {
      throw error;
    }

    // Unknown error
    throw {
      message: 'An unexpected error occurred. Please try again.',
      retryable: true,
    } as GeocodingError;
  }
}

/**
 * Validate if a string looks like coordinates (lat,lng)
 * @param input - The input string to validate
 * @returns true if input matches coordinate pattern
 */
export function isCoordinateString(input: string): boolean {
  const coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
  return coordPattern.test(input.trim());
}

/**
 * Parse coordinate string to lat/lng object
 * @param coordString - String in format "lat,lng"
 * @returns Coordinate object or null if invalid
 */
export function parseCoordinates(coordString: string): { lat: number; lng: number } | null {
  if (!isCoordinateString(coordString)) {
    return null;
  }

  const [latStr, lngStr] = coordString.split(',').map((s) => s.trim());
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  // Validate coordinate ranges
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
}
