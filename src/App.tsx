/**
 * Blue Marble Pinpoint
 * Main Application Component
 */

import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MapView } from './components/MapView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { LoginModal } from './components/LoginModal';
import { TutorialModal } from './components/TutorialModal';
import { useGeocoding } from './hooks/useGeocoding';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import './styles/global.css';
import './styles/map.css';
import './styles/tutorial.css';

function App() {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const { location, status, error, search } = useGeocoding();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);

  const handleSearch = (address: string) => {
    if (!isAuthenticated) {
      // Store the address and show login modal
      setPendingSearch(address);
      setShowLoginModal(true);
      return;
    }
    search(address);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Execute the pending search after successful login
    if (pendingSearch) {
      search(pendingSearch);
      setPendingSearch(null);
    }
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
          {isAuthenticated && (
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
          )}
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        isLoading={status === 'loading'}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Status Messages */}
      {status === 'loading' && <LoadingSpinner message="Searching location..." />}

      {status === 'error' && error && <ErrorMessage error={error} onRetry={handleRetry} />}

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

      {/* Tutorial Modal */}
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />

      {/* Login Modal - shown when user attempts to search without being authenticated */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
