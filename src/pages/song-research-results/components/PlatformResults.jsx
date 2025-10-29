import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatISRCWithoutDashes } from '../../../utils/isrcUtils';

const PlatformResults = ({ platformData = [] }) => {
  const [expandedPlatform, setExpandedPlatform] = useState(null);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'spotify': return 'Music';
      case 'youtube': return 'Play';
      case 'apple-music': return 'Smartphone';
      case 'soundcloud': return 'Radio';
      case 'allmusic': return 'Database';
      case 'discogs': return 'Disc';
      default: return 'Globe';
    }
  };

  const getPlatformDisplayName = (platform) => {
    switch (platform) {
      case 'spotify': return 'Spotify';
      case 'youtube': return 'YouTube';
      case 'apple-music': return 'Apple Music';
      case 'soundcloud': return 'SoundCloud';
      case 'allmusic': return 'AllMusic';
      case 'discogs': return 'Discogs';
      default: return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'no_data': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'error': return 'XCircle';
      case 'pending': return 'Clock';
      case 'no_data': return 'AlertCircle';
      default: return 'AlertCircle';
    }
  };

  const handleToggleExpand = (platformId) => {
    setExpandedPlatform(expandedPlatform === platformId ? null : platformId);
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    // Handle different duration formats
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return duration;
  };

  if (!platformData || platformData.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Database" size={48} className="text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No Platform Data Available
        </h3>
        <p className="text-text-secondary">
          Unable to retrieve search results from music platforms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Platform Search Results
        </h3>
        <div className="text-sm text-text-secondary">
          {platformData.filter(p => p.status === 'connected').length} of {platformData.length} platforms connected
        </div>
      </div>

      {platformData.map((platform) => (
        <div
          key={platform.platform}
          className="border border-border rounded-lg bg-surface"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Icon name={getPlatformIcon(platform.platform)} size={20} className="text-text-primary" />
                  <span className="font-medium text-text-primary">
                    {getPlatformDisplayName(platform.platform)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getStatusIcon(platform.status)} 
                    size={16} 
                    className={getStatusColor(platform.status)} 
                  />
                  <span className={`text-sm capitalize ${getStatusColor(platform.status)}`}>
                    {platform.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-secondary">
                  {platform.resultsCount || 0} results
                </span>
                {platform.confidence && (
                  <span className="text-sm font-medium text-text-primary">
                    {platform.confidence}% confidence
                  </span>
                )}
                {platform.results && platform.results.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleExpand(platform.platform)}
                    iconName={expandedPlatform === platform.platform ? 'ChevronUp' : 'ChevronDown'}
                    iconPosition="right"
                  >
                    {expandedPlatform === platform.platform ? 'Hide' : 'Show'} Details
                  </Button>
                )}
              </div>
            </div>

            {platform.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <Icon name="AlertCircle" size={16} className="inline mr-1" />
                {platform.error}
              </div>
            )}

            {platform.status === 'no_data' && (
              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                <Icon name="Info" size={16} className="inline mr-1" />
                No data available from this platform
              </div>
            )}
          </div>

          {/* Expanded Results */}
          {expandedPlatform === platform.platform && platform.results && (
            <div className="border-t border-border">
              <div className="p-4 space-y-3">
                {platform.results.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 bg-surface-secondary rounded-md border border-border-secondary"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary mb-1">
                          {result.title || 'Unknown Title'}
                        </h4>
                        <p className="text-sm text-text-secondary mb-2">
                          by {result.artist || 'Unknown Artist'}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
                          {result.album && (
                            <div>
                              <span className="font-medium">Album:</span> {result.album}
                            </div>
                          )}
                          {result.releaseDate && (
                            <div>
                              <span className="font-medium">Release:</span> {result.releaseDate}
                            </div>
                          )}
                          {result.duration && (
                            <div>
                              <span className="font-medium">Duration:</span> {formatDuration(result.duration)}
                            </div>
                          )}
                          {result.isrc && (
                            <div>
                              <span className="font-medium">ISRC:</span> {formatISRCWithoutDashes(result.isrc)}
                            </div>
                          )}
                          {result.genre && (
                            <div>
                              <span className="font-medium">Genre:</span> {result.genre}
                            </div>
                          )}
                          {result.label && (
                            <div>
                              <span className="font-medium">Label:</span> {result.label}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {result.url && (
                        <div className="ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(result.url, '_blank')}
                            iconName="ExternalLink"
                            iconPosition="right"
                          >
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlatformResults;