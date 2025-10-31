/**
 * Market Viability Utils
 * Determines market viability based on population
 */

export interface MarketStatus {
  label: string;
  color: string;
  backgroundColor: string;
}

/**
 * Get market status based on population
 * - Below 5,000: Red, "Likely Bad Market"
 * - 5,000-10,000: Red, "Maybe Okay Market"
 * - 10,000-30,000: Yellow, "Okay Market"
 * - Above 30,000: Green, "Good Market"
 */
export function getMarketStatus(population: number): MarketStatus {
  if (population < 5000) {
    return {
      label: 'Likely Bad Market',
      color: '#D32F2F',
      backgroundColor: '#FFEBEE',
    };
  } else if (population < 10000) {
    return {
      label: 'Maybe Okay Market',
      color: '#D32F2F',
      backgroundColor: '#FFEBEE',
    };
  } else if (population <= 30000) {
    return {
      label: 'Okay Market',
      color: '#F57C00',
      backgroundColor: '#FFF3E0',
    };
  } else {
    return {
      label: 'Good Market',
      color: '#388E3C',
      backgroundColor: '#E8F5E9',
    };
  }
}
