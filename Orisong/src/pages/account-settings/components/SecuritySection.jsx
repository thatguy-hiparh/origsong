import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySection = ({ user, onUpdateSecurity }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false,
      ip: '192.168.1.101'
    },
    {
      id: 3,
      device: 'Windows PC',
      browser: 'Edge 120.0',
      location: 'Boston, MA',
      lastActive: '3 days ago',
      current: false,
      ip: '10.0.0.50'
    }
  ]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [qrCode, setQrCode] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsChangingPassword(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate password change
      onUpdateSecurity({ passwordChanged: true });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordErrors({
        general: 'Failed to change password. Please try again.'
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate QR code generation
      setQrCode('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K');
      
      // Generate backup codes
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + 
        Math.random().toString(36).substr(2, 4).toUpperCase()
      );
      setBackupCodes(codes);
      setShow2FASetup(true);
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
      onUpdateSecurity({ twoFactorEnabled: true });
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
    }
  };

  const handleDisable2FA = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(false);
      onUpdateSecurity({ twoFactorEnabled: false });
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveSessions(prev => prev.filter(session => session.current));
    } catch (error) {
      console.error('Failed to terminate sessions:', error);
    }
  };

  const getDeviceIcon = (device) => {
    if (device.includes('iPhone') || device.includes('iPad')) return 'Smartphone';
    if (device.includes('Mac')) return 'Laptop';
    if (device.includes('Windows')) return 'Monitor';
    return 'Globe';
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Lock" size={20} className="mr-2" />
          Change Password
        </h3>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordErrors.general && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md">
              <p className="text-sm text-error">{passwordErrors.general}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Current Password
            </label>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Enter your current password"
              className={passwordErrors.currentPassword ? 'border-error' : ''}
              disabled={isChangingPassword}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-error">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Enter your new password"
              className={passwordErrors.newPassword ? 'border-error' : ''}
              disabled={isChangingPassword}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-error">{passwordErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Confirm your new password"
              className={passwordErrors.confirmPassword ? 'border-error' : ''}
              disabled={isChangingPassword}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-error">{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={isChangingPassword}
            disabled={isChangingPassword}
          >
            Change Password
          </Button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Two-Factor Authentication
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Two-Factor Authentication {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </p>
            <p className="text-xs text-text-secondary">
              {twoFactorEnabled 
                ? 'Your account is protected with 2FA' :'Add an extra layer of security to your account'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {twoFactorEnabled ? (
              <div className="status-badge verified">
                <Icon name="CheckCircle" size={12} className="mr-1" />
                Active
              </div>
            ) : (
              <div className="status-badge pending">
                <Icon name="Clock" size={12} className="mr-1" />
                Inactive
              </div>
            )}
            <Button
              variant={twoFactorEnabled ? "danger" : "primary"}
              size="sm"
              onClick={twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
              loading={isEnabling2FA}
              disabled={isEnabling2FA}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-modal p-4">
            <div className="w-full max-w-md bg-surface rounded-lg shadow-xl border border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-text-primary">Setup Two-Factor Authentication</h4>
                  <button
                    onClick={() => setShow2FASetup(false)}
                    className="p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
                  >
                    <Icon name="X" size={20} className="text-text-secondary" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg p-4 mb-4">
                      {qrCode && (
                        <img src={qrCode} alt="QR Code" className="w-full h-full" />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">
                      Scan this QR code with your authenticator app
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Verification Code
                    </label>
                    <Input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-text-primary">Backup Codes</h5>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-surface-secondary rounded-md">
                      {backupCodes.map((code, index) => (
                        <code key={index} className="text-xs font-mono text-text-primary">
                          {code}
                        </code>
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary">
                      Save these backup codes in a secure location
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleVerify2FA}
                    disabled={verificationCode.length !== 6}
                    className="w-full"
                  >
                    Verify and Enable
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Monitor" size={20} className="mr-2" />
            Active Sessions
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTerminateAllSessions}
            iconName="LogOut"
            iconPosition="left"
          >
            Terminate All Others
          </Button>
        </div>
        
        <div className="space-y-3">
          {activeSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-surface-tertiary rounded-lg flex items-center justify-center">
                  <Icon name={getDeviceIcon(session.device)} size={20} className="text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {session.device} • {session.browser}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {session.location} • {session.ip} • {session.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {session.current ? (
                  <div className="status-badge verified">
                    <Icon name="Zap" size={10} className="mr-1" />
                    Current
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                    iconName="X"
                  >
                    Terminate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Deletion */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-error flex items-center">
          <Icon name="Trash2" size={20} className="mr-2" />
          Danger Zone
        </h3>
        
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-error mb-1">Delete Account</h4>
              <p className="text-sm text-text-secondary">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Handle account deletion
                  console.log('Account deletion requested');
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;