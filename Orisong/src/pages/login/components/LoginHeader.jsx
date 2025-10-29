import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="Music" size={32} color="white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Welcome Back
      </h1>
      
      <p className="text-text-secondary max-w-sm mx-auto">
        Sign in to your research account to access your saved data and continue your music analysis workflows.
      </p>
    </div>
  );
};

export default LoginHeader;