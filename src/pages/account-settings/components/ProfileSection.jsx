import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const ProfileSection = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    institution: user?.institution || '',
    title: user?.title || '',
    bio: user?.bio || '',
    website: user?.website || '',
    phone: user?.phone || ''
  });
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'Image size must be less than 5MB'
      }));
      return;
    }

    setIsUploading(true);
    try {
      // Simulate image upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        image: 'Failed to upload image. Please try again.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.website && !/^https?:\/\/.+/.test(profileData.website)) {
      newErrors.website = 'Please enter a valid URL (including http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedUser = {
        ...user,
        ...profileData,
        avatar: profileImage
      };
      
      onUpdateProfile(updatedUser);
      setIsEditing(false);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'Failed to save profile. Please try again.'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      institution: user?.institution || '',
      title: user?.title || '',
      bio: user?.bio || '',
      website: user?.website || '',
      phone: user?.phone || ''
    });
    setProfileImage(user?.avatar || null);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-secondary border-2 border-border">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="User" size={32} className="text-text-muted" />
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="absolute -bottom-2 -right-2">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                  disabled={isUploading}
                />
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200">
                  {isUploading ? (
                    <Icon name="Loader2" size={16} color="white" className="animate-spin" />
                  ) : (
                    <Icon name="Camera" size={16} color="white" />
                  )}
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">
                {profileData.name || 'Music Researcher'}
              </h3>
              <p className="text-text-secondary">
                {profileData.title || 'Professional Researcher'}
              </p>
              {profileData.institution && (
                <p className="text-sm text-text-muted">
                  {profileData.institution}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="status-badge verified">
                <Icon name="Shield" size={12} className="mr-1" />
                Verified
              </div>
              {user?.plan && (
                <div className="status-badge pending">
                  <Icon name="Crown" size={12} className="mr-1" />
                  {user.plan}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {errors.image && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-md">
          <p className="text-sm text-error">{errors.image}</p>
        </div>
      )}

      {errors.general && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-md">
          <p className="text-sm text-error">{errors.general}</p>
        </div>
      )}

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Full Name *
          </label>
          <Input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            disabled={!isEditing}
            className={errors.name ? 'border-error' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            disabled={!isEditing}
            className={errors.email ? 'border-error' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Institution/Organization
          </label>
          <Input
            type="text"
            value={profileData.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            placeholder="University, Record Label, etc."
            disabled={!isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Professional Title
          </label>
          <Input
            type="text"
            value={profileData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Musicologist, A&R, etc."
            disabled={!isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Website
          </label>
          <Input
            type="url"
            value={profileData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://your-website.com"
            disabled={!isEditing}
            className={errors.website ? 'border-error' : ''}
          />
          {errors.website && (
            <p className="mt-1 text-sm text-error">{errors.website}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Phone Number
          </label>
          <Input
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Professional Bio
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about your research focus and expertise..."
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isSaving}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;