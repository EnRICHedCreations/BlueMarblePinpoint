/**
 * Population Service
 * Fetches population data from Nominatim OpenStreetMap API
 */

import axios from 'axios';

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';
const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

export interface PopulationData {
  country?: string;
  city?: string;
  population?: number;
  place_name?: string;
}

/**
 * Get population data by searching for city/town boundary
 * Address-level coordinates don't have population, so we search for the city
 */
export async function getPopulationFromCoordinates(
  lat: number,
  lng: number
): Promise<PopulationData | null> {
  try {
    console.log('Fetching location details for coordinates:', lat, lng);

    // First, get the address details from coordinates
    const reverseResponse = await axios.get(NOMINATIM_REVERSE_URL, {
      params: {
        lat: lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
        zoom: 10, // Lower zoom to get city-level data
      },
      timeout: 5000,
    });

    console.log('Reverse geocode response:', reverseResponse.data);

    // Extract city/town/county name
    const address = reverseResponse.data?.address;
    const cityName = address?.city || address?.town || address?.village || address?.county;
    const countryName = address?.country;

    if (!cityName || !countryName) {
      console.log('No city/town name found in address');
      return null;
    }

    console.log(`Searching for population data for: ${cityName}, ${countryName}`);

    // Now search for the city boundary which will have population data
    const searchResponse = await axios.get(NOMINATIM_SEARCH_URL, {
      params: {
        city: cityName,
        country: countryName,
        format: 'json',
        extratags: 1,
        limit: 1,
      },
      timeout: 5000,
    });

    console.log('City search response:', searchResponse.data);

    if (searchResponse.data && searchResponse.data.length > 0) {
      const cityData = searchResponse.data[0];
      console.log('City data extratags:', cityData?.extratags);

      if (cityData?.extratags?.population) {
        const population = parseInt(cityData.extratags.population);

        if (!isNaN(population)) {
          const result = {
            population: population,
            city: cityName,
            country: countryName,
            place_name: cityData.display_name,
          };
          console.log('Population data found:', result);
          return result;
        }
      }
    }

    console.log('No population data found for city');
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
