/**
 * Population Service
 * Fetches population data from Nominatim OpenStreetMap API
 */

import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export interface PopulationData {
  country?: string;
  city?: string;
  population?: number;
  place_name?: string;
}

/**
 * Get population data from Nominatim reverse geocoding
 * Uses coordinates to fetch detailed location info including population
 */
export async function getPopulationFromCoordinates(
  lat: number,
  lng: number
): Promise<PopulationData | null> {
  try {
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        lat: lat,
        lon: lng,
        format: 'json',
        extratags: 1, // This enables the extratags field which contains population
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'BlueMarblePinpoint/1.0', // Nominatim requires User-Agent
      },
      timeout: 5000,
    });

    if (response.data?.extratags?.population) {
      const population = parseInt(response.data.extratags.population);

      if (!isNaN(population)) {
        return {
          population: population,
          city: response.data.address?.city ||
                response.data.address?.town ||
                response.data.address?.village ||
                response.data.address?.county,
          country: response.data.address?.country,
          place_name: response.data.name || response.data.display_name,
        };
      }
    }

    return null;
  } catch (error) {
    console.warn('Failed to fetch population from Nominatim:', error);
    return null;
  }
}


/**
 * Format population number with commas
 */
export function formatPopulation(population: number): string {
  return population.toLocaleString();
}
