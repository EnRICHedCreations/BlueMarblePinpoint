/**
 * SearchBar Component
 * Address search interface with Google Places Autocomplete
 */

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { validateAddress, sanitizeInput } from '../utils/validators';
import { loadGoogleMapsScript } from '../utils/loadGoogleMaps';

interface SearchBarProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
  onOpenTutorial?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false, onOpenTutorial }) => {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);

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
        </div>
        {validationError && (
          <div id="search-error" className="validation-error" role="alert">
            {validationError}
          </div>
        )}
      </form>
    </div>
  );
};
