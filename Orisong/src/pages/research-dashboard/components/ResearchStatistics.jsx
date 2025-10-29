import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResearchStatistics = ({ researchHistory = [] }) => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [stats, setStats] = useState({
    totalResearches: 0,
    originalSongs: 0,
    coverSongs: 0,
    publicDomain: 0,
    verificationRate: 0,
    platformsIntegrated: 0,
    averageConfidence: 0
  });

  const platformStatus = [
    { name: 'Spotify', status: 'connected', icon: 'Music', lastSync: '2 min ago' },
    { name: 'YouTube', status: 'connected', icon: 'Play', lastSync: '5 min ago' },
    { name: 'Apple Music', status: 'connected', icon: 'Music2', lastSync: '1 hour ago' },
    { name: 'Genius', status: 'connected', icon: 'FileText', lastSync: '30 min ago' },
    { name: 'Discogs', status: 'connected', icon: 'Disc', lastSync: '15 min ago' },
    { name: 'SoundCloud', status: 'error', icon: 'Cloud', lastSync: '2 hours ago' },
    { name: 'AllMusic', status: 'pending', icon: 'Database', lastSync: 'Never' },
    { name: 'Musixmatch', status: 'connected', icon: 'Music3', lastSync: '10 min ago' }
  ];

  useEffect(() => {
    calculateStats();
  }, [researchHistory, timeRange]);

  const calculateStats = () => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    const filteredHistory = researchHistory.filter(item => 
      new Date(item.completedAt) >= startDate
    );

    const totalResearches = filteredHistory.length;
    const originalSongs = filteredHistory.filter(item => item.status === 'Original').length;
    const coverSongs = filteredHistory.filter(item => item.status === 'Cover').length;
    const publicDomain = filteredHistory.filter(item => item.status === 'Public Domain').length;
    
    const verifiedResearches = filteredHistory.filter(item => item.confidence >= 80).length;
    const verificationRate = totalResearches > 0 ? (verifiedResearches / totalResearches) * 100 : 0;
    
    const connectedPlatforms = platformStatus.filter(platform => platform.status === 'connected').length;
    
    const totalConfidence = filteredHistory.reduce((sum, item) => sum + item.confidence, 0);
    const averageConfidence = totalResearches > 0 ? totalConfidence / totalResearches : 0;

    setStats({
      totalResearches,
      originalSongs,
      coverSongs,
      publicDomain,
      verificationRate: Math.round(verificationRate),
      platformsIntegrated: connectedPlatforms,
      averageConfidence: Math.round(averageConfidence)
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircle" size={12} className="text-success" />;
      case 'error':
        return <Icon name="XCircle" size={12} className="text-error" />;
      case 'pending':
        return <Icon name="Clock" size={12} className="text-warning" />;
      default:
        return <Icon name="Circle" size={12} className="text-text-muted" />;
    }
  };

  const StatCard = ({ title, value, icon, trend, color = 'primary' }) => (
    <div className="bg-surface-secondary rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 bg-${color}/20 rounded-md flex items-center justify-center`}>
          <Icon name={icon} size={16} className={`text-${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs ${
            trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-text-muted'
          }`}>
            <Icon 
              name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold text-text-primary mb-1">
        {typeof value === 'number' && value > 999 ? `${(value / 1000).toFixed(1)}k` : value}
      </div>
      <div className="text-sm text-text-secondary">{title}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Research Analytics</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 bg-surface-secondary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Total Researches"
            value={stats.totalResearches}
            icon="FileText"
            trend={12}
            color="primary"
          />
          <StatCard
            title="Verification Rate"
            value={`${stats.verificationRate}%`}
            icon="Shield"
            trend={5}
            color="success"
          />
          <StatCard
            title="Original Songs"
            value={stats.originalSongs}
            icon="Music"
            trend={8}
            color="accent"
          />
          <StatCard
            title="Cover Songs"
            value={stats.coverSongs}
            icon="Copy"
            trend={-3}
            color="warning"
          />
        </div>
      </div>

      {/* Platform Integration Status */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Platform Integration</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-text-secondary">
              {stats.platformsIntegrated} of {platformStatus.length} connected
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {platformStatus.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Icon name={platform.icon} size={16} className="text-text-secondary" />
                <div>
                  <span className="text-sm font-medium text-text-primary">{platform.name}</span>
                  <p className="text-xs text-text-muted">Last sync: {platform.lastSync}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(platform.status)}
                <span className={`text-xs capitalize ${
                  platform.status === 'connected' ? 'text-success' :
                  platform.status === 'error' ? 'text-error' : 'text-warning'
                }`}>
                  {platform.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            className="w-full"
            onClick={() => {/* Refresh platform connections */}}
          >
            Refresh All Connections
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="BarChart3"
            iconPosition="left"
            className="w-full justify-start"
            onClick={() => {/* View detailed analytics */}}
          >
            View Detailed Analytics
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconPosition="left"
            className="w-full justify-start"
            onClick={() => {/* Export research data */}}
          >
            Export Research Data
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            className="w-full justify-start"
            onClick={() => {/* Platform settings */}}
          >
            Platform Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="HelpCircle"
            iconPosition="left"
            className="w-full justify-start"
            onClick={() => {/* Help documentation */}}
          >
            Help & Documentation
          </Button>
        </div>
      </div>

      {/* Research Insights */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Research Insights</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-2 bg-surface-secondary rounded-md">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Research accuracy improved by 15%
              </p>
              <p className="text-xs text-text-secondary">
                Compared to last month
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-surface-secondary rounded-md">
            <Icon name="Clock" size={16} className="text-accent" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Average research time: 45 seconds
              </p>
              <p className="text-xs text-text-secondary">
                3 seconds faster than average
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-surface-secondary rounded-md">
            <Icon name="Target" size={16} className="text-warning" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Most researched genre: Pop
              </p>
              <p className="text-xs text-text-secondary">
                42% of total researches
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchStatistics;