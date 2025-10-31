/**
 * Location Types
 * Type definitions for location and coordinate data
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData extends Coordinates {
  address: string;
  formatted: string;
  components?: AddressComponents;
}

export interface AddressComponents {
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  road?: string;
  [key: string]: string | undefined;
}

export interface MapBounds {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface MarkerData {
  id: string;
  position: Coordinates;
  address: string;
  timestamp: Date;
}
