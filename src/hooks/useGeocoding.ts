/**
 * useGeocoding Hook
 * Custom hook for geocoding operations
 */

import { useState, useCallback } from 'react';
import { geocodeAddress, isCoordinateString, parseCoordinates } from '../services/geocoding';
import { LocationData } from '../types/location';
import { GeocodingError, GeocodingStatus } from '../types/api';

interface UseGeocodingReturn {
  location: LocationData | null;
  status: GeocodingStatus;
  error: GeocodingError | null;
  search: (address: string) => Promise<void>;
  reset: () => void;
}

export function useGeocoding(): UseGeocodingReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [status, setStatus] = useState<GeocodingStatus>('idle');
  const [error, setError] = useState<GeocodingError | null>(null);

  const search = useCallback(async (address: string) => {
    setStatus('loading');
    setError(null);
    setLocation(null);

    try {
      // Check if input is coordinates
      if (isCoordinateString(address)) {
        const coords = parseCoordinates(address);
        if (coords) {
          setLocation({
            lat: coords.lat,
            lng: coords.lng,
            address: address,
            formatted: `${coords.lat}, ${coords.lng}`,
          });
          setStatus('success');
          return;
        }
      }

      // Geocode as address
      const result = await geocodeAddress(address);
      setLocation(result);
      setStatus('success');
    } catch (err) {
      const geocodingError = err as GeocodingError;
      setError(geocodingError);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setLocation(null);
    setStatus('idle');
    setError(null);
  }, []);

  return {
    location,
    status,
    error,
    search,
    reset,
  };
}
