import React from 'react';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import LoginFooter from './components/LoginFooter';

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-xl shadow-xl border border-border p-8 animate-fade-in">
          <LoginHeader />
          <LoginForm />
          <SecurityBadges />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
};

export default Login;