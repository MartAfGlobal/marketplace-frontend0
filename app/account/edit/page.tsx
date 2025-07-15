"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, Smartphone, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { apiService } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

const EditProfilePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phoneNumber: '',
    mobileNumber: ''
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(null);

  // Fetch current user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://marketplace-backend-hm4q.onrender.com'}/accounts/UserDetails/`, {
          method: 'GET',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Populate form with existing data from UserDetails response
          setFormData({
            firstName: userData.profile?.first_name || '',
            surname: userData.profile?.last_name || '',
            email: userData.email || '',
            phoneNumber: userData.profile?.phone || '',
            mobileNumber: userData.profile?.phone2 || ''
          });

          // Set current profile image if exists
          if (userData.profile?.profile_picture) {
            setCurrentProfileImage(userData.profile?.profile_picture);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        // Initialize with user email if available
        setFormData(prev => ({
          ...prev,
          email: user?.email || ''
        }));
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    } else {
      setIsInitialLoading(false);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    if (isLoading) return; // Prevent changes during loading
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return; // Prevent changes during loading
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      toast.success('Image selected successfully');
    }
    
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Prepare form data for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add email field (user level field)
      formDataToSend.append('email', formData.email);
    
      
      // Add profile picture if selected
      if (profileImage) {
        formDataToSend.append('profile_picture', profileImage);
      }
      
      // Add contact details as JSON object according to UserDetails API
      // const contactDetails = {
      //   first_name: formData.firstName,
      //   last_name: formData.surname,
      //   phone: formData.phoneNumber,
      //   phone2: formData.mobileNumber
      // };
      
      // formDataToSend.append('contact_details', JSON.stringify(contactDetails));

        // Add all fields
      formDataToSend.append('email', formData.email);
      formDataToSend.append('first_name', formData.firstName);
      formDataToSend.append('last_name', formData.surname);
      formDataToSend.append('phone', formData.phoneNumber);
      formDataToSend.append('phone2', formData.mobileNumber);

      // Make API call to UserDetails endpoint
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://marketplace-backend-hm4q.onrender.com'}/accounts/UserDetails/`, {
        method: 'PATCH',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formDataToSend,
      });


      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      const result = await response.json();
      
      toast.success('Profile updated successfully!');
      //window.location.href = '/account';
      
    } catch (error) {
      console.error('Profile update error:', error);
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return; // Prevent navigation during loading
    window.history.back();
  };

  // Show loading spinner while fetching initial data
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <Link href="/account">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 flex-shrink-0"
            disabled={isLoading}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">Edit profile</h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* Profile Photo Section */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {profileImage ? (
              <img 
                src={URL.createObjectURL(profileImage)} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : currentProfileImage ? (
              <img 
                src={currentProfileImage} 
                alt="Current profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                {formData.firstName?.[0]?.toUpperCase() || formData.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
              disabled={isLoading}
            />
            <label 
              htmlFor="profile-upload" 
              className={`text-[#FF715B] font-medium text-lg cursor-pointer hover:text-[#ff4d2d] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Upload photo
            </label>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="px-6 space-y-4">
        {/* First Name */}
        <div>
          <Label htmlFor="firstName" className="text-gray-600 text-sm mb-2 block">
            First name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="pl-10 h-12 text-base"
              placeholder="Enter first name"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Surname */}
        <div>
          <Label htmlFor="surname" className="text-gray-600 text-sm mb-2 block">
            Surname
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              className="pl-10 h-12 text-base"
              placeholder="Enter surname"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <Label htmlFor="email" className="text-gray-600 text-sm mb-2 block">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 h-12 text-base"
              placeholder="Enter email address"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" className="text-gray-600 text-sm mb-2 block">
            Phone number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="pl-10 h-12 text-base"
              placeholder="Enter phone number"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <Label htmlFor="mobileNumber" className="text-gray-600 text-sm mb-2 block">
            Mobile number
          </Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              className="pl-10 h-12 text-base"
              placeholder="Enter mobile number"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-8 flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1 h-12 border-[#FF715B] text-[#FF715B] hover:bg-red-50"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 h-12 bg-[#FF715B] text-white hover:bg-[#ff4d2d] disabled:opacity-50"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
};

export default EditProfilePage; 