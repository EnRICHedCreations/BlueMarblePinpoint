/**
 * Map Configuration
 * Configuration for Leaflet map and NASA GIBS tiles
 */

import { LatLngExpression } from 'leaflet';

// NASA Black Marble (Earth at Night) tile URL
// Shows city lights and nighttime illumination
export const BLUE_MARBLE_TILE_URL =
  'https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png';

// Default map center (0,0 - center of the world)
export const DEFAULT_CENTER: LatLngExpression = [
  parseFloat(import.meta.env.VITE_DEFAULT_LAT || '0'),
  parseFloat(import.meta.env.VITE_DEFAULT_LNG || '0'),
];

// Default zoom level
export const DEFAULT_ZOOM = parseInt(import.meta.env.VITE_DEFAULT_ZOOM || '2', 10);

// Zoom constraints
export const MIN_ZOOM = 0;
export const MAX_ZOOM = 8; // NASA GIBS Blue Marble max zoom level

// Tile layer options
export const TILE_LAYER_OPTIONS = {
  attribution:
    'NASA Black Marble imagery courtesy of NASA GIBS',
  maxZoom: MAX_ZOOM,
  minZoom: MIN_ZOOM,
  tileSize: 256,
  subdomains: ['a', 'b', 'c'],
};

// Map container options
export const MAP_OPTIONS = {
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  zoomControl: true,
  attributionControl: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  touchZoom: true,
  boxZoom: true,
  keyboard: true,
  worldCopyJump: false,
};

// Animation durations (ms)
export const FLY_TO_DURATION = 1.5;
export const MARKER_ANIMATION_DELAY = 300;

// Search result zoom level (closer view)
export const SEARCH_RESULT_ZOOM = 8;
