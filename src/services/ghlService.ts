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

    // Build request body for v2 API
    const requestBody: any = {
      location_id: activeLocationId,
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
