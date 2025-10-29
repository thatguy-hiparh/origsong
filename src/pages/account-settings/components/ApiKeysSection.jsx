import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ApiKeysSection = ({ apiKeys, onUpdateApiKeys }) => {
  const [localApiKeys, setLocalApiKeys] = useState(apiKeys || {});
  const [visibleKeys, setVisibleKeys] = useState({});
  const [isGenerating, setIsGenerating] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const platforms = [
    {
      id: 'spotify',
      name: 'Spotify',
      icon: 'Music',
      description: 'Access Spotify Web API for track metadata and streaming data',
      fields: [
        { key: 'clientId', label: 'Client ID', type: 'text' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password' }
      ],
      status: localApiKeys.spotify?.clientId ? 'connected' : 'disconnected',
      docsUrl: 'https://developer.spotify.com/documentation/web-api'
    },
    {
      id: 'youtube',
      name: 'YouTube Data API',
      icon: 'Play',
      description: 'Search YouTube for music videos and metadata',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password' }
      ],
      status: localApiKeys.youtube?.apiKey ? 'connected' : 'disconnected',
      docsUrl: 'https://developers.google.com/youtube/v3'
    },
    {
      id: 'genius',
      name: 'Genius',
      icon: 'MessageSquare',
      description: 'Access lyrics and song annotations from Genius',
      fields: [
        { key: 'accessToken', label: 'Access Token', type: 'password' }
      ],
      status: localApiKeys.genius?.accessToken ? 'connected' : 'disconnected',
      docsUrl: 'https://docs.genius.com'
    },
    {
      id: 'discogs',
      name: 'Discogs',
      icon: 'Disc',
      description: 'Access music database and marketplace data',
      fields: [
        { key: 'consumerKey', label: 'Consumer Key', type: 'text' },
        { key: 'consumerSecret', label: 'Consumer Secret', type: 'password' }
      ],
      status: localApiKeys.discogs?.consumerKey ? 'connected' : 'disconnected',
      docsUrl: 'https://www.discogs.com/developers'
    },
    {
      id: 'musixmatch',
      name: 'Musixmatch',
      icon: 'Type',
      description: 'Access lyrics database and synchronization data',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password' }
      ],
      status: localApiKeys.musixmatch?.apiKey ? 'connected' : 'disconnected',
      docsUrl: 'https://developer.musixmatch.com'
    },
    {
      id: 'lastfm',
      name: 'Last.fm',
      icon: 'Radio',
      description: 'Access music scrobbling and recommendation data',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password' },
        { key: 'sharedSecret', label: 'Shared Secret', type: 'password' }
      ],
      status: localApiKeys.lastfm?.apiKey ? 'connected' : 'disconnected',
      docsUrl: 'https://www.last.fm/api'
    }
  ];

  const handleKeyChange = (platformId, field, value) => {
    setLocalApiKeys(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const toggleKeyVisibility = (platformId, field) => {
    const key = `${platformId}_${field}`;
    setVisibleKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const generateTestKey = async (platformId) => {
    setIsGenerating(prev => ({ ...prev, [platformId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testKeys = {
        spotify: {
          clientId: 'test_client_id_' + Math.random().toString(36).substr(2, 9),
          clientSecret: 'test_client_secret_' + Math.random().toString(36).substr(2, 16)
        },
        youtube: {
          apiKey: 'AIza' + Math.random().toString(36).substr(2, 35)
        },
        genius: {
          accessToken: 'genius_token_' + Math.random().toString(36).substr(2, 20)
        },
        discogs: {
          consumerKey: 'discogs_key_' + Math.random().toString(36).substr(2, 12),
          consumerSecret: 'discogs_secret_' + Math.random().toString(36).substr(2, 16)
        },
        musixmatch: {
          apiKey: 'mxm_api_' + Math.random().toString(36).substr(2, 24)
        },
        lastfm: {
          apiKey: 'lastfm_key_' + Math.random().toString(36).substr(2, 16),
          sharedSecret: 'lastfm_secret_' + Math.random().toString(36).substr(2, 16)
        }
      };

      setLocalApiKeys(prev => ({
        ...prev,
        [platformId]: testKeys[platformId]
      }));
      setHasChanges(true);
    } catch (error) {
      console.error('Failed to generate test key:', error);
    } finally {
      setIsGenerating(prev => ({ ...prev, [platformId]: false }));
    }
  };

  const testConnection = async (platformId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate successful connection test
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdateApiKeys(localApiKeys);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save API keys:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-error" />;
      default:
        return <Icon name="Circle" size={16} className="text-text-muted" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return (
          <div className="status-badge verified">
            <Icon name="Wifi" size={10} className="mr-1" />
            Connected
          </div>
        );
      case 'error':
        return (
          <div className="status-badge error">
            <Icon name="WifiOff" size={10} className="mr-1" />
            Error
          </div>
        );
      default:
        return (
          <div className="status-badge pending">
            <Icon name="Clock" size={10} className="mr-1" />
            Not Connected
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">API Integration</h3>
          <p className="text-sm text-text-secondary">
            Manage your API keys for external music platforms and services
          </p>
        </div>
        <div className="status-badge verified">
          <Icon name="Shield" size={12} className="mr-1" />
          Encrypted
        </div>
      </div>

      {/* Platform Cards */}
      <div className="space-y-4">
        {platforms.map(platform => (
          <div key={platform.id} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-surface-secondary rounded-lg flex items-center justify-center">
                  <Icon name={platform.icon} size={20} className="text-text-secondary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-text-primary">{platform.name}</h4>
                  <p className="text-sm text-text-secondary">{platform.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(platform.status)}
                {getStatusIcon(platform.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {platform.fields.map(field => {
                const key = `${platform.id}_${field.key}`;
                const isVisible = visibleKeys[key];
                const value = localApiKeys[platform.id]?.[field.key] || '';

                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Input
                        type={field.type === 'password' && !isVisible ? 'password' : 'text'}
                        value={value}
                        onChange={(e) => handleKeyChange(platform.id, field.key, e.target.value)}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        className="pr-10"
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => toggleKeyVisibility(platform.id, field.key)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        >
                          <Icon name={isVisible ? "EyeOff" : "Eye"} size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateTestKey(platform.id)}
                  loading={isGenerating[platform.id]}
                  disabled={isGenerating[platform.id]}
                  iconName="Key"
                  iconPosition="left"
                >
                  Generate Test Key
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(platform.docsUrl, '_blank')}
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  Documentation
                </Button>
              </div>
              
              {platform.status === 'connected' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => testConnection(platform.id)}
                  iconName="Zap"
                  iconPosition="left"
                >
                  Test Connection
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-surface-secondary border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-1">Security Notice</h4>
            <p className="text-sm text-text-secondary">
              Your API keys are encrypted and stored securely. They are only used for authorized requests to the respective platforms. 
              Never share your API keys with unauthorized parties.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => {
            setLocalApiKeys(apiKeys || {});
            setHasChanges(false);
          }}
          disabled={!hasChanges || isSaving}
        >
          Reset Changes
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={!hasChanges || isSaving}
        >
          Save API Keys
        </Button>
      </div>
    </div>
  );
};

export default ApiKeysSection;