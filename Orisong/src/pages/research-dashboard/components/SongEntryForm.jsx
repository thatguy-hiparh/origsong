import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { validateISRCFormat, normalizeISRC } from '../../../utils/isrcUtils';

const SongEntryForm = ({ onStartResearch, recentSearches = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    displayArtist: '',
    isrc: ''
  });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Generate suggestions based on recent searches
    if (formData.title.length > 2) {
      const filtered = recentSearches
        .filter(search => 
          search.title.toLowerCase().includes(formData.title.toLowerCase()) ||
          search.artist.toLowerCase().includes(formData.title.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [formData.title, recentSearches]);

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Special handling for ISRC field
    if (field === 'isrc') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Real-time ISRC validation
    if (field === 'isrc' && value) {
      setIsValidating(true);
      setTimeout(() => {
        if (!validateISRCFormat(value)) {
          setErrors(prev => ({
            ...prev,
            isrc: 'Invalid ISRC format. Expected: CCXXXYYNNNNN or CC-XXX-YY-NNNNN'
          }));
        }
        setIsValidating(false);
      }, 500);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setFormData({
      title: suggestion.title,
      subtitle: suggestion.subtitle || '',
      displayArtist: suggestion.artist,
      isrc: suggestion.isrc || ''
    });
    setShowSuggestions(false);
  };

  const handleClipboardImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length >= 2) {
        setFormData({
          title: lines[0].trim(),
          subtitle: lines[1]?.trim() || '',
          displayArtist: lines[2]?.trim() || '',
          isrc: lines[3]?.trim() || ''
        });
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Song title is required';
    }

    if (!formData.displayArtist.trim()) {
      newErrors.displayArtist = 'Display artist is required';
    }

    if (formData.isrc && !validateISRCFormat(formData.isrc)) {
      newErrors.isrc = 'Invalid ISRC format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Normalize ISRC to format without dashes before submitting
      const normalizedData = {
        ...formData,
        isrc: normalizeISRC(formData.isrc)
      };
      onStartResearch(normalizedData);
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      displayArtist: '',
      isrc: ''
    });
    setErrors({});
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Song Research Entry</h2>
          <p className="text-sm text-text-secondary mt-1">
            Enter song details to begin originality analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClipboardImport}
            iconName="Clipboard"
            iconPosition="left"
            className="text-text-secondary hover:text-text-primary"
          >
            Import from Clipboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearForm}
            iconName="RotateCcw"
            iconPosition="left"
            className="text-text-secondary hover:text-text-primary"
          >
            Clear Form
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Song Title */}
          <div className="relative">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Song Title *
            </label>
            <Input
              type="text"
              placeholder="Enter song title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-error' : ''}
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error">{errors.title}</p>
            )}
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg z-dropdown max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-surface-secondary transition-colors duration-200 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="History" size={14} className="text-text-muted" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          by {suggestion.artist}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Subtitle
            </label>
            <Input
              type="text"
              placeholder="Enter subtitle (optional)"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
            />
          </div>

          {/* Display Artist */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Display Artist *
            </label>
            <Input
              type="text"
              placeholder="Enter artist name"
              value={formData.displayArtist}
              onChange={(e) => handleInputChange('displayArtist', e.target.value)}
              className={errors.displayArtist ? 'border-error' : ''}
              required
            />
            {errors.displayArtist && (
              <p className="mt-1 text-sm text-error">{errors.displayArtist}</p>
            )}
          </div>

          {/* ISRC */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              ISRC Code
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="CCXXXYYNNNNN or CC-XXX-YY-NNNNN"
                value={formData.isrc}
                onChange={(e) => handleInputChange('isrc', e.target.value)}
                className={errors.isrc ? 'border-error' : ''}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Icon name="Loader2" size={16} className="text-text-muted animate-spin" />
                </div>
              )}
            </div>
            {errors.isrc && (
              <p className="mt-1 text-sm text-error">{errors.isrc}</p>
            )}
            <p className="mt-1 text-xs text-text-muted">
              International Standard Recording Code (optional) - accepts both formats
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Info" size={16} />
            <span>Research will analyze across 15+ music platforms</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearForm}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              iconName="Search"
              iconPosition="left"
              disabled={!formData.title.trim() || !formData.displayArtist.trim()}
            >
              Start Research
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Tips */}
      <div className="mt-6 p-4 bg-surface-secondary rounded-md">
        <h3 className="text-sm font-medium text-text-primary mb-2">Quick Tips</h3>
        <ul className="text-xs text-text-secondary space-y-1">
          <li>• Use exact song titles for best results</li>
          <li>• ISRC codes help identify specific recordings</li>
          <li>• Include featured artists in the display artist field</li>
          <li>• Research typically takes 30-60 seconds to complete</li>
        </ul>
      </div>
    </div>
  );
};

export default SongEntryForm;