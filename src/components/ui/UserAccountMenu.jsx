import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const UserAccountMenu = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    researchHistory: true
  });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    // Load user preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  const handlePreferenceToggle = (preference) => {
    const updatedPreferences = {
      ...userPreferences,
      [preference]: !userPreferences[preference]
    };
    setUserPreferences(updatedPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
  };

  const menuItems = [
    {
      label: 'Account Settings',
      icon: 'Settings',
      path: '/account-settings',
      description: 'Manage your profile and preferences'
    },
    {
      label: 'Research History',
      icon: 'History',
      path: '/research-history',
      description: 'View past research sessions'
    },
    {
      label: 'Subscription',
      icon: 'CreditCard',
      path: '/subscription',
      description: 'Manage your subscription plan'
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      path: '/support',
      description: 'Get help and contact support'
    }
  ];

  const quickPreferences = [
    {
      key: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Receive research updates'
    },
    {
      key: 'autoSave',
      label: 'Auto-save',
      icon: 'Save',
      description: 'Automatically save research progress'
    }
  ];

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/login')}
          className="text-text-secondary hover:text-text-primary"
        >
          Sign In
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/register')}
        >
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Menu Trigger */}
      <button
        onClick={handleMenuToggle}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Icon name="User" size={16} color="white" />
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-text-primary">
            {user.name || 'Researcher'}
          </p>
          <p className="text-xs text-text-secondary">
            {user.role || 'Professional'}
          </p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-xl z-dropdown animate-scale-in">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={20} color="white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  {user.name || 'Researcher'}
                </h3>
                <p className="text-xs text-text-secondary">
                  {user.email || 'researcher@orisong.com'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="status-badge verified">
                    <Icon name="Shield" size={10} className="mr-1" />
                    Verified
                  </div>
                  <span className="text-xs text-text-muted">
                    {user.plan || 'Professional'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preferences */}
          <div className="p-4 border-b border-border">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
              Quick Settings
            </h4>
            <div className="space-y-2">
              {quickPreferences.map((pref) => (
                <div key={pref.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={pref.icon} size={14} className="text-text-secondary" />
                    <div>
                      <span className="text-sm text-text-primary">{pref.label}</span>
                      <p className="text-xs text-text-secondary">{pref.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle(pref.key)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                      userPreferences[pref.key] ? 'bg-primary' : 'bg-surface-tertiary'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                        userPreferences[pref.key] ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="dropdown-item w-full text-left flex items-center p-3 rounded-md"
              >
                <Icon name={item.icon} size={16} className="mr-3 text-text-secondary" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-text-primary">
                    {item.label}
                  </span>
                  <p className="text-xs text-text-secondary">
                    {item.description}
                  </p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-text-muted" />
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="dropdown-item w-full text-left flex items-center p-3 rounded-md text-error hover:text-error hover:bg-error/10"
            >
              <Icon name="LogOut" size={16} className="mr-3" />
              <div className="flex-1">
                <span className="text-sm font-medium">Sign Out</span>
                <p className="text-xs opacity-75">End your current session</p>
              </div>
            </button>
          </div>

          {/* Footer Info */}
          <div className="p-3 bg-surface-secondary rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Session expires in 2h 45m</span>
              <button 
                onClick={() => handleNavigation('/account-settings')}
                className="text-accent hover:text-accent-400 transition-colors duration-200"
              >
                Extend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;