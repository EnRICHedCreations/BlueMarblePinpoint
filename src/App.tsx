/**
 * Blue Marble Pinpoint
 * Main Application Component
 */

import { SearchBar } from './components/SearchBar';
import { MapView } from './components/MapView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useGeocoding } from './hooks/useGeocoding';
import { formatPopulation } from './services/populationService';
import './App.css';
import './styles/global.css';
import './styles/map.css';

function App() {
  const { location, status, error, search } = useGeocoding();

  const handleSearch = (address: string) => {
    search(address);
  };

  const handleRetry = () => {
    if (location) {
      search(location.address);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">🌍 Blue Marble Pinpoint</h1>
        <p className="app-subtitle">
          Search and explore addresses on NASA's Blue Marble satellite imagery
        </p>
      </header>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} isLoading={status === 'loading'} />

      {/* Status Messages */}
      {status === 'loading' && <LoadingSpinner message="Searching location..." />}

      {status === 'error' && error && <ErrorMessage error={error} onRetry={handleRetry} />}

      {status === 'success' && location && (
        <div className="result-info">
          <p className="result-info-text">
            ✓ Location found: {location.formatted || location.address}
            {location.population && (
              <span style={{ marginLeft: '12px', fontSize: '13px' }}>
                | Population: {formatPopulation(location.population.value)}
                {location.population.city && ` (${location.population.city})`}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Map */}
      <main className="app-content">
        <MapView location={location} />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Powered by{' '}
          <a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener noreferrer">
            NASA GIBS
          </a>
          {', '}
          <a href="https://opencagedata.com" target="_blank" rel="noopener noreferrer">
            OpenCage
          </a>
          {' & '}
          <a href="https://nominatim.openstreetmap.org" target="_blank" rel="noopener noreferrer">
            Nominatim
          </a>
        </p>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">
            Leaflet.js
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            React
          </a>
        </div>
        <p style={{ marginTop: '12px', fontSize: '12px' }}>
          © {new Date().getFullYear()} Blue Marble Pinpoint. Built with React & TypeScript.
        </p>
      </footer>
    </div>
  );
}

export default App;
