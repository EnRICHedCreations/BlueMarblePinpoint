/**
 * API Types
 * Type definitions for external API responses
 */

import { Coordinates, AddressComponents, MapBounds } from './location';

export interface GeocodingResponse {
  results: GeocodingResult[];
  status: {
    code: number;
    message: string;
  };
  rate: {
    limit: number;
    remaining: number;
    reset: number;
  };
  total_results: number;
}

export interface GeocodingResult {
  annotations?: {
    timezone?: {
      name: string;
    };
  };
  bounds?: MapBounds;
  components: AddressComponents;
  confidence: number;
  formatted: string;
  geometry: Coordinates;
}

export interface GeocodingError {
  message: string;
  code?: number;
  retryable?: boolean;
}

export type GeocodingStatus = 'idle' | 'loading' | 'success' | 'error';
