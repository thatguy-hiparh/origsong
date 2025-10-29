import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ResearchContextSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [researchProgress, setResearchProgress] = useState({
    currentStep: 1,
    totalSteps: 4,
    steps: [
      { id: 1, label: 'Song Input', status: 'completed', path: '/research-dashboard' },
      { id: 2, label: 'Analysis', status: 'active', path: '/song-research-results' },
      { id: 3, label: 'Comparison', status: 'pending', path: '/lyric-comparison' },
      { id: 4, label: 'Export', status: 'pending', path: '/research-export' }
    ]
  });
  
  const [platformStatus, setPlatformStatus] = useState([
    { name: 'Spotify', status: 'connected', icon: 'Music' },
    { name: 'YouTube', status: 'connected', icon: 'Play' },
    { name: 'SoundCloud', status: 'error', icon: 'Cloud' },
    { name: 'Apple Music', status: 'pending', icon: 'Music2' }
  ]);

  const researchTools = [
    {
      label: 'Quick Search',
      icon: 'Search',
      path: '/research-dashboard',
      tooltip: 'Start a new song research session'
    },
    {
      label: 'Results Overview',
      icon: 'BarChart3',
      path: '/song-research-results',
      tooltip: 'View comprehensive analysis results'
    },
    {
      label: 'Lyric Compare',
      icon: 'GitCompare',
      path: '/lyric-comparison',
      tooltip: 'Compare lyrics between multiple songs'
    },
    {
      label: 'Export Data',
      icon: 'Download',
      path: '/research-export',
      tooltip: 'Export research findings and documentation'
    }
  ];

  useEffect(() => {
    // Simulate research progress updates
    const updateProgress = () => {
      const currentPath = location.pathname;
      const currentTool = researchTools.find(tool => tool.path === currentPath);
      
      if (currentTool) {
        setResearchProgress(prev => ({
          ...prev,
          steps: prev.steps.map(step => {
            if (step.path === currentPath) {
              return { ...step, status: 'active' };
            } else if (step.id < prev.currentStep) {
              return { ...step, status: 'completed' };
            }
            return { ...step, status: 'pending' };
          })
        }));
      }
    };

    updateProgress();
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-error" />;
      case 'pending':
        return <Icon name="Clock" size={16} className="text-warning" />;
      default:
        return <Icon name="Circle" size={16} className="text-text-muted" />;
    }
  };

  const ProgressIndicator = () => (
    <div className="research-progress-indicator">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-medium text-text-secondary">
          Research Progress
        </span>
        <span className="text-xs text-text-muted">
          {researchProgress.currentStep}/{researchProgress.totalSteps}
        </span>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        {researchProgress.steps.map((step) => (
          <div
            key={step.id}
            className={`research-progress-step ${step.status}`}
            title={`${step.label} - ${step.status}`}
          />
        ))}
      </div>
    </div>
  );

  const PlatformStatus = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-primary">Platform Integration</h3>
      <div className="space-y-2">
        {platformStatus.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200">
            <div className="flex items-center space-x-2">
              <Icon name={platform.icon} size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">{platform.name}</span>
            </div>
            {getStatusIcon(platform.status)}
          </div>
        ))}
      </div>
    </div>
  );

  const ResearchTools = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-primary">Research Tools</h3>
      <nav className="space-y-1">
        {researchTools.map((tool) => (
          <div key={tool.path} className="relative group">
            <button
              onClick={() => handleNavigation(tool.path)}
              className={`nav-link w-full justify-start ${isActivePath(tool.path) ? 'active' : ''}`}
              title={tool.tooltip}
            >
              <Icon name={tool.icon} size={16} className="mr-2" />
              {!isCollapsed && tool.label}
            </button>
            {isCollapsed && (
              <div className="contextual-tooltip group-hover:show left-full top-1/2 transform -translate-y-1/2 ml-2">
                {tool.tooltip}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  const QuickActions = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-primary">Quick Actions</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation('/research-dashboard')}
          className="w-full justify-start"
          iconName="Plus"
          iconPosition="left"
        >
          {!isCollapsed && 'New Research'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.print()}
          className="w-full justify-start"
          iconName="Printer"
          iconPosition="left"
        >
          {!isCollapsed && 'Print Results'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigation('/research-history')}
          className="w-full justify-start"
          iconName="History"
          iconPosition="left"
        >
          {!isCollapsed && 'View History'}
        </Button>
      </div>
    </div>
  );

  // Only show sidebar on research-related pages
  const researchPaths = ['/research-dashboard', '/song-research-results', '/lyric-comparison', '/research-export'];
  const shouldShowSidebar = researchPaths.some(path => location.pathname.startsWith(path));

  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'w-16' : 'w-sidebar-width'} transition-all duration-300 ease-out`}>
        <div className="p-4 h-full flex flex-col">
          {/* Collapse Toggle */}
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-text-primary">Research Hub</h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
                className="text-text-secondary" 
              />
            </button>
          </div>

          {/* Progress Indicator */}
          {!isCollapsed && (
            <div className="mb-6">
              <ProgressIndicator />
            </div>
          )}

          {/* Research Tools Navigation */}
          <div className="mb-6">
            <ResearchTools />
          </div>

          {/* Platform Status */}
          {!isCollapsed && (
            <div className="mb-6">
              <PlatformStatus />
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-6">
            <QuickActions />
          </div>

          {/* Current Research Info */}
          {!isCollapsed && (
            <div className="mt-auto p-3 bg-surface-secondary rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="FileText" size={16} className="text-accent" />
                <span className="text-sm font-medium text-text-primary">Current Research</span>
              </div>
              <p className="text-xs text-text-secondary">
                "Song Title Analysis" - Started 2 hours ago
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="status-badge verified">
                  <Icon name="Shield" size={12} className="mr-1" />
                  Verified
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-fixed">
        <div className="flex items-center justify-around py-2">
          {researchTools.slice(0, 4).map((tool) => (
            <button
              key={tool.path}
              onClick={() => handleNavigation(tool.path)}
              className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${
                isActivePath(tool.path) 
                  ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={tool.icon} size={20} />
              <span className="text-xs mt-1">{tool.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResearchContextSidebar;