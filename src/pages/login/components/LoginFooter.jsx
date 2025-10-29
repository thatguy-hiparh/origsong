import React from 'react';
import { Link } from 'react-router-dom';

const LoginFooter = () => {
  return (
    <div className="mt-8 text-center space-y-4">
      <p className="text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="text-accent hover:text-accent-400 transition-colors duration-200 font-medium"
        >
          Create Account
        </Link>
      </p>
      
      <div className="flex justify-center space-x-6 text-xs text-text-tertiary">
        <Link 
          to="/terms" 
          className="hover:text-text-secondary transition-colors duration-200"
        >
          Terms of Service
        </Link>
        <Link 
          to="/privacy" 
          className="hover:text-text-secondary transition-colors duration-200"
        >
          Privacy Policy
        </Link>
        <Link 
          to="/support" 
          className="hover:text-text-secondary transition-colors duration-200"
        >
          Support
        </Link>
      </div>
    </div>
  );
};

export default LoginFooter;