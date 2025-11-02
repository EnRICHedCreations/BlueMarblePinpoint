/**
 * GoHighLevel API Service
 * Search opportunities using GHL API v2
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_KEY = 'pit-5bc67c72-0396-4b9f-9a7c-3d061aa76d83';
const GHL_API_VERSION = '2021-07-28';
const GHL_LOCATION_ID = '5sLuFTeElBBpk6eVuqkW';

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
    address1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
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
 * Format address from opportunity contact data
 */
export function formatOpportunityAddress(opportunity: GHLOpportunity): string | null {
  if (!opportunity.contact) {
    return null;
  }

  const { address1, city, state, postalCode, country } = opportunity.contact;

  // Build address parts that exist
  const parts: string[] = [];

  if (address1) parts.push(address1);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (postalCode) parts.push(postalCode);
  if (country) parts.push(country);

  return parts.length > 0 ? parts.join(', ') : null;
}

/**
 * Search opportunities in GoHighLevel using API v2
 */
export async function searchOpportunities(
  query: string,
  locationId?: string
): Promise<GHLSearchResult> {
  try {
    const url = `${GHL_API_BASE}/opportunities/search`;

    // Use provided location ID or default
    const activeLocationId = locationId || GHL_LOCATION_ID;

    // Build request body for v2 API (use camelCase, not snake_case)
    const requestBody: any = {
      locationId: activeLocationId,
    };

    if (query && query.trim()) {
      requestBody.query = query.trim();
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': GHL_API_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GHL API Error: ${response.status} - ${response.statusText}`);
      console.error('Error details:', errorText);
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
