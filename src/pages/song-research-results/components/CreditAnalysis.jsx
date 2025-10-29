import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreditAnalysis = ({ creditData }) => {
  const [selectedCredit, setSelectedCredit] = useState(null);

  if (!creditData) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <Icon name="AlertCircle" size={48} className="text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Credit Data Available</h3>
        <p className="text-text-secondary">
          Credit analysis is not available for this song at the moment.
        </p>
      </div>
    );
  }

  const calculatePublicDomainStatus = (composerDeathYear) => {
    const currentYear = new Date().getFullYear();
    const publicDomainYear = composerDeathYear + 70;
    return {
      isPublicDomain: currentYear >= publicDomainYear,
      publicDomainYear,
      yearsRemaining: Math.max(0, publicDomainYear - currentYear)
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const CreditCard = ({ credit, isSelected, onClick }) => (
    <div 
      className={`bg-surface border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-border-secondary'
      }`}
      onClick={() => onClick(credit)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text-primary">{credit?.name || 'Unknown'}</h3>
          <p className="text-sm text-text-secondary">{credit?.role || 'Unknown Role'}</p>
        </div>
        <div className="text-right">
          {credit?.isVerified && (
            <div className="status-badge verified mb-1">
              <Icon name="Shield" size={10} className="mr-1" />
              Verified
            </div>
          )}
          <p className="text-xs text-text-muted">
            {credit?.birthYear && `Born ${credit.birthYear}`}
            {credit?.deathYear && ` - Died ${credit.deathYear}`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {credit?.organizations && credit.organizations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">Organizations:</p>
            <div className="flex flex-wrap gap-1">
              {credit.organizations.map((org, index) => (
                <span key={index} className="text-xs bg-surface-secondary px-2 py-1 rounded">
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {credit?.deathYear && (
          <div className="mt-3 p-2 bg-surface-secondary rounded">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Public Domain Status:</span>
              {(() => {
                const pdStatus = calculatePublicDomainStatus(credit.deathYear);
                return pdStatus.isPublicDomain ? (
                  <span className="status-badge verified">
                    <Icon name="Globe" size={10} className="mr-1" />
                    Public Domain
                  </span>
                ) : (
                  <span className="status-badge pending">
                    <Icon name="Clock" size={10} className="mr-1" />
                    {pdStatus.yearsRemaining} years remaining
                  </span>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Earliest Known Version */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Earliest Known Version</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-2">Original Recording</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Title:</span> {creditData?.earliestVersion?.title || 'Unknown'}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Artist:</span> {creditData?.earliestVersion?.artist || 'Unknown'}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Release Date:</span> {formatDate(creditData?.earliestVersion?.releaseDate)}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Label:</span> {creditData?.earliestVersion?.label || 'Unknown'}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">First Performer</h4>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-text-secondary" />
              </div>
              <div>
                <p className="font-medium text-text-primary">{creditData?.firstPerformer?.name || 'Unknown'}</p>
                <p className="text-sm text-text-secondary">{creditData?.firstPerformer?.nationality || 'Unknown'}</p>
                <p className="text-xs text-text-muted">
                  {creditData?.firstPerformer?.birthYear || 'Unknown'} - {creditData?.firstPerformer?.deathYear || 'Present'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits by Role */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Credits by Role</h3>
        
        {creditData?.creditsByRole && Object.entries(creditData.creditsByRole).map(([role, credits]) => (
          <div key={role} className="bg-surface border border-border rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-3 capitalize">{role}s</h4>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {credits?.map((credit, index) => (
                <CreditCard
                  key={index}
                  credit={credit}
                  isSelected={selectedCredit === credit}
                  onClick={setSelectedCredit}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Public Domain Analysis */}
      {creditData?.publicDomainAnalysis && creditData.publicDomainAnalysis.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Public Domain Analysis</h3>
          <div className="space-y-4">
            {creditData.publicDomainAnalysis.map((analysis, index) => {
              const pdStatus = calculatePublicDomainStatus(analysis?.deathYear || new Date().getFullYear());
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-md">
                  <div>
                    <p className="font-medium text-text-primary">{analysis?.name || 'Unknown'}</p>
                    <p className="text-sm text-text-secondary">{analysis?.role || 'Unknown Role'}</p>
                    <p className="text-xs text-text-muted">
                      Died {analysis?.deathYear || 'Unknown'} • Rights expire {pdStatus.publicDomainYear}
                    </p>
                  </div>
                  <div className="text-right">
                    {pdStatus.isPublicDomain ? (
                      <div className="status-badge verified">
                        <Icon name="Globe" size={12} className="mr-1" />
                        Public Domain
                      </div>
                    ) : (
                      <div className="status-badge pending">
                        <Icon name="Clock" size={12} className="mr-1" />
                        {pdStatus.yearsRemaining} years
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Traditional/Devotional Classification */}
      {creditData?.classification && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Classification</h3>
          <div className="flex items-center space-x-4">
            <div className={`status-badge ${
              creditData.classification.type === 'traditional' ? 'verified' : 
              creditData.classification.type === 'devotional' ? 'pending' : 'error'
            }`}>
              <Icon name={
                creditData.classification.type === 'traditional' ? 'Music' :
                creditData.classification.type === 'devotional' ? 'Heart' : 'FileText'
              } size={12} className="mr-1" />
              {creditData.classification.type.charAt(0).toUpperCase() + creditData.classification.type.slice(1)}
            </div>
            <p className="text-sm text-text-secondary">{creditData.classification.description}</p>
          </div>
        </div>
      )}

      {/* Selected Credit Details */}
      {selectedCredit && (
        <div className="bg-surface border border-primary rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Credit Details</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCredit(null)}
              iconName="X"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Personal Information</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">Full Name:</span> {selectedCredit?.name || 'Unknown'}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">Role:</span> {selectedCredit?.role || 'Unknown'}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">Birth Year:</span> {selectedCredit?.birthYear || 'Unknown'}
                </p>
                {selectedCredit?.deathYear && (
                  <p className="text-sm">
                    <span className="font-medium text-text-secondary">Death Year:</span> {selectedCredit.deathYear}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">Nationality:</span> {selectedCredit?.nationality || 'Unknown'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Professional Details</h4>
              <div className="space-y-2">
                {selectedCredit?.organizations && selectedCredit.organizations.length > 0 && (
                  <div>
                    <span className="font-medium text-text-secondary">Organizations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCredit.organizations.map((org, index) => (
                        <span key={index} className="text-xs bg-surface-secondary px-2 py-1 rounded">
                          {org}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCredit?.iswc && (
                  <p className="text-sm">
                    <span className="font-medium text-text-secondary">ISWC:</span> {selectedCredit.iswc}
                  </p>
                )}
                {selectedCredit?.publisherShare && (
                  <p className="text-sm">
                    <span className="font-medium text-text-secondary">Publisher Share:</span> {selectedCredit.publisherShare}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditAnalysis;