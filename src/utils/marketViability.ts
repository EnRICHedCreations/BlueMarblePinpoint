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
 * - 0-10,000: Red, "Unlikely a Good Market"
 * - 10,000-30,000: Orange, "Likely a Decent Market"
 * - 30,000-50,000: Yellow, "Decent Market"
 * - 50,000-100,000: Light green, "Good Market"
 * - Above 100,000: Dark green, "Great Market"
 */
export function getMarketStatus(population: number): MarketStatus {
  if (population < 10000) {
    return {
      label: 'Unlikely a Good Market',
      color: '#D32F2F',
      backgroundColor: '#FFEBEE',
    };
  } else if (population < 30000) {
    return {
      label: 'Likely a Decent Market',
      color: '#F57C00',
      backgroundColor: '#FFF3E0',
    };
  } else if (population < 50000) {
    return {
      label: 'Decent Market',
      color: '#FBC02D',
      backgroundColor: '#FFFDE7',
    };
  } else if (population < 100000) {
    return {
      label: 'Good Market',
      color: '#7CB342',
      backgroundColor: '#F1F8E9',
    };
  } else {
    return {
      label: 'Great Market',
      color: '#388E3C',
      backgroundColor: '#E8F5E9',
    };
  }
}
