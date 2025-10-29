import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  isVerified, 
  onToggleVerification, 
  onExport, 
  onCopyToClipboard,
  onStartNewResearch,
  onSaveToHistory 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport(format);
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

  const handleSaveToHistory = async () => {
    setIsSaving(true);
    try {
      await onSaveToHistory();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Verification Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon 
              name={isVerified ? "ShieldCheck" : "Shield"} 
              size={20} 
              className={isVerified ? "text-success" : "text-text-muted"} 
            />
            <span className="text-sm font-medium text-text-primary">
              Research Status:
            </span>
            <span className={`text-sm font-medium ${
              isVerified ? "text-success" : "text-warning"
            }`}>
              {isVerified ? "Verified" : "Needs Review"}
            </span>
          </div>
          <Button
            variant={isVerified ? "outline" : "primary"}
            size="sm"
            onClick={onToggleVerification}
            iconName={isVerified ? "X" : "Check"}
            iconPosition="left"
          >
            {isVerified ? "Mark as Unverified" : "Mark as Verified"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy to Clipboard */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyToClipboard}
            iconName={copySuccess ? "Check" : "Copy"}
            iconPosition="left"
            className={copySuccess ? "text-success" : ""}
          >
            {copySuccess ? "Copied!" : "Copy"}
          </Button>

          {/* Save to History */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveToHistory}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save
          </Button>

          {/* Print */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            iconName="Printer"
            iconPosition="left"
          >
            Print
          </Button>

          {/* Export Dropdown */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            
            <div className="dropdown-menu group-hover:block hidden">
              <button
                onClick={() => handleExport('txt')}
                className="dropdown-item flex items-center"
              >
                <Icon name="FileText" size={16} className="mr-2" />
                Plain Text (.txt)
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="dropdown-item flex items-center"
              >
                <Icon name="Table" size={16} className="mr-2" />
                CSV (.csv)
              </button>
              <button
                onClick={() => handleExport('markdown')}
                className="dropdown-item flex items-center"
              >
                <Icon name="Hash" size={16} className="mr-2" />
                Markdown (.md)
              </button>
              <button
                onClick={() => handleExport('json')}
                className="dropdown-item flex items-center"
              >
                <Icon name="Code" size={16} className="mr-2" />
                JSON (.json)
              </button>
            </div>
          </div>

          {/* New Research */}
          <Button
            variant="primary"
            size="sm"
            onClick={onStartNewResearch}
            iconName="Plus"
            iconPosition="left"
          >
            New Research
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-secondary">Quick Actions:</span>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => window.open('/lyric-comparison', '_blank')}
            iconName="GitCompare"
            iconPosition="left"
          >
            Compare Lyrics
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => window.open('/research-dashboard', '_blank')}
            iconName="Search"
            iconPosition="left"
          >
            Research Similar
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigator.share && navigator.share({
              title: 'Song Research Results',
              text: 'Check out these song research results',
              url: window.location.href
            })}
            iconName="Share"
            iconPosition="left"
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;