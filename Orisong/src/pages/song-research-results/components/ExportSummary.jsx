import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportSummary = ({ summaryData, onExport, onCopyToClipboard }) => {
  const [selectedFormat, setSelectedFormat] = useState('txt');
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const exportFormats = [
    { id: 'txt', name: 'Plain Text', icon: 'FileText', extension: '.txt' },
    { id: 'csv', name: 'CSV', icon: 'Table', extension: '.csv' },
    { id: 'markdown', name: 'Markdown', icon: 'Hash', extension: '.md' },
    { id: 'json', name: 'JSON', icon: 'Code', extension: '.json' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await onCopyToClipboard();
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const getSummaryIcon = (determination) => {
    switch (determination) {
      case 'original':
        return <Icon name="CheckCircle" size={20} className="text-success" />;
      case 'cover':
        return <Icon name="Copy" size={20} className="text-warning" />;
      case 'public_domain':
        return <Icon name="Globe" size={20} className="text-accent" />;
      default:
        return <Icon name="HelpCircle" size={20} className="text-text-muted" />;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Research Summary</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyToClipboard}
            iconName={copySuccess ? "Check" : "Copy"}
            iconPosition="left"
            className={copySuccess ? "text-success" : ""}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            iconName="Printer"
            iconPosition="left"
          >
            Print
          </Button>
        </div>
      </div>

      {/* Summary Header */}
      <div className="bg-surface-secondary rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-4">
          {getSummaryIcon(summaryData.determination)}
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-text-primary mb-1">
              {summaryData.songTitle}
            </h4>
            <p className="text-text-secondary mb-2">by {summaryData.artist}</p>
            <div className="flex items-center space-x-4">
              <div className="status-badge verified">
                <Icon name="Shield" size={12} className="mr-1" />
                {summaryData.determination.replace('_', ' ').toUpperCase()}
              </div>
              <span className="text-sm text-text-muted">
                Confidence: {summaryData.confidence}%
              </span>
              <span className="text-sm text-text-muted">
                Analyzed: {new Date(summaryData.analysisDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-text-primary">Key Findings</h4>
        
        {/* Composer Information */}
        <div className="bg-surface-secondary rounded-md p-3">
          <h5 className="text-sm font-medium text-text-primary mb-2">Composer Information</h5>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Primary Composer:</span> {summaryData.composer}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Lyricist:</span> {summaryData.lyricist}
              </p>
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Publisher:</span> {summaryData.publisher}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Year Composed:</span> {summaryData.yearComposed}
              </p>
            </div>
          </div>
        </div>

        {/* Original Version */}
        {summaryData.originalVersion && (
          <div className="bg-surface-secondary rounded-md p-3">
            <h5 className="text-sm font-medium text-text-primary mb-2">Original Version</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">First Recorded By:</span> {summaryData.originalVersion.artist}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">Release Date:</span> {summaryData.originalVersion.releaseDate}
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">Label:</span> {summaryData.originalVersion.label}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-text-secondary">Catalog Number:</span> {summaryData.originalVersion.catalogNumber}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rights Information */}
        <div className="bg-surface-secondary rounded-md p-3">
          <h5 className="text-sm font-medium text-text-primary mb-2">Rights Information</h5>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Copyright Status:</span> {summaryData.copyrightStatus}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">PRO Registration:</span> {summaryData.proRegistration}
              </p>
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">ISWC:</span> {summaryData.iswc}
              </p>
              <p className="text-sm">
                <span className="font-medium text-text-secondary">Public Domain:</span> {summaryData.isPublicDomain ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Sources */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Verified Sources</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {summaryData.sources.map((source, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-surface-secondary rounded">
              <Icon name={source.icon} size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">{source.name}</span>
              {source.verified && (
                <Icon name="CheckCircle" size={12} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="border-t border-border pt-6">
        <h4 className="font-medium text-text-primary mb-4">Export Options</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {exportFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`p-3 rounded-md border transition-colors duration-200 ${
                selectedFormat === format.id
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-surface hover:bg-surface-secondary text-text-secondary'
              }`}
            >
              <Icon name={format.icon} size={20} className="mx-auto mb-1" />
              <p className="text-xs font-medium">{format.name}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Selected format: <span className="font-medium">{exportFormats.find(f => f.id === selectedFormat)?.name}</span>
          </div>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
          >
            Export Research
          </Button>
        </div>
      </div>

      {/* Research Notes */}
      {summaryData.notes && summaryData.notes.length > 0 && (
        <div className="border-t border-border pt-6 mt-6">
          <h4 className="font-medium text-text-primary mb-3">Research Notes</h4>
          <div className="space-y-2">
            {summaryData.notes.map((note, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-surface-secondary rounded">
                <Icon name="StickyNote" size={16} className="text-text-secondary mt-0.5" />
                <p className="text-sm text-text-primary">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportSummary;