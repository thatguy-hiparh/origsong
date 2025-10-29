import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const AuthenticationWrapper = ({ children, requireAuth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [authErrors, setAuthErrors] = useState({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.includes(location.pathname);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthPage) {
      setAuthMode(location.pathname === '/register' ? 'register' : 'login');
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [location.pathname, isAuthPage]);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthErrors({});

    try {
      // Validate form data
      const errors = validateAuthData();
      if (Object.keys(errors).length > 0) {
        setAuthErrors(errors);
        setIsAuthenticating(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (authMode === 'register') {
        // Simulate registration
        const newUser = {
          id: Date.now(),
          name: authData.name,
          email: authData.email,
          role: 'Professional',
          plan: 'Professional',
          avatar: null,
          createdAt: new Date().toISOString()
        };

        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      } else {
        // Simulate login
        const mockUser = {
          id: 1,
          name: authData.name || 'Research Professional',
          email: authData.email,
          role: 'Professional',
          plan: 'Professional',
          avatar: null,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
      }

      // Redirect to dashboard or intended page
      const redirectTo = new URLSearchParams(location.search).get('redirect') || '/research-dashboard';
      navigate(redirectTo);
      setShowAuthModal(false);
      resetAuthForm();

    } catch (error) {
      setAuthErrors({ 
        general: 'Authentication failed. Please try again.' 
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const validateAuthData = () => {
    const errors = {};

    if (!authData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!authData.password) {
      errors.password = 'Password is required';
    } else if (authData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'register') {
      if (!authData.name) {
        errors.name = 'Name is required';
      }

      if (!authData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (authData.password !== authData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    return errors;
  };

  const handleInputChange = (field, value) => {
    setAuthData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field error when user starts typing
    if (authErrors[field]) {
      setAuthErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const resetAuthForm = () => {
    setAuthData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setAuthErrors({});
  };

  const handleAuthModeSwitch = (mode) => {
    setAuthMode(mode);
    resetAuthForm();
    navigate(mode === 'register' ? '/register' : '/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
    setUser(null);
    navigate('/login');
  };

  const handleCloseAuth = () => {
    if (!requireAuth) {
      navigate('/research-dashboard');
      setShowAuthModal(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-modal">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center animate-pulse">
            <Icon name="Music" size={24} color="white" />
          </div>
          <div className="text-text-secondary">Loading Orisong...</div>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    return (
      <AuthModal 
        isOpen={true}
        authMode={authMode}
        authData={authData}
        authErrors={authErrors}
        isAuthenticating={isAuthenticating}
        onSubmit={handleAuthSubmit}
        onInputChange={handleInputChange}
        onModeSwitch={handleAuthModeSwitch}
        onClose={() => {}} // Cannot close when auth is required
        canClose={false}
      />
    );
  }

  // Render auth modal for auth pages
  if (showAuthModal && isAuthPage) {
    return (
      <AuthModal 
        isOpen={showAuthModal}
        authMode={authMode}
        authData={authData}
        authErrors={authErrors}
        isAuthenticating={isAuthenticating}
        onSubmit={handleAuthSubmit}
        onInputChange={handleInputChange}
        onModeSwitch={handleAuthModeSwitch}
        onClose={handleCloseAuth}
        canClose={!requireAuth}
      />
    );
  }

  // Render children with user context
  return React.cloneElement(children, { user, onLogout: handleLogout });
};

const AuthModal = ({ 
  isOpen, 
  authMode, 
  authData, 
  authErrors, 
  isAuthenticating,
  onSubmit, 
  onInputChange, 
  onModeSwitch, 
  onClose,
  canClose 
}) => {
  if (!isOpen) return null;

  const isLogin = authMode === 'login';

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-modal p-4">
      <div className="w-full max-w-md bg-surface rounded-lg shadow-xl border border-border animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="Music" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {isLogin ? 'Welcome Back' : 'Join Orisong'}
              </h2>
              <p className="text-sm text-text-secondary">
                {isLogin ? 'Sign in to your research account' : 'Create your research account'}
              </p>
            </div>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
            >
              <Icon name="X" size={20} className="text-text-secondary" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {authErrors.general && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md">
              <p className="text-sm text-error">{authErrors.general}</p>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={authData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className={authErrors.name ? 'border-error' : ''}
                disabled={isAuthenticating}
              />
              {authErrors.name && (
                <p className="mt-1 text-sm text-error">{authErrors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={authData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className={authErrors.email ? 'border-error' : ''}
              disabled={isAuthenticating}
            />
            {authErrors.email && (
              <p className="mt-1 text-sm text-error">{authErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={authData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              className={authErrors.password ? 'border-error' : ''}
              disabled={isAuthenticating}
            />
            {authErrors.password && (
              <p className="mt-1 text-sm text-error">{authErrors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={authData.confirmPassword}
                onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                className={authErrors.confirmPassword ? 'border-error' : ''}
                disabled={isAuthenticating}
              />
              {authErrors.confirmPassword && (
                <p className="mt-1 text-sm text-error">{authErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isAuthenticating}
            loading={isAuthenticating}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => onModeSwitch(isLogin ? 'register' : 'login')}
              className="ml-1 text-accent hover:text-accent-400 transition-colors duration-200 font-medium"
              disabled={isAuthenticating}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationWrapper;