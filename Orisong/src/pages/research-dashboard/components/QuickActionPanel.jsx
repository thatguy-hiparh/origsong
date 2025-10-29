import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionPanel = ({ onBulkResearch, onImportPlaylist, onViewTemplates }) => {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkFormat, setBulkFormat] = useState('csv'); // 'csv', 'json', 'text'

  const quickActions = [
    {
      title: 'Bulk Research',
      description: 'Upload multiple songs for batch analysis',
      icon: 'Upload',
      color: 'primary',
      action: () => setShowBulkModal(true)
    },
    {
      title: 'Import Playlist',
      description: 'Import from Spotify, Apple Music, or YouTube',
      icon: 'List',
      color: 'accent',
      action: onImportPlaylist
    },
    {
      title: 'Research Templates',
      description: 'Use pre-configured research templates',
      icon: 'FileTemplate',
      color: 'success',
      action: onViewTemplates
    },
    {
      title: 'API Integration',
      description: 'Connect external music databases',
      icon: 'Plug',
      color: 'warning',
      action: () => {/* API integration */}
    }
  ];

  const recentTemplates = [
    { name: 'Cover Song Analysis', uses: 45, icon: 'Copy' },
    { name: 'Original Composition', uses: 32, icon: 'Music' },
    { name: 'Public Domain Check', uses: 18, icon: 'Globe' },
    { name: 'Lyric Comparison', uses: 27, icon: 'FileText' }
  ];

  const handleBulkSubmit = () => {
    if (!bulkText.trim()) return;

    let songs = [];
    
    if (bulkFormat === 'csv') {
      const lines = bulkText.split('\n').filter(line => line.trim());
      songs = lines.map(line => {
        const [title, artist, isrc] = line.split(',').map(item => item.trim());
        return { title, artist, isrc: isrc || '' };
      });
    } else if (bulkFormat === 'json') {
      try {
        songs = JSON.parse(bulkText);
      } catch (error) {
        alert('Invalid JSON format');
        return;
      }
    } else {
      const lines = bulkText.split('\n').filter(line => line.trim());
      songs = lines.map(line => {
        const parts = line.split(' - ');
        return {
          title: parts[1] || line,
          artist: parts[0] || 'Unknown Artist',
          isrc: ''
        };
      });
    }

    onBulkResearch(songs);
    setShowBulkModal(false);
    setBulkText('');
  };

  const BulkResearchModal = () => (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-modal p-4">
      <div className="w-full max-w-2xl bg-surface rounded-lg shadow-xl border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">Bulk Research</h3>
            <p className="text-sm text-text-secondary mt-1">
              Upload multiple songs for batch analysis
            </p>
          </div>
          <button
            onClick={() => setShowBulkModal(false)}
            className="p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Input Format
            </label>
            <select
              value={bulkFormat}
              onChange={(e) => setBulkFormat(e.target.value)}
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="csv">CSV Format (Title, Artist, ISRC)</option>
              <option value="json">JSON Format</option>
              <option value="text">Text Format (Artist - Title)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Song Data
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={
                bulkFormat === 'csv' ?'Bohemian Rhapsody, Queen, GBUM71505078\nImagine, John Lennon, GBUM71505079'
                  : bulkFormat === 'json' ?'[{"title": "Bohemian Rhapsody", "artist": "Queen", "isrc": "GBUM71505078"}]' :'Queen - Bohemian Rhapsody\nJohn Lennon - Imagine'
              }
              rows={8}
              className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              {bulkText.split('\n').filter(line => line.trim()).length} songs detected
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowBulkModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleBulkSubmit}
                disabled={!bulkText.trim()}
                iconName="Upload"
                iconPosition="left"
              >
                Start Bulk Research
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Quick Actions Grid */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 bg-surface-secondary border border-border rounded-lg hover:bg-surface-tertiary transition-colors duration-200 text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 bg-${action.color}/20 rounded-lg flex items-center justify-center group-hover:bg-${action.color}/30 transition-colors duration-200`}>
                    <Icon name={action.icon} size={20} className={`text-${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{action.title}</h4>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-text-muted group-hover:text-text-secondary transition-colors duration-200" />
                </div>
                <p className="text-sm text-text-secondary">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Research Templates */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Research Templates</h3>
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={onViewTemplates}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentTemplates.map((template, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-surface-secondary rounded-md hover:bg-surface-tertiary transition-colors duration-200 cursor-pointer"
                onClick={() => {/* Apply template */}}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-md flex items-center justify-center">
                    <Icon name={template.icon} size={16} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{template.name}</h4>
                    <p className="text-xs text-text-secondary">Used {template.uses} times</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={14} className="text-text-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">Research completed for "Bohemian Rhapsody"</p>
                <p className="text-xs text-text-secondary">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">Bulk research started (15 songs)</p>
                <p className="text-xs text-text-secondary">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">Platform integration updated</p>
                <p className="text-xs text-text-secondary">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Keyboard Shortcuts</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">New Research</span>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-surface-secondary border border-border rounded text-xs text-text-primary">Ctrl</kbd>
                <span className="text-text-muted">+</span>
                <kbd className="px-2 py-1 bg-surface-secondary border border-border rounded text-xs text-text-primary">N</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Bulk Research</span>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-surface-secondary border border-border rounded text-xs text-text-primary">Ctrl</kbd>
                <span className="text-text-muted">+</span>
                <kbd className="px-2 py-1 bg-surface-secondary border border-border rounded text-xs text-text-primary">B</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Search History</span>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-surface-secondary border border-border rounded text-xs text-text-primary">Ctrl</kbd>
                <span className="text-text-muted">+</span>
                <kbd className="px-2 py-1 bg-surface-secondary border border-border rounded text-xs text-text-primary">H</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Research Modal */}
      {showBulkModal && <BulkResearchModal />}
    </>
  );
};

export default QuickActionPanel;