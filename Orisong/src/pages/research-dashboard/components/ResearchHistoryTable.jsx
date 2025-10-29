import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResearchHistoryTable = ({ researchHistory = [], onViewDetails, onDeleteResearch }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'completedAt',
    direction: 'desc'
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    'Original': 'success',
    'Cover': 'warning',
    'Public Domain': 'info',
    'Inconclusive': 'secondary',
    'Processing': 'warning',
    'Error': 'danger'
  };

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = researchHistory;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'completedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [researchHistory, sortConfig, filterStatus, searchTerm]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-muted" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-text-primary" />;
  };

  const getStatusBadge = (status) => {
    const colorClass = statusColors[status] || 'secondary';
    return (
      <div className={`status-badge ${colorClass}`}>
        {status}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 90) return <Icon name="CheckCircle" size={16} className="text-success" />;
    if (confidence >= 70) return <Icon name="AlertCircle" size={16} className="text-warning" />;
    return <Icon name="XCircle" size={16} className="text-error" />;
  };

  if (researchHistory.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-8 text-center">
        <Icon name="FileText" size={48} className="text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Research History</h3>
        <p className="text-text-secondary mb-4">
          Your completed research sessions will appear here
        </p>
        <Button
          variant="primary"
          iconName="Plus"
          iconPosition="left"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Start Your First Research
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Research History</h2>
            <p className="text-sm text-text-secondary mt-1">
              {filteredAndSortedHistory.length} of {researchHistory.length} research sessions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => {/* Export functionality */}}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search by song title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-surface-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Original">Original</option>
              <option value="Cover">Cover</option>
              <option value="Public Domain">Public Domain</option>
              <option value="Inconclusive">Inconclusive</option>
              <option value="Processing">Processing</option>
              <option value="Error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:bg-surface-tertiary transition-colors duration-200"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-2">
                  <span>Song Details</span>
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-surface-tertiary transition-colors duration-200"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-surface-tertiary transition-colors duration-200"
                onClick={() => handleSort('confidence')}
              >
                <div className="flex items-center space-x-2">
                  <span>Confidence</span>
                  {getSortIcon('confidence')}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-surface-tertiary transition-colors duration-200"
                onClick={() => handleSort('completedAt')}
              >
                <div className="flex items-center space-x-2">
                  <span>Completed</span>
                  {getSortIcon('completedAt')}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedHistory.map((item) => (
              <tr key={item.id} className="hover:bg-surface-secondary transition-colors duration-200">
                <td>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-surface-tertiary rounded-md flex items-center justify-center">
                      <Icon name="Music" size={16} className="text-text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{item.title}</h4>
                      <p className="text-sm text-text-secondary">by {item.artist}</p>
                      {item.isrc && (
                        <p className="text-xs text-text-muted font-mono">{item.isrc}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {getStatusBadge(item.status)}
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    {getConfidenceIcon(item.confidence)}
                    <span className="text-sm text-text-primary">{item.confidence}%</span>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-text-primary">
                    {formatDate(item.completedAt)}
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(item)}
                      className="text-text-secondary hover:text-text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={() => {/* Export individual research */}}
                      className="text-text-secondary hover:text-text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDeleteResearch(item.id)}
                      className="text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAndSortedHistory.length > 10 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Showing {Math.min(10, filteredAndSortedHistory.length)} of {filteredAndSortedHistory.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="ChevronLeft" disabled>
              Previous
            </Button>
            <Button variant="ghost" size="sm" iconName="ChevronRight" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchHistoryTable;