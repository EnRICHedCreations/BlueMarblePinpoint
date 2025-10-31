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
          <div className="header-branding">
            <div className="header-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6e5732', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#b69856', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <h1 className="app-title">GeoFlipper</h1>
            </div>
            <p className="app-subtitle">
              Check if your wholesale deal is in a viable market through geographic intelligence.
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Find Profitable Markets for Your Deals</h2>
          <p className="hero-description">
            Use geographic intelligence to identify viable markets for your wholesale real estate deals.
            Search any address to instantly see population data and market viability.
          </p>
          <ul className="hero-features">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Real-time population data
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Market viability ratings
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              NASA satellite imagery
            </li>
          </ul>
        </div>
        <div className="hero-video">
          <div className="video-container">
            <div className="video-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <p>Tutorial Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

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
