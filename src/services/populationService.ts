/**
 * Population Service
 * Fetches population data from CountriesNow API
 */

import axios from 'axios';

const BASE_URL = 'https://countriesnow.space/api/v0.1';

export interface PopulationData {
  country?: string;
  city?: string;
  population?: number;
  populationCounts?: Array<{
    year: string;
    value: number;
  }>;
}

/**
 * Get population data for a country
 */
export async function getCountryPopulation(country: string): Promise<PopulationData | null> {
  try {
    const response = await axios.post(`${BASE_URL}/countries/population`, {
      country: country,
    });

    if (response.data?.data?.populationCounts) {
      const counts = response.data.data.populationCounts;
      // Get the most recent population count
      const latest = counts[counts.length - 1];

      return {
        country: response.data.data.country,
        population: latest?.value,
        populationCounts: counts,
      };
    }

    return null;
  } catch (error) {
    console.warn('Failed to fetch country population:', error);
    return null;
  }
}

/**
 * Get population data for a city
 */
export async function getCityPopulation(city: string, country?: string): Promise<PopulationData | null> {
  try {
    const response = await axios.post(`${BASE_URL}/countries/population/cities`, {
      city: city,
      country: country,
    });

    if (response.data?.data) {
      return {
        city: response.data.data.city,
        country: response.data.data.country,
        population: response.data.data.populationCounts?.[0]?.value,
        populationCounts: response.data.data.populationCounts,
      };
    }

    return null;
  } catch (error) {
    console.warn('Failed to fetch city population:', error);
    return null;
  }
}

/**
 * Extract location information from address components
 * Prioritizes city and county for population data
 */
export function extractLocationInfo(components: any): {
  city?: string;
  county?: string;
  country?: string;
} {
  const result: { city?: string; county?: string; country?: string } = {};

  if (!components) return result;

  // Extract country
  if (components.country) {
    result.country = components.country;
  }

  // Extract county
  if (components.county) {
    result.county = components.county;
  }

  // Extract city - try multiple possible fields
  if (components.city) {
    result.city = components.city;
  } else if (components.town) {
    result.city = components.town;
  } else if (components.village) {
    result.city = components.village;
  } else if (components.municipality) {
    result.city = components.municipality;
  }

  return result;
}

/**
 * Get population data for a location based on address components
 * Prioritizes city population, falls back to county
 */
export async function getLocationPopulation(components: any): Promise<PopulationData | null> {
  const { city, county, country } = extractLocationInfo(components);

  // Try city population first
  if (city && country) {
    const cityPop = await getCityPopulation(city, country);
    if (cityPop) return cityPop;
  }

  // Try county as fallback
  if (county && country) {
    const countyPop = await getCityPopulation(county, country);
    if (countyPop) return countyPop;
  }

  return null;
}

/**
 * Format population number with commas
 */
export function formatPopulation(population: number): string {
  return population.toLocaleString();
}
