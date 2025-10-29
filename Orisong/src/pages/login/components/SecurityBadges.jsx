import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const badges = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'End-to-end encryption'
    },
    {
      icon: 'Award',
      title: 'Academic Partners',
      description: 'Trusted by institutions'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'GDPR compliant'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {badges?.map((badge, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center">
              <Icon 
                name={badge.icon} 
                size={16} 
                className="text-text-secondary" 
              />
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">
                {badge.title}
              </p>
              <p className="text-xs text-text-tertiary">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;