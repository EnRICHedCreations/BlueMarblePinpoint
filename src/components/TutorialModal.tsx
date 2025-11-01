/**
 * TutorialModal Component
 * Modal with video placeholder for tutorial content
 */

import React from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="tutorial-modal active" onClick={handleBackdropClick}>
      <div className="tutorial-modal-content">
        <button className="modal-close" onClick={onClose} title="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="tutorial-modal-header">
          <h2>How to Use GeoFlipper</h2>
          <p>Learn how to analyze markets for your wholesale deals</p>
        </div>

        <div className="tutorial-video-container">
          <div className="video-placeholder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
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
    </div>
  );
};
