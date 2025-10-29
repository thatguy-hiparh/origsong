import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PreferencesSection = ({ preferences, onUpdatePreferences }) => {
  const [localPreferences, setLocalPreferences] = useState({
    defaultExportFormat: preferences?.defaultExportFormat || 'markdown',
    autoVerification: preferences?.autoVerification || false,
    emailNotifications: preferences?.emailNotifications || true,
    platformUpdates: preferences?.platformUpdates || true,
    researchReminders: preferences?.researchReminders || false,
    darkMode: preferences?.darkMode || true,
    compactView: preferences?.compactView || false,
    showAdvancedOptions: preferences?.showAdvancedOptions || false,
    autoSaveInterval: preferences?.autoSaveInterval || 5,
    maxSearchResults: preferences?.maxSearchResults || 50,
    defaultSearchPlatforms: preferences?.defaultSearchPlatforms || [
      'spotify', 'youtube', 'genius', 'discogs'
    ]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const exportFormats = [
    { value: 'txt', label: 'Plain Text (.txt)', icon: 'FileText' },
    { value: 'csv', label: 'CSV Spreadsheet (.csv)', icon: 'Table' },
    { value: 'markdown', label: 'Markdown (.md)', icon: 'Hash' },
    { value: 'json', label: 'JSON Data (.json)', icon: 'Code' }
  ];

  const searchPlatforms = [
    { id: 'spotify', name: 'Spotify', icon: 'Music' },
    { id: 'youtube', name: 'YouTube', icon: 'Play' },
    { id: 'genius', name: 'Genius', icon: 'MessageSquare' },
    { id: 'discogs', name: 'Discogs', icon: 'Disc' },
    { id: 'allmusic', name: 'AllMusic', icon: 'Music2' },
    { id: 'whosampled', name: 'WhoSampled', icon: 'Shuffle' },
    { id: 'secondhandsongs', name: 'SecondHandSongs', icon: 'Repeat' },
    { id: 'musixmatch', name: 'Musixmatch', icon: 'Type' }
  ];

  const handlePreferenceChange = (key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handlePlatformToggle = (platformId) => {
    const currentPlatforms = localPreferences.defaultSearchPlatforms;
    const updatedPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter(id => id !== platformId)
      : [...currentPlatforms, platformId];
    
    handlePreferenceChange('defaultSearchPlatforms', updatedPlatforms);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdatePreferences(localPreferences);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalPreferences({
      defaultExportFormat: preferences?.defaultExportFormat || 'markdown',
      autoVerification: preferences?.autoVerification || false,
      emailNotifications: preferences?.emailNotifications || true,
      platformUpdates: preferences?.platformUpdates || true,
      researchReminders: preferences?.researchReminders || false,
      darkMode: preferences?.darkMode || true,
      compactView: preferences?.compactView || false,
      showAdvancedOptions: preferences?.showAdvancedOptions || false,
      autoSaveInterval: preferences?.autoSaveInterval || 5,
      maxSearchResults: preferences?.maxSearchResults || 50,
      defaultSearchPlatforms: preferences?.defaultSearchPlatforms || [
        'spotify', 'youtube', 'genius', 'discogs'
      ]
    });
    setHasChanges(false);
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
        checked ? 'bg-primary' : 'bg-surface-tertiary'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Research Workflow */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Search" size={20} className="mr-2" />
          Research Workflow
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Default Export Format
            </label>
            <select
              value={localPreferences.defaultExportFormat}
              onChange={(e) => handlePreferenceChange('defaultExportFormat', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {exportFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Auto-save Interval (minutes)
            </label>
            <Input
              type="number"
              min="1"
              max="60"
              value={localPreferences.autoSaveInterval}
              onChange={(e) => handlePreferenceChange('autoSaveInterval', parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Max Search Results
            </label>
            <Input
              type="number"
              min="10"
              max="200"
              value={localPreferences.maxSearchResults}
              onChange={(e) => handlePreferenceChange('maxSearchResults', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Auto-verification</span>
              <p className="text-xs text-text-secondary">Automatically mark results as verified when confidence is high</p>
            </div>
            <ToggleSwitch
              checked={localPreferences.autoVerification}
              onChange={(checked) => handlePreferenceChange('autoVerification', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Compact View</span>
              <p className="text-xs text-text-secondary">Show research results in a condensed format</p>
            </div>
            <ToggleSwitch
              checked={localPreferences.compactView}
              onChange={(checked) => handlePreferenceChange('compactView', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Advanced Options</span>
              <p className="text-xs text-text-secondary">Show advanced search and filtering options</p>
            </div>
            <ToggleSwitch
              checked={localPreferences.showAdvancedOptions}
              onChange={(checked) => handlePreferenceChange('showAdvancedOptions', checked)}
            />
          </div>
        </div>
      </div>

      {/* Default Search Platforms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Globe" size={20} className="mr-2" />
          Default Search Platforms
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {searchPlatforms.map(platform => (
            <div
              key={platform.id}
              className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                localPreferences.defaultSearchPlatforms.includes(platform.id)
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-surface hover:bg-surface-secondary text-text-secondary'
              }`}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <div className="flex items-center space-x-2">
                <Icon name={platform.icon} size={16} />
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Bell" size={20} className="mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Email Notifications</span>
              <p className="text-xs text-text-secondary">Receive email updates about your research</p>
            </div>
            <ToggleSwitch
              checked={localPreferences.emailNotifications}
              onChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Platform Updates</span>
              <p className="text-xs text-text-secondary">Get notified when songs appear on new platforms</p>
            </div>
            <ToggleSwitch
              checked={localPreferences.platformUpdates}
              onChange={(checked) => handlePreferenceChange('platformUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Research Reminders</span>
              <p className="text-xs text-text-secondary">Remind me to follow up on incomplete research</p>
            </div>
            <ToggleSwitch
              checked={localPreferences.researchReminders}
              onChange={(checked) => handlePreferenceChange('researchReminders', checked)}
            />
          </div>
        </div>
      </div>

      {/* Interface */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Monitor" size={20} className="mr-2" />
          Interface
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Dark Mode</span>
              <p className="text-xs text-text-secondary">Use dark theme for better visibility</p>
            </div>
            <ToggleSwitch
              checked={localPreferences.darkMode}
              onChange={(checked) => handlePreferenceChange('darkMode', checked)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
        >
          Reset to Default
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={!hasChanges || isSaving}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSection;