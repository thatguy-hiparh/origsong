import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import PrimaryHeader from '../../components/ui/PrimaryHeader';
import ResearchContextSidebar from '../../components/ui/ResearchContextSidebar';
import AuthenticationWrapper from '../../components/ui/AuthenticationWrapper';
import ProfileSection from './components/ProfileSection';
import PreferencesSection from './components/PreferencesSection';
import ApiKeysSection from './components/ApiKeysSection';
import SecuritySection from './components/SecuritySection';

const AccountSettings = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(user || {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@university.edu',
    institution: 'Berkeley Music Research Institute',
    title: 'Senior Music Researcher',
    bio: 'Specializing in contemporary music analysis and digital musicology with over 10 years of experience in song originality research.',
    website: 'https://sarahmitchell.research.edu',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    plan: 'Professional',
    role: 'Senior Researcher',
    twoFactorEnabled: false,
    createdAt: '2023-01-15T10:30:00Z',
    lastLogin: new Date().toISOString()
  });

  const [userPreferences, setUserPreferences] = useState({
    defaultExportFormat: 'markdown',
    autoVerification: false,
    emailNotifications: true,
    platformUpdates: true,
    researchReminders: false,
    darkMode: true,
    compactView: false,
    showAdvancedOptions: false,
    autoSaveInterval: 5,
    maxSearchResults: 50,
    defaultSearchPlatforms: ['spotify', 'youtube', 'genius', 'discogs']
  });

  const [apiKeys, setApiKeys] = useState({
    spotify: {
      clientId: 'test_client_id_abc123',
      clientSecret: 'test_client_secret_xyz789'
    },
    youtube: {
      apiKey: 'AIzaSyTest123456789'
    },
    genius: {
      accessToken: 'genius_token_test456'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      description: 'Personal information and bio'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      description: 'Research workflow and display settings'
    },
    {
      id: 'api-keys',
      label: 'API Keys',
      icon: 'Key',
      description: 'Platform integrations and authentication'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Password and account security'
    }
  ];

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }

    const savedApiKeys = localStorage.getItem('apiKeys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
  }, []);

  const handleUpdateProfile = async (updatedProfile) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePreferences = async (updatedPreferences) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserPreferences(updatedPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateApiKeys = async (updatedApiKeys) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setApiKeys(updatedApiKeys);
      localStorage.setItem('apiKeys', JSON.stringify(updatedApiKeys));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to update API keys:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSecurity = async (securityUpdate) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(prev => ({
        ...prev,
        ...securityUpdate
      }));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to update security settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection
            user={userData}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'preferences':
        return (
          <PreferencesSection
            preferences={userPreferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );
      case 'api-keys':
        return (
          <ApiKeysSection
            apiKeys={apiKeys}
            onUpdateApiKeys={handleUpdateApiKeys}
          />
        );
      case 'security':
        return (
          <SecuritySection
            user={userData}
            onUpdateSecurity={handleUpdateSecurity}
          />
        );
      default:
        return null;
    }
  };

  const getBreadcrumbs = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    return [
      { label: 'Dashboard', path: '/research-dashboard' },
      { label: 'Account Settings', path: '/account-settings' },
      { label: currentTab?.label || 'Settings', path: null }
    ];
  };

  return (
    <div className="min-h-screen bg-background">
      <PrimaryHeader />
      <ResearchContextSidebar />
      
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="breadcrumb mb-6">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="breadcrumb-separator mx-2">/</span>}
                {crumb.path ? (
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="breadcrumb-item"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-text-primary">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Account Settings</h1>
              <p className="text-text-secondary mt-2">
                Manage your profile, preferences, and security settings
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastSaved && (
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="Check" size={16} className="text-success" />
                  <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              
              {isSaving && (
                <div className="flex items-center space-x-2 text-sm text-accent">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Saving...</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-lg p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary border-l-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{tab.label}</div>
                        <div className="text-xs opacity-75">{tab.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-text-primary mb-3">Account Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Plan</span>
                      <span className="text-text-primary font-medium">{userData.plan}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Member since</span>
                      <span className="text-text-primary">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">2FA Status</span>
                      <div className={`status-badge ${userData.twoFactorEnabled ? 'verified' : 'pending'}`}>
                        <Icon 
                          name={userData.twoFactorEnabled ? "Shield" : "ShieldOff"} 
                          size={10} 
                          className="mr-1" 
                        />
                        {userData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-surface border border-border rounded-lg p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AccountSettingsPage = () => {
  return (
    <AuthenticationWrapper requireAuth={true}>
      <AccountSettings />
    </AuthenticationWrapper>
  );
};

export default AccountSettingsPage;