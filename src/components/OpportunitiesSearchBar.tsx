/**
 * OpportunitiesSearchBar Component
 * Search GoHighLevel opportunities (shown only when iframed)
 */

import React, { useState, FormEvent } from 'react';
import { searchOpportunities, GHLOpportunity } from '../services/ghlService';

interface OpportunitiesSearchBarProps {
  onSelectOpportunity?: (opportunity: GHLOpportunity) => void;
}

export const OpportunitiesSearchBar: React.FC<OpportunitiesSearchBarProps> = ({ onSelectOpportunity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [opportunities, setOpportunities] = useState<GHLOpportunity[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setError('');
    setIsSearching(true);
    setShowResults(false);

    try {
      const result = await searchOpportunities(searchQuery);

      if (!result.success) {
        setError(result.error || 'Failed to search opportunities');
        setOpportunities([]);
        return;
      }

      setOpportunities(result.opportunities || []);
      setShowResults(true);

      if (result.opportunities && result.opportunities.length === 0) {
        setError('No opportunities found');
      }
    } catch (err) {
      setError('An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectOpportunity = (opportunity: GHLOpportunity) => {
    setShowResults(false);
    setSearchQuery(opportunity.name);
    if (onSelectOpportunity) {
      onSelectOpportunity(opportunity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (error) setError('');
    if (showResults) setShowResults(false);
  };

  return (
    <div className="opportunities-search-bar">
      <form onSubmit={handleSearch} className="opportunities-search-form">
        <div className="opportunities-search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="🔍 Search GHL Opportunities..."
            className={`opportunities-search-input ${error ? 'error' : ''}`}
            disabled={isSearching}
            aria-label="Search opportunities"
          />
          <button
            type="submit"
            className="opportunities-search-button"
            disabled={isSearching || !searchQuery.trim()}
            aria-label="Search"
          >
            {isSearching ? '⏳' : '🔍'}
          </button>
        </div>

        {error && (
          <div className="opportunities-search-error">{error}</div>
        )}

        {showResults && opportunities.length > 0 && (
          <div className="opportunities-results">
            <div className="opportunities-results-header">
              Found {opportunities.length} opportunit{opportunities.length === 1 ? 'y' : 'ies'}
            </div>
            <div className="opportunities-list">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="opportunity-item"
                  onClick={() => handleSelectOpportunity(opp)}
                >
                  <div className="opportunity-name">{opp.name}</div>
                  {opp.contact?.name && (
                    <div className="opportunity-contact">{opp.contact.name}</div>
                  )}
                  {opp.monetaryValue && (
                    <div className="opportunity-value">
                      ${opp.monetaryValue.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
