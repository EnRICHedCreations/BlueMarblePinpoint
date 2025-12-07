/**
 * LoginModal Component
 * Email-based authentication modal for membership verification
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../services/authService';

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen = true, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isUpgradeRequired, setIsUpgradeRequired] = useState(false);
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
      setIsUpgradeRequired(false);
      return;
    }

    // Clear previous errors
    setError('');
    setIsUpgradeRequired(false);
    setIsSubmitting(true);

    try {
      const result = await login(trimmedEmail);

      if (!result.success) {
        setError('Unable to verify membership. Please try again later.');
        setIsUpgradeRequired(false);
        console.error('Authentication error:', result.error);
        return;
      }

      if (!result.isMember) {
        setIsUpgradeRequired(true);
        console.log('Access denied for:', trimmedEmail);
        return;
      }

      // Success - context will update and modal will disappear
      console.log('Member verified:', trimmedEmail);
      onSuccess?.();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsUpgradeRequired(false);
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
    if (isUpgradeRequired) {
      setIsUpgradeRequired(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal active" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
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
                className={`form-input ${error || isUpgradeRequired ? 'error' : ''}`}
                placeholder="your.email@example.com"
                value={email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {error && <div className="error-message show">{error}</div>}
              {isUpgradeRequired && (
                <div className="error-message show">
                  Access denied. This feature requires an active Wholesailors Academy membership.{' '}
                  <a
                    href="https://www.skool.com/wholesailors/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    Join here
                  </a>
                </div>
              )}
            </div>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying Membership...' : 'Verify & Access'}
            </button>

            <p className="privacy-notice">
              Your email will be verified against our membership database.
            </p>
          </form>

          <div className="join-prompt">
            <p>Don't have an account?</p>
            <a
              href="https://www.skool.com/wholesailors/about"
              target="_blank"
              rel="noopener noreferrer"
              className="join-link"
            >
              Join Wholesailors Academy
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
