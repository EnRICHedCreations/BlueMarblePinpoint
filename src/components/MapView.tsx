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
            <h2>🌍 Welcome to Blue Marble Pinpoint</h2>
            <p>Search for any address to see it on NASA's Blue Marble satellite imagery</p>
          </div>
        </div>
      )}
    </div>
  );
};
