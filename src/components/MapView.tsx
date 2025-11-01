/**
 * MapView Component
 * Interactive map with NASA Blue Marble imagery
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LocationData } from '../types/location';
import {
  BLUE_MARBLE_TILE_URL,
  TILE_LAYER_OPTIONS,
  MAP_OPTIONS,
  FLY_TO_DURATION,
  SEARCH_RESULT_ZOOM,
} from '../services/mapConfig';
import { formatCoordinates, formatAddress } from '../utils/formatters';
import { formatPopulation } from '../services/populationService';
import { getMarketStatus } from '../utils/marketViability';

interface MapViewProps {
  location: LocationData | null;
}

/**
 * MapController - handles map updates when location changes
 */
const MapController: React.FC<{ location: LocationData | null }> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], SEARCH_RESULT_ZOOM, {
        duration: FLY_TO_DURATION,
      });
    }
  }, [location, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ location }) => {
  return (
    <div className="map-container">
      <MapContainer
        center={MAP_OPTIONS.center}
        zoom={MAP_OPTIONS.zoom}
        minZoom={MAP_OPTIONS.minZoom}
        maxZoom={MAP_OPTIONS.maxZoom}
        zoomControl={MAP_OPTIONS.zoomControl}
        attributionControl={MAP_OPTIONS.attributionControl}
        scrollWheelZoom={MAP_OPTIONS.scrollWheelZoom}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-map"
      >
        <TileLayer url={BLUE_MARBLE_TILE_URL} {...TILE_LAYER_OPTIONS} />

        {location && (
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              <div className="marker-popup">
                <h3 className="popup-title">📍 Location Found</h3>
                <div className="popup-content">
                  <p className="popup-address">
                    <strong>Address:</strong>
                    <br />
                    {formatAddress(location.formatted || location.address)}
                  </p>
                  <p className="popup-coordinates">
                    <strong>Coordinates:</strong>
                    <br />
                    <code>{formatCoordinates(location)}</code>
                  </p>
                  {location.components?.city && (
                    <p className="popup-details">
                      <strong>City:</strong> {location.components.city}
                    </p>
                  )}
                  {location.components?.country && (
                    <p className="popup-details">
                      <strong>Country:</strong> {location.components.country}
                    </p>
                  )}
                  {location.population && (
                    <p className="popup-population">
                      <strong>Population:</strong> {formatPopulation(location.population.value)}
                      {location.population.city && ` (${location.population.city})`}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        <MapController location={location} />
      </MapContainer>

      {!location && (
        <div className="map-overlay">
          <div className="map-instructions">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#welcomeGoldGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: '16px' }}
            >
              <defs>
                <linearGradient id="welcomeGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6e5732', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#b69856', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <h2>Find Profitable Markets for Your Deals</h2>
            <p>Use geographic intelligence to identify viable markets for your wholesale real estate deals. Search any address to instantly see population data and market viability.</p>
          </div>
        </div>
      )}

      {location && location.population && (() => {
        const marketStatus = getMarketStatus(location.population.value);
        return (
          <div className="population-overlay">
            <div
              className="population-card"
              style={{
                borderColor: marketStatus.color,
                backgroundColor: marketStatus.backgroundColor
              }}
            >
              <div className="population-icon">👥</div>
              <div className="population-info">
                <div className="population-label">Population</div>
                <div
                  className="population-value"
                  style={{ color: marketStatus.color }}
                >
                  {formatPopulation(location.population.value)}
                </div>
                {location.population.city && (
                  <div className="population-place">{location.population.city}</div>
                )}
                <div
                  className="market-status"
                  style={{ color: marketStatus.color }}
                >
                  {marketStatus.label}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
