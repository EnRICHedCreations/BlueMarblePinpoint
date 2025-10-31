/**
 * LoginModal Component
 * Email-based authentication modal for membership verification
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../services/authService';

export const LoginModal: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Clear previous errors
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(trimmedEmail);

      if (!result.success) {
        setError('Unable to verify membership. Please try again later.');
        console.error('Authentication error:', result.error);
        return;
      }

      if (!result.isMember) {
        setError('Access denied. This application requires an active membership.');
        console.log('Access denied for:', trimmedEmail);
        return;
      }

      // Success - context will update and modal will disappear
      console.log('Member verified:', trimmedEmail);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="login-modal active">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
          <h3 className="modal-title">Member Access Required</h3>
          <p className="modal-description">
            Enter your registered email address to access GeoFlipper
          </p>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail" className="form-label">
                Email Address *
              </label>
              <input
                ref={inputRef}
                type="email"
                id="loginEmail"
                className={`form-input ${error ? 'error' : ''}`}
                placeholder="your.email@example.com"
                value={email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {error && <div className="error-message show">{error}</div>}
            </div>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying Membership...' : 'Verify & Access'}
            </button>

            <p className="privacy-notice">
              Your email will be verified against our membership database.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
