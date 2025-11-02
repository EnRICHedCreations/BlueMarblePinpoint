/**
 * SearchBar Component
 * Address search interface with Google Places Autocomplete
 */

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { validateAddress, sanitizeInput } from '../utils/validators';
import { loadGoogleMapsScript } from '../utils/loadGoogleMaps';
import { isInIframe } from '../utils/iframeDetection';
import { OpportunitiesSearchBar } from './OpportunitiesSearchBar';
import { GHLOpportunity, formatOpportunityAddress } from '../services/ghlService';

interface SearchBarProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
  onOpenTutorial?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false, onOpenTutorial }) => {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showGHLSearch, setShowGHLSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);

  // Check if we're in an iframe on mount
  useEffect(() => {
    setShowGHLSearch(isInIframe());
  }, []);

  const handleOpportunitySelect = (opportunity: GHLOpportunity) => {
    const address = formatOpportunityAddress(opportunity);
    if (address) {
      onSearch(address);
      setInputValue(address);
    } else {
      setValidationError('No address found for this opportunity');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitized = sanitizeInput(inputValue);
    const validation = validateAddress(sanitized);

    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid input');
      return;
    }

    setValidationError('');
    onSearch(sanitized);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  useEffect(() => {
    // Load Google Maps script and initialize autocomplete
    loadGoogleMapsScript()
      .then(() => {
        const win = window as any;
        if (inputRef.current && win.google?.maps?.places) {
          try {
            // Fixed: Remove 'address' type as it cannot be mixed with others
            // Use only 'geocode' which covers all location types
            autocompleteRef.current = new win.google.maps.places.Autocomplete(inputRef.current, {
              types: ['geocode'],
              fields: ['formatted_address', 'geometry', 'name'],
            });

            autocompleteRef.current.addListener('place_changed', () => {
              const place = autocompleteRef.current?.getPlace();
              if (place?.formatted_address) {
                setInputValue(place.formatted_address);
                setValidationError('');
              }
            });
          } catch (error) {
            console.error('Error initializing Google Places Autocomplete:', error);
          }
        }
      })
      .catch((error) => {
        console.warn('Google Maps not available:', error.message);
        // App continues to work without autocomplete
      });

    return () => {
      // Cleanup
      const win = window as any;
      if (autocompleteRef.current && win.google?.maps?.event) {
        win.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="search-bar">
      <div className={`search-bar-wrapper ${showGHLSearch ? 'dual-search' : ''}`}>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="💡 Tip: Start typing an address and select from suggestions"
            className={`search-input ${validationError ? 'error' : ''}`}
            disabled={isLoading}
            aria-label="Search address"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? 'search-error' : undefined}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Search"
          >
            {isLoading ? '⏳' : '🔍'}
          </button>
          {onOpenTutorial && (
            <button
              type="button"
              className="tutorial-button"
              onClick={onOpenTutorial}
              aria-label="Open Tutorial"
            >
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
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Tutorial</span>
            </button>
          )}
          <a
            href="https://blue-marble.de/nightlights/"
            target="_blank"
            rel="noopener noreferrer"
            className="bluemarble-button"
            aria-label="Go to Blue Marble website"
          >
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
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Go To BlueMarble</span>
          </a>
        </div>
        {validationError && (
          <div id="search-error" className="validation-error" role="alert">
            {validationError}
          </div>
        )}
      </form>

        {showGHLSearch && <OpportunitiesSearchBar onSelectOpportunity={handleOpportunitySelect} />}
      </div>
    </div>
  );
};
