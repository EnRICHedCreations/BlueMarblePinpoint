/**
 * Blue Marble Pinpoint
 * Main Application Component
 */

import { SearchBar } from './components/SearchBar';
import { MapView } from './components/MapView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { LoginModal } from './components/LoginModal';
import { useGeocoding } from './hooks/useGeocoding';
import { useAuth } from './contexts/AuthContext';
import { formatPopulation } from './services/populationService';
import './App.css';
import './styles/global.css';
import './styles/map.css';

function App() {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const { location, status, error, search } = useGeocoding();

  const handleSearch = (address: string) => {
    search(address);
  };

  const handleRetry = () => {
    if (location) {
      search(location.address);
    }
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">🌍 GeoFlipper</h1>
            <p className="app-subtitle">
              Geographic Intelligence & Population Insights on NASA's Blue Marble
            </p>
          </div>
          <div className="user-controls">
            <span className="user-email">{userEmail}</span>
            <button onClick={logout} className="logout-btn" title="Logout">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
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
          © {new Date().getFullYear()} GeoFlipper. Built with React & TypeScript.
        </p>
      </footer>
    </div>
  );
}

export default App;
