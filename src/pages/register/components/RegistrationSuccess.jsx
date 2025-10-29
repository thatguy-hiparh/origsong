import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationSuccess = ({ email, onResendEmail, onContinue }) => {
  const verificationSteps = [
    {
      step: 1,
      title: 'Check Your Email',
      description: `We've sent a verification link to ${email}`,
      icon: 'Mail',status: 'active'
    },
    {
      step: 2,
      title: 'Click Verification Link',description: 'Click the link in your email to verify your account',icon: 'MousePointer',status: 'pending'
    },
    {
      step: 3,
      title: 'Start Researching',description: 'Access your research dashboard and begin analysis',icon: 'Search',status: 'pending'
    }
  ];

  const emailProviders = [
    { name: 'Gmail', url: 'https://gmail.com', icon: 'Mail' },
    { name: 'Outlook', url: 'https://outlook.com', icon: 'Mail' },
    { name: 'Yahoo', url: 'https://mail.yahoo.com', icon: 'Mail' }
  ];

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Account Created Successfully!
        </h2>
        <p className="text-text-secondary">
          Welcome to Orisong! Please verify your email to complete registration.
        </p>
      </div>

      {/* Verification Steps */}
      <div className="bg-surface-secondary rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Next Steps</h3>
        <div className="space-y-4">
          {verificationSteps.map((step) => (
            <div key={step.step} className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'active' ? 'bg-primary text-white' :
                step.status === 'completed'? 'bg-success text-white' : 'bg-surface-tertiary text-text-muted'
              }`}>
                {step.status === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{step.step}</span>
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-sm font-medium text-text-primary">{step.title}</h4>
                <p className="text-xs text-text-secondary mt-1">{step.description}</p>
              </div>
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon 
                  name={step.icon} 
                  size={16} 
                  className={step.status === 'active' ? 'text-primary' : 'text-text-muted'} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Actions */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-text-secondary mb-3">
            Check your email inbox and spam folder
          </p>
          <div className="flex justify-center space-x-2">
            {emailProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                size="sm"
                onClick={() => window.open(provider.url, '_blank')}
                iconName={provider.icon}
                iconPosition="left"
              >
                {provider.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="ghost"
            onClick={onResendEmail}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Resend Email
          </Button>
          <Button
            variant="primary"
            onClick={onContinue}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>

      {/* Help Section */}
      <div className="p-4 bg-surface-secondary rounded-lg">
        <h4 className="text-sm font-medium text-text-primary mb-2">
          Need Help?
        </h4>
        <p className="text-xs text-text-secondary mb-3">
          If you don't receive the verification email within 5 minutes, please check your spam folder or contact support.
        </p>
        <div className="flex justify-center space-x-4 text-xs">
          <button className="text-accent hover:text-accent-400 transition-colors duration-200">
            Contact Support
          </button>
          <span className="text-text-muted">•</span>
          <button className="text-accent hover:text-accent-400 transition-colors duration-200">
            FAQ
          </button>
        </div>
      </div>

      {/* Account Benefits Preview */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
          <Icon name="Star" size={14} className="mr-2 text-primary" />
          What's Next?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={12} className="text-primary" />
            <span className="text-text-secondary">Access 15+ music databases</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={12} className="text-primary" />
            <span className="text-text-secondary">AI-powered analysis tools</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={12} className="text-primary" />
            <span className="text-text-secondary">Collaborate with researchers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={12} className="text-primary" />
            <span className="text-text-secondary">Export detailed reports</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;