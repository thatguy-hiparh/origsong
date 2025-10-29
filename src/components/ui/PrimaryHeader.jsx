import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PrimaryHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/research-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Access your research dashboard and initiate new song analysis'
    },
    {
      label: 'Research',
      path: '/song-research-results',
      icon: 'Search',
      tooltip: 'View detailed research results and analysis data'
    },
    {
      label: 'Compare',
      path: '/lyric-comparison',
      icon: 'GitCompare',
      tooltip: 'Compare lyrics and analyze similarities between songs'
    }
  ];

  useEffect(() => {
    // Simulate user authentication check
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/research-dashboard')}>
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
        <Icon name="Music" size={20} color="white" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-semibold text-text-primary font-heading">
        Orisong
      </span>
    </div>
  );

  const NavigationMenu = ({ isMobile = false }) => (
    <nav className={`${isMobile ? 'flex flex-col space-y-1' : 'hidden md:flex md:items-center md:space-x-1'}`}>
      {navigationItems.map((item) => (
        <div key={item.path} className="relative group">
          <button
            onClick={() => handleNavigation(item.path)}
            className={`nav-link ${isActivePath(item.path) ? 'active' : ''} ${
              isMobile ? 'w-full justify-start' : ''
            }`}
            title={item.tooltip}
          >
            <Icon name={item.icon} size={18} className="mr-2" />
            {item.label}
          </button>
          {!isMobile && (
            <div className="contextual-tooltip group-hover:show -bottom-8 left-1/2 transform -translate-x-1/2">
              {item.tooltip}
            </div>
          )}
        </div>
      ))}
    </nav>
  );

  const UserMenu = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="User" size={16} color="white" />
        </div>
        <span className="hidden md:block text-sm font-medium text-text-primary">
          {user?.name || 'Researcher'}
        </span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-secondary transition-transform duration-200 ${
            isUserMenuOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isUserMenuOpen && (
        <div className="dropdown-menu animate-scale-in">
          <button
            onClick={() => {
              handleNavigation('/account-settings');
              setIsUserMenuOpen(false);
            }}
            className="dropdown-item w-full text-left flex items-center"
          >
            <Icon name="Settings" size={16} className="mr-2" />
            Account Settings
          </button>
          <div className="border-t border-border my-1"></div>
          <button
            onClick={handleLogout}
            className="dropdown-item w-full text-left flex items-center text-error hover:text-error"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
    >
      <Icon 
        name={isMobileMenuOpen ? "X" : "Menu"} 
        size={24} 
        className="text-text-primary" 
      />
    </button>
  );

  return (
    <>
      <header className="header">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-8">
              <Logo />
              <NavigationMenu />
            </div>

            <div className="flex items-center space-x-4">
              {user ? <UserMenu /> : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                </div>
              )}
              <MobileMenuButton />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          <div 
            className="mobile-menu-panel animate-slide-in-left"
            ref={mobileMenuRef}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
              >
                <Icon name="X" size={24} className="text-text-primary" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <NavigationMenu isMobile={true} />
              
              {!user && (
                <div className="pt-4 border-t border-border space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/login')}
                    className="w-full justify-start"
                  >
                    <Icon name="LogIn" size={18} className="mr-2" />
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleNavigation('/register')}
                    className="w-full justify-start"
                  >
                    <Icon name="UserPlus" size={18} className="mr-2" />
                    Get Started
                  </Button>
                </div>
              )}

              {user && (
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {user?.name || 'Researcher'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {user?.email || 'researcher@orisong.com'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/account-settings')}
                    className="w-full justify-start"
                  >
                    <Icon name="Settings" size={18} className="mr-2" />
                    Account Settings
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-error hover:text-error"
                  >
                    <Icon name="LogOut" size={18} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrimaryHeader;