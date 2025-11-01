/**
 * GoHighLevel API Service
 * Search opportunities using GHL API
 */

const GHL_API_BASE = 'https://rest.gohighlevel.com/v1';
const GHL_API_KEY = 'pit-5bc67c72-0396-4b9f-9a7c-3d061aa76d83';

export interface GHLOpportunity {
  id: string;
  name: string;
  pipelineId?: string;
  pipelineStageId?: string;
  status?: string;
  contact?: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  monetaryValue?: number;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GHLSearchResult {
  success: boolean;
  opportunities?: GHLOpportunity[];
  error?: string;
}

/**
 * Search opportunities in GoHighLevel
 */
export async function searchOpportunities(
  query: string,
  locationId?: string
): Promise<GHLSearchResult> {
  try {
    const params = new URLSearchParams();

    if (locationId) {
      params.append('location_id', locationId);
    }

    if (query && query.trim()) {
      params.append('query', query.trim());
    }

    const url = `${GHL_API_BASE}/opportunities/search?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`GHL API Error: ${response.status} - ${response.statusText}`);
      return {
        success: false,
        error: `API returned ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();

    // Handle different response formats
    const opportunities = data.opportunities || data.data || [];

    return {
      success: true,
      opportunities: opportunities,
    };
  } catch (error) {
    console.error('GHL API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
