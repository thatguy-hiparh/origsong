import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RegistrationForm from './components/RegistrationForm';
import InstitutionalBadges from './components/InstitutionalBadges';
import RegistrationSuccess from './components/RegistrationSuccess';

const Register = () => {
  const navigate = useNavigate();
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form' | 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = (formData) => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  const handleRegistration = async (formData) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if email already exists (mock validation)
      const existingEmails = ['test@example.com', 'admin@orisong.com'];
      if (existingEmails.includes(formData.email.toLowerCase())) {
        setErrors({ email: 'An account with this email already exists' });
        setIsLoading(false);
        return;
      }

      // Simulate successful registration
      const userData = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        institutionalAffiliation: formData.institutionalAffiliation,
        researchFocus: formData.researchFocus,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        status: 'pending_verification'
      };

      // Store user data temporarily (in real app, this would be handled by backend)
      localStorage.setItem('pendingUser', JSON.stringify(userData));
      setRegisteredEmail(formData.email);
      setRegistrationStep('success');

    } catch (error) {
      setErrors({ 
        general: 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Simulate resend email API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message (in real app, show toast notification)
      console.log('Verification email resent');
    } catch (error) {
      console.error('Failed to resend email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    // In real app, this would check email verification status
    // For demo purposes, we'll simulate verified user
    const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
    const verifiedUser = {
      ...pendingUser,
      emailVerified: true,
      status: 'active'
    };
    
    localStorage.setItem('user', JSON.stringify(verifiedUser));
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.removeItem('pendingUser');
    
    navigate('/research-dashboard');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (registrationStep === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-surface rounded-lg shadow-xl border border-border p-8">
            <RegistrationSuccess
              email={registeredEmail}
              onResendEmail={handleResendEmail}
              onContinue={handleContinueToDashboard}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Registration Form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Icon name="Music" size={24} color="white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Join Orisong
              </h1>
              <p className="text-text-secondary">
                Create your research account and start analyzing song originality
              </p>
            </div>

            {/* Registration Form Card */}
            <div className="bg-surface rounded-lg shadow-xl border border-border p-8">
              {errors.general && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md">
                  <div className="flex items-center">
                    <Icon name="AlertTriangle" size={16} className="text-error mr-2" />
                    <p className="text-sm text-error">{errors.general}</p>
                  </div>
                </div>
              )}

              <RegistrationForm
                onSubmit={handleRegistration}
                isLoading={isLoading}
                errors={errors}
              />

              {/* Login Redirect */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-text-secondary">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    onClick={handleLoginRedirect}
                    className="p-0 h-auto text-accent hover:text-accent-400"
                  >
                    Sign in here
                  </Button>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-text-muted">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-accent hover:text-accent-400 transition-colors duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-accent hover:text-accent-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar with Institutional Badges */}
        <div className="hidden lg:block w-80 bg-surface-secondary border-l border-border p-8">
          <div className="sticky top-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Trusted by Professionals
              </h2>
              <p className="text-text-secondary text-sm">
                Join thousands of music researchers, industry professionals, and academics who trust Orisong for their song originality research.
              </p>
            </div>

            <InstitutionalBadges />

            {/* Contact Support */}
            <div className="mt-8 p-4 bg-surface rounded-lg border border-border">
              <h3 className="text-sm font-medium text-text-primary mb-2 flex items-center">
                <Icon name="HelpCircle" size={14} className="mr-2 text-accent" />
                Need Help?
              </h3>
              <p className="text-xs text-text-secondary mb-3">
                Our support team is here to help you get started with your research.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                iconName="MessageCircle"
                iconPosition="left"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;