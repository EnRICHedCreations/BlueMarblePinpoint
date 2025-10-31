/**
 * ErrorMessage Component
 * Displays error messages with retry option
 */

import React from 'react';
import { GeocodingError } from '../types/api';

interface ErrorMessageProps {
  error: GeocodingError;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{error.message}</p>
      {error.retryable && onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};
