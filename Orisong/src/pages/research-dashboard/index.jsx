import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PrimaryHeader from '../../components/ui/PrimaryHeader';
import ResearchContextSidebar from '../../components/ui/ResearchContextSidebar';
import AuthenticationWrapper from '../../components/ui/AuthenticationWrapper';
import SongEntryForm from './components/SongEntryForm';
import ResearchHistoryTable from './components/ResearchHistoryTable';
import ResearchStatistics from './components/ResearchStatistics';
import QuickActionPanel from './components/QuickActionPanel';

const ResearchDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isResearching, setIsResearching] = useState(false);
  const [researchHistory, setResearchHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load research history from localStorage
    const savedHistory = localStorage.getItem('researchHistory');
    if (savedHistory) {
      setResearchHistory(JSON.parse(savedHistory));
    } else {
      // Mock research history data
      const mockHistory = [
        {
          id: 1,
          title: "Bohemian Rhapsody",
          subtitle: "",
          artist: "Queen",
          isrc: "GBUM71505078",
          status: "Original",
          confidence: 95,
          completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          platforms: ["Spotify", "YouTube", "Apple Music", "Discogs"],
          composer: "Freddie Mercury",
          publisher: "Queen Music Ltd."
        },
        {
          id: 2,
          title: "Imagine",
          subtitle: "",
          artist: "John Lennon",
          isrc: "GBUM71505079",
          status: "Original",
          confidence: 98,
          completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          platforms: ["Spotify", "YouTube", "Apple Music", "AllMusic"],
          composer: "John Lennon",
          publisher: "Lenono Music"
        },
        {
          id: 3,
          title: "Hallelujah",
          subtitle: "",
          artist: "Jeff Buckley",
          isrc: "USCO19940001",
          status: "Cover",
          confidence: 92,
          completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          platforms: ["Spotify", "YouTube", "Genius", "SecondHandSongs"],
          composer: "Leonard Cohen",
          publisher: "Sony Music Publishing",
          originalArtist: "Leonard Cohen",
          originalYear: 1984
        },
        {
          id: 4,
          title: "Amazing Grace",
          subtitle: "",
          artist: "Various Artists",
          isrc: "",
          status: "Public Domain",
          confidence: 100,
          completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          platforms: ["AllMusic", "IMSLP", "Public Domain Info"],
          composer: "John Newton",
          publisher: "Public Domain",
          yearComposed: 1772
        },
        {
          id: 5,
          title: "Stairway to Heaven",
          subtitle: "",
          artist: "Led Zeppelin",
          isrc: "GBUM71505080",
          status: "Original",
          confidence: 89,
          completedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          platforms: ["Spotify", "YouTube", "Apple Music", "Discogs"],
          composer: "Jimmy Page, Robert Plant",
          publisher: "Warner Music Group"
        }
      ];
      setResearchHistory(mockHistory);
      localStorage.setItem('researchHistory', JSON.stringify(mockHistory));
    }

    // Generate recent searches from history
    const recent = researchHistory.slice(0, 10).map(item => ({
      title: item.title,
      artist: item.artist,
      subtitle: item.subtitle,
      isrc: item.isrc
    }));
    setRecentSearches(recent);
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            document.querySelector('input[placeholder*="song title"]')?.focus();
            break;
          case 'b':
            e.preventDefault();
            handleBulkResearch([]);
            break;
          case 'h':
            e.preventDefault();
            setActiveTab('history');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStartResearch = async (formData) => {
    setIsResearching(true);
    
    try {
      // Validate form data before navigation
      if (!formData.title?.trim() || !formData.displayArtist?.trim()) {
        throw new Error('Song title and artist are required');
      }

      // Navigate to results page with search parameters
      const searchParams = new URLSearchParams({
        title: formData.title.trim(),
        artist: formData.displayArtist.trim(),
        isrc: formData.isrc?.trim() || ''
      });
      
      // Navigate to results page - the search will happen there
      navigate(`/song-research-results?${searchParams.toString()}`, {
        state: {
          researchData: {
            songTitle: formData.title.trim(),
            displayArtist: formData.displayArtist.trim(),
            isrc: formData.isrc?.trim() || '',
            timestamp: new Date().toISOString()
          }
        }
      });
      
    } catch (error) {
      console.error('Navigation failed:', error);
      // Show error message to user
      alert(`Error: ${error.message}`);
    } finally {
      setIsResearching(false);
    }
  };

  const handleViewDetails = (research) => {
    // Validate research data before navigation
    if (!research.title?.trim() || !research.artist?.trim()) {
      console.error('Invalid research data:', research);
      return;
    }

    const searchParams = new URLSearchParams({
      title: research.title.trim(),
      artist: research.artist.trim(),
      isrc: research.isrc?.trim() || ''
    });
    
    navigate(`/song-research-results?${searchParams.toString()}`, {
      state: {
        researchData: {
          songTitle: research.title.trim(),
          displayArtist: research.artist.trim(),
          isrc: research.isrc?.trim() || '',
          timestamp: new Date().toISOString()
        }
      }
    });
  };

  const handleDeleteResearch = (researchId) => {
    const updatedHistory = researchHistory.filter(item => item.id !== researchId);
    setResearchHistory(updatedHistory);
    localStorage.setItem('researchHistory', JSON.stringify(updatedHistory));
  };

  const handleBulkResearch = (songs) => {
    if (songs.length === 0) {
      // Show bulk research modal
      return;
    }
    
    // Process bulk research
    console.log('Starting bulk research for:', songs);
    // Implementation would handle multiple songs
  };

  const handleImportPlaylist = () => {
    // Implementation for playlist import
    console.log('Import playlist functionality');
  };

  const handleViewTemplates = () => {
    // Implementation for research templates
    console.log('View templates functionality');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'tools', label: 'Tools', icon: 'Wrench' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PrimaryHeader />
      <ResearchContextSidebar />
      
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Research Dashboard</h1>
                <p className="text-text-secondary mt-2">
                  Analyze song originality and track composition history
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">
                      Welcome back, {user.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {researchHistory.length} researches completed
                    </p>
                  </div>
                )}
                <Button
                  variant="primary"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => document.querySelector('input[placeholder*="song title"]')?.focus()}
                >
                  New Research
                </Button>
              </div>
            </div>
          </div>

          {/* Research Progress Indicator */}
          {isResearching && (
            <div className="mb-8 p-4 bg-surface border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Loader2" size={20} className="text-primary animate-spin" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Research in Progress</p>
                  <p className="text-xs text-text-secondary">
                    Analyzing across multiple platforms...
                  </p>
                </div>
              </div>
              <div className="mt-3 w-full bg-surface-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-8">
                  <SongEntryForm
                    onStartResearch={handleStartResearch}
                    recentSearches={recentSearches}
                  />
                  <ResearchHistoryTable
                    researchHistory={researchHistory.slice(0, 5)}
                    onViewDetails={handleViewDetails}
                    onDeleteResearch={handleDeleteResearch}
                  />
                </div>
                <div className="xl:col-span-1">
                  <ResearchStatistics researchHistory={researchHistory} />
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <ResearchHistoryTable
                researchHistory={researchHistory}
                onViewDetails={handleViewDetails}
                onDeleteResearch={handleDeleteResearch}
              />
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Detailed Analytics
                    </h3>
                    <p className="text-text-secondary">
                      Comprehensive analytics dashboard coming soon...
                    </p>
                  </div>
                </div>
                <div className="xl:col-span-1">
                  <ResearchStatistics researchHistory={researchHistory} />
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <QuickActionPanel
                    onBulkResearch={handleBulkResearch}
                    onImportPlaylist={handleImportPlaylist}
                    onViewTemplates={handleViewTemplates}
                  />
                </div>
                <div className="xl:col-span-1">
                  <ResearchStatistics researchHistory={researchHistory} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const WrappedResearchDashboard = () => (
  <AuthenticationWrapper>
    <ResearchDashboard />
  </AuthenticationWrapper>
);

export default WrappedResearchDashboard;