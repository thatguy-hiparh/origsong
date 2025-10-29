import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatISRCWithoutDashes } from '../../../utils/isrcUtils';

const MetadataComparison = ({ comparisonData }) => {
  const [selectedSources, setSelectedSources] = useState(new Set(['source1', 'source2']));

  const toggleSource = (sourceId) => {
    const newSelected = new Set(selectedSources);
    if (newSelected.has(sourceId)) {
      if (newSelected.size > 1) {
        newSelected.delete(sourceId);
      }
    } else {
      newSelected.add(sourceId);
    }
    setSelectedSources(newSelected);
  };

  const getConflictStatus = (field) => {
    const values = comparisonData.sources
      .filter(source => selectedSources.has(source.id))
      .map(source => source.metadata[field])
      .filter(value => value && value.trim() !== '');
    
    const uniqueValues = [...new Set(values)];
    return uniqueValues.length > 1 ? 'conflict' : 'match';
  };

  const getFieldIcon = (status) => {
    switch (status) {
      case 'conflict':
        return <Icon name="AlertTriangle" size={16} className="text-warning" />;
      case 'match':
        return <Icon name="Check" size={16} className="text-success" />;
      default:
        return <Icon name="Minus" size={16} className="text-text-muted" />;
    }
  };

  const metadataFields = [
    { key: 'title', label: 'Song Title' },
    { key: 'artist', label: 'Artist' },
    { key: 'composer', label: 'Composer' },
    { key: 'lyricist', label: 'Lyricist' },
    { key: 'publisher', label: 'Publisher' },
    { key: 'arranger', label: 'Arranger' },
    { key: 'producer', label: 'Producer' },
    { key: 'releaseDate', label: 'Release Date' },
    { key: 'isrc', label: 'ISRC' },
    { key: 'duration', label: 'Duration' },
    { key: 'genre', label: 'Genre' },
    { key: 'label', label: 'Record Label' }
  ];

  return (
    <div className="space-y-6">
      {/* Source Selection */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <h3 className="text-sm font-medium text-text-primary mb-3">Compare Sources</h3>
        <div className="flex flex-wrap gap-2">
          {comparisonData.sources.map((source) => (
            <button
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedSources.has(source.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={source.icon} size={14} className="mr-1" />
              {source.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-32">Field</th>
                <th className="w-16">Status</th>
                {comparisonData.sources
                  .filter(source => selectedSources.has(source.id))
                  .map((source) => (
                    <th key={source.id} className="min-w-48">
                      <div className="flex items-center space-x-2">
                        <Icon name={source.icon} size={16} className="text-text-secondary" />
                        <span>{source.name}</span>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {metadataFields.map((field) => {
                const status = getConflictStatus(field.key);
                return (
                  <tr key={field.key} className={status === 'conflict' ? 'bg-warning/5' : ''}>
                    <td className="font-medium text-text-primary">{field.label}</td>
                    <td>{getFieldIcon(status)}</td>
                    {comparisonData.sources
                      .filter(source => selectedSources.has(source.id))
                      .map((source) => (
                        <td key={source.id} className={
                          status === 'conflict' && source.metadata[field.key] 
                            ? 'text-warning font-medium' :'text-text-primary'
                        }>
                          {field.key === 'isrc' && source.metadata[field.key] ? (
                            formatISRCWithoutDashes(source.metadata[field.key])
                          ) : (
                            source.metadata[field.key] || (
                              <span className="text-text-muted italic">Not available</span>
                            )
                          )}
                        </td>
                      ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conflict Summary */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Conflict Summary</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm text-text-secondary">
                {metadataFields.filter(field => getConflictStatus(field.key) === 'conflict').length} conflicts
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Check" size={16} className="text-success" />
              <span className="text-sm text-text-secondary">
                {metadataFields.filter(field => getConflictStatus(field.key) === 'match').length} matches
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {metadataFields
            .filter(field => getConflictStatus(field.key) === 'conflict')
            .map((field) => (
              <div key={field.key} className="bg-warning/10 border border-warning/20 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1">{field.label} Conflict</h4>
                    <div className="space-y-1">
                      {comparisonData.sources
                        .filter(source => selectedSources.has(source.id))
                        .filter(source => source.metadata[field.key])
                        .map((source) => (
                          <p key={source.id} className="text-sm text-text-secondary">
                            <span className="font-medium">{source.name}:</span> {source.metadata[field.key]}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {metadataFields.filter(field => getConflictStatus(field.key) === 'conflict').length === 0 && (
          <div className="text-center py-4">
            <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No conflicts detected between selected sources</p>
          </div>
        )}
      </div>

      {/* Export Comparison */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
        >
          Export Comparison
        </Button>
      </div>
    </div>
  );
};

export default MetadataComparison;