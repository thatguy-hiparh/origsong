import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import SearchService from '../../services/searchService';
import { formatISRCWithoutDashes } from '../../utils/isrcUtils';

import PrimaryHeader from '../../components/ui/PrimaryHeader';
import ResearchContextSidebar from '../../components/ui/ResearchContextSidebar';
import DeterminationBanner from './components/DeterminationBanner';
import PlatformResults from './components/PlatformResults';
import MetadataComparison from './components/MetadataComparison';
import CreditAnalysis from './components/CreditAnalysis';
import ExportSummary from './components/ExportSummary';
import ActionButtons from './components/ActionButtons';

const SongResearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('platform-results');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [researchData, setResearchData] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [platformData, setPlatformData] = useState([]);

  // Get search parameters from navigation state or URL params
  const getSearchParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const stateData = location.state?.researchData;
    
    return {
      title: searchParams.get('title') || stateData?.title || stateData?.songTitle || '',
      artist: searchParams.get('artist') || stateData?.artist || stateData?.displayArtist || '',
      isrc: searchParams.get('isrc') || stateData?.isrc || ''
    };
  };

  // Validate and sanitize search parameters
  const validateSearchParams = (params) => {
    const sanitizedParams = {
      title: params.title?.trim() || '',
      artist: params.artist?.trim() || '',
      isrc: params.isrc?.trim() || ''
    };

    const isValid = sanitizedParams.title && sanitizedParams.artist;
    
    return {
      ...sanitizedParams,
      isValid,
      errorMessage: !isValid ? 'Missing required search parameters. Please provide both title and artist.' : null
    };
  };

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      setSearchError(null);
      
      try {
        const searchParams = getSearchParams();
        const validatedParams = validateSearchParams(searchParams);
        
        // Check if parameters are valid
        if (!validatedParams.isValid) {
          // If no parameters at all, redirect to research dashboard immediately
          if (!validatedParams.title && !validatedParams.artist) {
            navigate('/research-dashboard', { 
              state: { 
                message: 'Please provide song title and artist to start your research.',
                messageType: 'info'
              }
            });
            return;
          }
          
          // If partial parameters, show error but don't redirect immediately
          setSearchError(validatedParams.errorMessage);
          setIsLoading(false);
          return;
        }

        console.log('Searching for:', validatedParams);
        
        // Perform actual search with validated parameters
        const searchResults = await SearchService.searchSong({
          title: validatedParams.title,
          artist: validatedParams.artist,
          isrc: validatedParams.isrc
        });
        
        if (!searchResults.success) {
          throw new Error(searchResults.error || 'Search failed');
        }

        // Set platform data
        setPlatformData(searchResults.results);
        
        // Create research data from search results
        const researchDataFromSearch = {
          songTitle: validatedParams.title,
          artist: validatedParams.artist,
          isrc: validatedParams.isrc,
          determination: searchResults.confidence > 80 ? 'original' : 
                       searchResults.confidence > 60 ? 'verified' : 'needs_review',
          confidence: searchResults.confidence,
          analysisDate: searchResults.timestamp,
          searchResults: searchResults.results,
          totalResults: searchResults.results.reduce((sum, platform) => sum + (platform.resultsCount || 0), 0)
        };
        
        setResearchData(researchDataFromSearch);
        
        // If no results found, show appropriate message
        if (searchResults.results.every(platform => (platform.resultsCount || 0) === 0)) {
          setSearchError(`No results found for "${validatedParams.title}" by "${validatedParams.artist}". Please verify the song title and artist name.`);
        }
        
      } catch (error) {
        console.error('Search failed:', error);
        setSearchError(error.message);
        
        // Create fallback research data with validated parameters
        const searchParams = getSearchParams();
        const validatedParams = validateSearchParams(searchParams);
        
        if (validatedParams.isValid) {
          setResearchData({
            songTitle: validatedParams.title,
            artist: validatedParams.artist,
            isrc: validatedParams.isrc,
            determination: 'error',
            confidence: 0,
            analysisDate: new Date().toISOString(),
            searchResults: [],
            totalResults: 0
          });
        }
        
        setPlatformData([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [location.search, location.state, navigate]);

  // Generate comparison data from search results
  const generateComparisonData = () => {
    if (!platformData || platformData.length === 0) return { sources: [] };
    
    const sources = platformData
      .filter(platform => platform.results && platform.results.length > 0)
      .slice(0, 3) // Take first 3 platforms with results
      .map(platform => ({
        id: platform.platform,
        name: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
        icon: platform.platform === 'spotify' ? 'Music' : 
              platform.platform === 'youtube' ? 'Play' :
              platform.platform === 'apple-music' ? 'Smartphone' : 'Database',
        metadata: {
          title: platform.results[0]?.title || '',
          artist: platform.results[0]?.artist || '',
          album: platform.results[0]?.album || '',
          releaseDate: platform.results[0]?.releaseDate || '',
          isrc: platform.results[0]?.isrc || '',
          duration: platform.results[0]?.duration || '',
          genre: platform.results[0]?.genre || '',
          composer: platform.results[0]?.composer || '',
          publisher: platform.results[0]?.publisher || ''
        }
      }));

    return { sources };
  };

  // Generate credit analysis from search results
  const generateCreditAnalysis = () => {
    const firstResult = platformData.find(p => p.results && p.results.length > 0)?.results[0];
    
    if (!firstResult) return null;
    
    return {
      earliestVersion: {
        title: firstResult.title,
        artist: firstResult.artist,
        releaseDate: firstResult.releaseDate,
        label: firstResult.label || 'Unknown'
      },
      firstPerformer: {
        name: firstResult.artist || 'Unknown',
        nationality: 'Unknown',
        birthYear: null,
        deathYear: null
      },
      creditsByRole: {
        composer: firstResult.composer ? [{
          name: firstResult.composer,
          role: 'Composer',
          isVerified: true,
          birthYear: null,
          deathYear: null,
          nationality: 'Unknown',
          organizations: []
        }] : [],
        lyricist: firstResult.composer ? [{
          name: firstResult.composer,
          role: 'Lyricist',
          isVerified: true,
          birthYear: null,
          deathYear: null,
          nationality: 'Unknown',
          organizations: []
        }] : [],
        producer: [{
          name: 'Unknown',
          role: 'Producer',
          isVerified: false,
          birthYear: null,
          deathYear: null,
          nationality: 'Unknown',
          organizations: []
        }]
      },
      publicDomainAnalysis: firstResult.composer ? [{
        name: firstResult.composer,
        role: 'Composer',
        deathYear: new Date().getFullYear() - 50 // Default to 50 years ago for demonstration
      }] : [],
      classification: {
        type: researchData?.determination || 'unknown',
        description: `Analysis based on ${researchData?.totalResults || 0} search results across multiple platforms`
      }
    };
  };

  const generateTextExport = (data) => {
    return `SONG RESEARCH RESULTS
========================

Song: ${data.songTitle}
Artist: ${data.artist}
ISRC: ${data.isrc ? formatISRCWithoutDashes(data.isrc) : 'N/A'}
Determination: ${data.determination?.toUpperCase() || 'UNKNOWN'}
Confidence: ${data.confidence || 0}%
Analysis Date: ${new Date(data.analysisDate).toLocaleDateString()}
Total Results Found: ${data.totalResults || 0}

PLATFORM RESULTS
---------------
${platformData.map(platform => 
  `${platform.platform.toUpperCase()}: ${platform.status} (${platform.resultsCount || 0} results)`
).join('\n')}

${data.totalResults === 0 ? 'No matching results found across all platforms.' : ''}

Generated by Orisong Research Platform
${new Date().toLocaleString()}`;
  };

  const generateCSVExport = (data) => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['Song Title', data.songTitle],
      ['Artist', data.artist],
      ['ISRC', data.isrc ? formatISRCWithoutDashes(data.isrc) : 'N/A'],
      ['Determination', data.determination || 'Unknown'],
      ['Confidence', `${data.confidence || 0}%`],
      ['Total Results', data.totalResults || 0],
      ['Analysis Date', new Date(data.analysisDate).toLocaleDateString()]
    ];

    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const generateMarkdownExport = (data) => {
    return `# Song Research Results

## ${data.songTitle}
**Artist:** ${data.artist}  
**ISRC:** ${data.isrc ? formatISRCWithoutDashes(data.isrc) : 'N/A'}

**Determination:** ${data.determination?.toUpperCase() || 'UNKNOWN'}  
**Confidence:** ${data.confidence || 0}%  
**Analysis Date:** ${new Date(data.analysisDate).toLocaleDateString()}  
**Total Results:** ${data.totalResults || 0}

## Platform Results

${platformData.map(platform => 
  `- **${platform.platform.toUpperCase()}:** ${platform.status} (${platform.resultsCount || 0} results)`
).join('\n')}

${data.totalResults === 0 ? '\n*No matching results found across all platforms.*' : ''}

---
*Generated by Orisong Research Platform on ${new Date().toLocaleString()}*`;
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleToggleVerification = () => {
    setIsVerified(!isVerified);
  };

  const handleExport = async (format) => {
    const exportData = {
      ...researchData,
      format,
      exportDate: new Date().toISOString()
    };

    const filename = `song-research-${researchData.songTitle.toLowerCase().replace(/\s+/g, '-')}.${format}`;
    
    let content = '';
    switch (format) {
      case 'txt':
        content = generateTextExport(exportData);
        break;
      case 'csv':
        content = generateCSVExport(exportData);
        break;
      case 'markdown':
        content = generateMarkdownExport(exportData);
        break;
      case 'json':
        content = JSON.stringify(exportData, null, 2);
        break;
      default:
        content = JSON.stringify(exportData, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    const textContent = generateTextExport(researchData);
    await navigator.clipboard.writeText(textContent);
  };

  const handleStartNewResearch = () => {
    navigate('/research-dashboard');
  };

  const handleSaveToHistory = async () => {
    const historyEntry = {
      ...researchData,
      id: Date.now(),
      savedDate: new Date().toISOString(),
      verified: isVerified
    };

    const existingHistory = JSON.parse(localStorage.getItem('researchHistory') || '[]');
    existingHistory.unshift(historyEntry);
    localStorage.setItem('researchHistory', JSON.stringify(existingHistory.slice(0, 50)));
  };

  const tabs = [
    { id: 'platform-results', label: 'Platform Results', icon: 'Database' },
    { id: 'metadata-comparison', label: 'Metadata Comparison', icon: 'GitCompare' },
    { id: 'credit-analysis', label: 'Credit Analysis', icon: 'Users' },
    { id: 'export-summary', label: 'Export Summary', icon: 'FileText' }
  ];

  if (isLoading) {
    const searchParams = getSearchParams();
    const validatedParams = validateSearchParams(searchParams);
    
    // Don't show loading if parameters are invalid
    if (!validatedParams.isValid) {
      return (
        <div className="min-h-screen bg-background">
          <PrimaryHeader />
          <ResearchContextSidebar />
          <main className="main-content">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <div className="mx-auto mb-4">
                  <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  Missing Search Parameters
                </h2>
                <p className="text-text-secondary mb-6">
                  Both song title and artist are required to perform a search.
                </p>
                <div className="space-y-4">
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <h3 className="font-medium text-text-primary mb-2">Current Parameters:</h3>
                    <p className="text-sm text-text-secondary">
                      <strong>Title:</strong> {validatedParams.title || 'Not provided'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      <strong>Artist:</strong> {validatedParams.artist || 'Not provided'}
                    </p>
                    {validatedParams.isrc && (
                      <p className="text-sm text-text-secondary">
                        <strong>ISRC:</strong> {validatedParams.isrc ? formatISRCWithoutDashes(validatedParams.isrc) : 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate('/research-dashboard')}
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Go to Research Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-background">
        <PrimaryHeader />
        <ResearchContextSidebar />
        <main className="main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin mx-auto mb-4">
                  <Icon name="Loader2" size={48} className="text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  Searching Music Platforms
                </h2>
                <p className="text-text-secondary">
                  Searching for "{validatedParams.title}" by "{validatedParams.artist}"...
                </p>
                <div className="mt-4 space-y-2">
                  <div className="research-progress-indicator">
                    <div className="flex items-center space-x-2">
                      <div className="research-progress-step completed" />
                      <div className="research-progress-step active" />
                      <div className="research-progress-step pending" />
                      <div className="research-progress-step pending" />
                    </div>
                  </div>
                  <p className="text-sm text-text-muted">
                    Searching across multiple platforms...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (searchError) {
    const searchParams = getSearchParams();
    const validatedParams = validateSearchParams(searchParams);
    
    return (
      <div className="min-h-screen bg-background">
        <PrimaryHeader />
        <ResearchContextSidebar />
        <main className="main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="mx-auto mb-4">
                <Icon name="AlertCircle" size={48} className="text-yellow-500 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {validatedParams.isValid ? 'Search Results' : 'Invalid Search Parameters'}
              </h2>
              <p className="text-text-secondary mb-6">
                {searchError}
              </p>
              <div className="space-y-4">
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h3 className="font-medium text-text-primary mb-2">Search Parameters:</h3>
                  <p className="text-sm text-text-secondary">
                    <strong>Title:</strong> {validatedParams.title || 'Not provided'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    <strong>Artist:</strong> {validatedParams.artist || 'Not provided'}
                  </p>
                  {validatedParams.isrc && (
                    <p className="text-sm text-text-secondary">
                      <strong>ISRC:</strong> {validatedParams.isrc}
                    </p>
                  )}
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleStartNewResearch}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    New Search
                  </button>
                  {validatedParams.isValid && (
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-surface border border-border rounded-md hover:bg-surface-secondary transition-colors"
                    >
                      Retry Search
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PrimaryHeader />
      <ResearchContextSidebar />
      
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-text-secondary mb-2">
              <button 
                onClick={() => navigate('/research-dashboard')}
                className="hover:text-text-primary transition-colors duration-200"
              >
                Research Dashboard
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Song Research Results</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary">
              Research Results
            </h1>
            <p className="text-text-secondary mt-2">
              Search results for "{researchData?.songTitle}" by "{researchData?.artist}"
            </p>
          </div>

          {/* Determination Banner */}
          <DeterminationBanner
            determination={researchData?.determination || 'unknown'}
            confidence={researchData?.confidence || 0}
            songTitle={researchData?.songTitle || ''}
            artist={researchData?.artist || ''}
          />

          {/* Action Buttons */}
          <div className="mb-6">
            <ActionButtons
              isVerified={isVerified}
              onToggleVerification={handleToggleVerification}
              onExport={handleExport}
              onCopyToClipboard={handleCopyToClipboard}
              onStartNewResearch={handleStartNewResearch}
              onSaveToHistory={handleSaveToHistory}
            />
          </div>

          {/* Tabbed Content */}
          <div className="bg-surface border border-border rounded-lg">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border-secondary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'platform-results' && (
                <PlatformResults platformData={platformData} />
              )}
              
              {activeTab === 'metadata-comparison' && (
                <MetadataComparison comparisonData={generateComparisonData()} />
              )}
              
              {activeTab === 'credit-analysis' && (
                <CreditAnalysis creditData={generateCreditAnalysis()} />
              )}
              
              {activeTab === 'export-summary' && (
                <ExportSummary
                  summaryData={researchData}
                  onExport={handleExport}
                  onCopyToClipboard={handleCopyToClipboard}
                />
              )}
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-fixed">
            <div className="flex items-center justify-around py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${
                    activeTab === tab.id 
                      ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name={tab.icon} size={20} />
                  <span className="text-xs mt-1">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SongResearchResults;