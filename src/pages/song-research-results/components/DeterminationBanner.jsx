import React from 'react';
import Icon from '../../../components/AppIcon';

const DeterminationBanner = ({ determination, confidence, songTitle, artist }) => {
  const getBannerConfig = () => {
    switch (determination) {
      case 'original':
        return {
          bgColor: 'bg-success/20',
          borderColor: 'border-success/30',
          textColor: 'text-success',
          icon: 'CheckCircle',
          title: 'Original Composition',
          description: 'This appears to be an original work'
        };
      case 'cover':
        return {
          bgColor: 'bg-warning/20',
          borderColor: 'border-warning/30',
          textColor: 'text-warning',
          icon: 'Copy',
          title: 'Cover Version',
          description: 'This is a cover of an existing composition'
        };
      case 'public_domain':
        return {
          bgColor: 'bg-accent/20',
          borderColor: 'border-accent/30',
          textColor: 'text-accent',
          icon: 'Globe',
          title: 'Public Domain',
          description: 'This composition is in the public domain'
        };
      default:
        return {
          bgColor: 'bg-surface-secondary',
          borderColor: 'border-border',
          textColor: 'text-text-secondary',
          icon: 'HelpCircle',
          title: 'Analysis Pending',
          description: 'Research in progress'
        };
    }
  };

  const config = getBannerConfig();

  const getConfidenceColor = () => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 mb-6`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`${config.textColor} p-2 rounded-full bg-current/10`}>
            <Icon name={config.icon} size={24} className={config.textColor} />
          </div>
          <div className="flex-1">
            <h2 className={`text-xl font-semibold ${config.textColor} mb-1`}>
              {config.title}
            </h2>
            <p className="text-text-secondary mb-3">
              {config.description}
            </p>
            <div className="space-y-1">
              <p className="text-sm text-text-primary">
                <span className="font-medium">Song:</span> {songTitle}
              </p>
              <p className="text-sm text-text-primary">
                <span className="font-medium">Artist:</span> {artist}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-text-secondary">Confidence:</span>
            <span className={`text-lg font-bold ${getConfidenceColor()}`}>
              {confidence}%
            </span>
          </div>
          <div className="w-24 h-2 bg-surface-tertiary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                confidence >= 90 ? 'bg-success' : 
                confidence >= 70 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeterminationBanner;