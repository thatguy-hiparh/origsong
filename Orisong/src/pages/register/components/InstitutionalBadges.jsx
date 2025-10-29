import React from 'react';
import Icon from '../../../components/AppIcon';

const InstitutionalBadges = () => {
  const partnerships = [
    {
      name: 'Academic Alliance',
      description: 'Trusted by 200+ universities worldwide',
      icon: 'GraduationCap',
      stats: '200+ Universities'
    },
    {
      name: 'Industry Partners',
      description: 'Verified by major record labels',
      icon: 'Building2',
      stats: '50+ Labels'
    },
    {
      name: 'Legal Network',
      description: 'Used by music law professionals',
      icon: 'Scale',
      stats: '100+ Law Firms'
    },
    {
      name: 'Media Trust',
      description: 'Relied upon by music journalists',
      icon: 'Newspaper',
      stats: '75+ Publications'
    }
  ];

  const securityFeatures = [
    {
      icon: 'Shield',
      label: 'SSL Encrypted',
      description: 'Bank-level security'
    },
    {
      icon: 'Lock',
      label: 'GDPR Compliant',
      description: 'Privacy protected'
    },
    {
      icon: 'CheckCircle',
      label: 'SOC 2 Certified',
      description: 'Industry standard'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Partnership Badges */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-4 flex items-center">
          <Icon name="Award" size={16} className="mr-2 text-accent" />
          Trusted by Professionals
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {partnerships.map((partner, index) => (
            <div
              key={index}
              className="p-3 bg-surface-secondary rounded-lg border border-border hover:border-accent/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                  <Icon name={partner.icon} size={12} className="text-accent" />
                </div>
                <span className="text-xs font-medium text-text-primary">{partner.name}</span>
              </div>
              <p className="text-xs text-text-secondary mb-1">{partner.description}</p>
              <span className="text-xs font-medium text-accent">{partner.stats}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-4 flex items-center">
          <Icon name="ShieldCheck" size={16} className="mr-2 text-success" />
          Security & Compliance
        </h3>
        <div className="space-y-2">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200">
              <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                <Icon name={feature.icon} size={12} className="text-success" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-text-primary">{feature.label}</span>
                <p className="text-xs text-text-secondary">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Benefits */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center">
          <Icon name="Zap" size={14} className="mr-2 text-primary" />
          Research Benefits
        </h4>
        <ul className="space-y-1 text-xs text-text-secondary">
          <li className="flex items-center">
            <Icon name="Check" size={12} className="mr-2 text-success" />
            Access to 15+ music databases
          </li>
          <li className="flex items-center">
            <Icon name="Check" size={12} className="mr-2 text-success" />
            AI-powered lyric comparison
          </li>
          <li className="flex items-center">
            <Icon name="Check" size={12} className="mr-2 text-success" />
            Exportable research reports
          </li>
          <li className="flex items-center">
            <Icon name="Check" size={12} className="mr-2 text-success" />
            Collaboration tools
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InstitutionalBadges;