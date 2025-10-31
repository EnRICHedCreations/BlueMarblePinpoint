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
    console.log('Fetching population for coordinates:', lat, lng);

    const response = await axios.get(NOMINATIM_URL, {
      params: {
        lat: lat,
        lon: lng,
        format: 'json',
        extratags: 1, // This enables the extratags field which contains population
        addressdetails: 1,
      },
      // Note: User-Agent header cannot be set in browser (browser blocks it for security)
      // Nominatim will use the browser's default User-Agent
      timeout: 5000,
    });

    console.log('Nominatim response:', response.data);
    console.log('Extratags:', response.data?.extratags);
    console.log('Population value:', response.data?.extratags?.population);

    if (response.data?.extratags?.population) {
      const population = parseInt(response.data.extratags.population);

      if (!isNaN(population)) {
        const result = {
          population: population,
          city: response.data.address?.city ||
                response.data.address?.town ||
                response.data.address?.village ||
                response.data.address?.county,
          country: response.data.address?.country,
          place_name: response.data.name || response.data.display_name,
        };
        console.log('Population data found:', result);
        return result;
      }
    }

    console.log('No population data found in Nominatim response');
    return null;
  } catch (error) {
    console.error('Failed to fetch population from Nominatim:', error);
    return null;
  }
}


/**
 * Format population number with commas
 */
export function formatPopulation(population: number): string {
  return population.toLocaleString();
}
