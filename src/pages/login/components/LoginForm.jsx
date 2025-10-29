import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful login
      const mockUser = {
        id: 1,
        name: 'Research Professional',
        email: formData.email,
        role: 'Professional',
        plan: 'Professional',
        avatar: null,
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect to dashboard
      navigate('/research-dashboard');

    } catch (error) {
      setErrors({ 
        general: 'Authentication failed. Please check your credentials and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={18} className="text-error" />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        </div>
      )}

      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`${errors?.email ? 'border-error focus-visible:ring-error' : ''}`}
          disabled={isSubmitting}
          autoComplete="email"
        />
        {errors?.email && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData?.password || ''}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={`${errors?.password ? 'border-error focus-visible:ring-error' : ''}`}
          disabled={isSubmitting}
          autoComplete="current-password"
        />
        {errors?.password && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <Input
            type="checkbox"
            checked={formData?.rememberMe || false}
            onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            disabled={isSubmitting}
          />
          <span className="text-sm text-text-secondary">Remember me</span>
        </label>
        
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-sm text-accent hover:text-accent-400 transition-colors duration-200"
          disabled={isSubmitting}
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={isSubmitting}
        loading={isSubmitting}
        className="font-medium"
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;