import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RegistrationForm = ({ onSubmit, isLoading, errors }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institutionalAffiliation: '',
    researchFocus: [],
    acceptTerms: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const institutionalOptions = [
    { value: '', label: 'Select Institutional Affiliation' },
    { value: 'university', label: 'University/Academic Institution' },
    { value: 'record-label', label: 'Record Label' },
    { value: 'publishing', label: 'Music Publishing Company' },
    { value: 'legal', label: 'Legal Firm' },
    { value: 'journalism', label: 'Media/Journalism' },
    { value: 'streaming', label: 'Streaming Platform' },
    { value: 'independent', label: 'Independent Researcher' },
    { value: 'other', label: 'Other' }
  ];

  const researchFocusOptions = [
    { id: 'academic', label: 'Academic Research', description: 'Musicology and scholarly analysis' },
    { id: 'copyright', label: 'Copyright Verification', description: 'Rights and ownership validation' },
    { id: 'licensing', label: 'Licensing & Royalties', description: 'Commercial usage and payments' },
    { id: 'journalism', label: 'Music Journalism', description: 'Editorial and fact-checking' }
  ];

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length === 0) {
      return { score: 0, feedback: '' };
    }

    if (password.length < 6) {
      feedback = 'Too short';
    } else if (password.length < 8) {
      score = 1;
      feedback = 'Weak';
    } else {
      score = 2;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      if (score === 2) feedback = 'Fair';
      else if (score === 3) feedback = 'Good';
      else if (score >= 4) feedback = 'Strong';
    }

    return { score: Math.min(score, 4), feedback };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleResearchFocusChange = (focusId) => {
    setFormData(prev => ({
      ...prev,
      researchFocus: prev.researchFocus.includes(focusId)
        ? prev.researchFocus.filter(id => id !== focusId)
        : [...prev.researchFocus, focusId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 1: return 'bg-error';
      case 2: return 'bg-warning';
      case 3: return 'bg-accent';
      case 4: return 'bg-success';
      default: return 'bg-surface-tertiary';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Full Name <span className="text-error">*</span>
        </label>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className={errors.fullName ? 'border-error' : ''}
          disabled={isLoading}
          required
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Email Address <span className="text-error">*</span>
        </label>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={errors.email ? 'border-error' : ''}
          disabled={isLoading}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Password <span className="text-error">*</span>
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={errors.password ? 'border-error pr-10' : 'pr-10'}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Password Strength</span>
              <span className={`text-xs font-medium ${
                passwordStrength.score >= 3 ? 'text-success' : 
                passwordStrength.score >= 2 ? 'text-warning' : 'text-error'
              }`}>
                {passwordStrength.feedback}
              </span>
            </div>
            <div className="w-full bg-surface-tertiary rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password <span className="text-error">*</span>
        </label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={errors.confirmPassword ? 'border-error pr-10' : 'pr-10'}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Institutional Affiliation */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Institutional Affiliation
        </label>
        <select
          value={formData.institutionalAffiliation}
          onChange={(e) => handleInputChange('institutionalAffiliation', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          disabled={isLoading}
        >
          {institutionalOptions.map(option => (
            <option key={option.value} value={option.value} className="bg-surface text-text-primary">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Research Focus Areas */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Research Focus Areas
        </label>
        <div className="space-y-3">
          {researchFocusOptions.map(option => (
            <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
              <div className="relative flex items-center">
                <Input
                  type="checkbox"
                  checked={formData.researchFocus.includes(option.id)}
                  onChange={() => handleResearchFocusChange(option.id)}
                  className="w-4 h-4"
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-text-primary">{option.label}</span>
                <p className="text-xs text-text-secondary mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Terms of Service */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <div className="relative flex items-center mt-1">
            <Input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
              className={`w-4 h-4 ${errors.acceptTerms ? 'border-error' : ''}`}
              disabled={isLoading}
              required
            />
          </div>
          <div className="flex-1">
            <span className="text-sm text-text-primary">
              I agree to the{' '}
              <a href="/terms" className="text-accent hover:text-accent-400 transition-colors duration-200">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-accent hover:text-accent-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-error ml-1">*</span>
            </span>
          </div>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.acceptTerms}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegistrationForm;