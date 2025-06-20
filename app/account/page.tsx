"use client"

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Heart, Plane, Ticket, Store, CreditCard, Building, ChevronRight, LogOut, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';

const AccountPage = () => {
  const { user, logout, isLoading } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const quickAccessItems = [
    {
      title: 'Wishlist',
      icon: Heart,
      href: '/account/wishlist'
    },
    {
      title: 'Orders',
      icon: Plane,
      href: '/account/orders'
    },
    {
      title: 'Coupons',
      icon: Ticket,
      href: '/account/coupons',
      disabled: true
    },
    {
      title: 'Sellers',
      icon: Store,
      href: '/account/sellers'
    },
    {
      title: 'Cards',
      icon: CreditCard,
      href: '/account/payment-methods'
    },
    {
      title: 'Addresses',
      icon: Building,
      href: '/account/shipping-addresses'
    }
  ];

  const staticItems = [
    {
      title: 'Privacy policy',
      href: '/account/privacy-policy'
    },
    {
      title: 'Legal information',
      href: '/account/legal'
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    if (isUpdatingPassword) return;
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Here you would make the API call to change password
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password updated successfully!');
      setIsChangePasswordOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    if (isUpdatingPassword) return;
    setIsChangePasswordOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.history.back()}
          className="p-2 flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">Account</h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* User Profile Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black">
                {user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-gray-600 text-sm">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 rounded-full bg-orange-400 hover:bg-orange-500"
            asChild
          >
            <Link href="/account/edit">
              <Edit className="w-4 h-4 text-white" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4">
          {quickAccessItems.map((item) => (
            item.disabled ? (
              <Card 
                key={item.title} 
                className="p-4 h-24 border cursor-pointer hover:bg-gray-50 transition-colors opacity-60"
                onClick={() => toast.info('Coming soon!')}
              >
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <item.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-center">{item.title}</span>
                </div>
              </Card>
            ) : (
              <Link key={item.title} href={item.href}>
                <Card className="p-4 h-24 border cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center h-full text-gray-600">
                    <item.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium text-center">{item.title}</span>
                  </div>
                </Card>
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="px-6 space-y-1">
        {/* Accordion Sections */}
        <Accordion type="single" collapsible className="w-full">
          {/* Notification Settings */}
          <AccordionItem value="notification-settings" className="border-b border-gray-100">
            <AccordionTrigger className="py-4 text-black font-medium hover:no-underline">
              Notification settings
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Order notification</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#FF715B]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Promotions</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#FF715B]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Messages</span>
                  <Switch className="data-[state=checked]:bg-[#FF715B]" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Language & Region */}
          <AccordionItem value="language-region" className="border-b border-gray-100">
            <AccordionTrigger className="py-4 text-black font-medium hover:no-underline">
              Language & Region
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Shipping to</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Nigeria</span>
                    <Image 
                      src="https://flagcdn.com/ng.svg" 
                      alt="Nigeria" 
                      width={20} 
                      height={20} 
                      className="w-5 h-5 rounded-sm object-cover flex-shrink-0" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Currency</span>
                  <span className="text-sm">NGN (₦)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Language</span>
                  <span className="text-sm">English</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Password & Security */}
          <AccordionItem value="password-security" className="border-b border-gray-100">
            <AccordionTrigger className="py-4 text-black font-medium hover:no-underline">
              Password & Security
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Change password</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-orange-500 hover:text-orange-600 p-0 h-auto font-normal"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable two-factor authentication</span>
                  <Switch className="data-[state=checked]:bg-[#FF715B]" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {staticItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-black font-medium">{item.title}</span>
            </div>
          </Link>
        ))}
        
        {/* Delete Account */}
        <Link href="/account/delete">
          <div className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors">
            <span className="text-red-600 font-medium">Delete account</span>
          </div>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="px-6 py-8">
        <Button 
          variant="outline" 
          className="w-full max-w-sm mx-auto block border-red-500 text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>

      {/* Change Password Drawer */}
      <Drawer open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DrawerContent>
          <DrawerHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DrawerTitle className="text-xl font-semibold">Change password</DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                disabled={isUpdatingPassword}
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="px-4 pb-6 space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                Current password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                  className="pr-10"
                  disabled={isUpdatingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                  disabled={isUpdatingPassword}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                New password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                  className="pr-10"
                  disabled={isUpdatingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('new')}
                  disabled={isUpdatingPassword}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                  className="pr-10"
                  disabled={isUpdatingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                  disabled={isUpdatingPassword}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-[#FF715B] text-[#FF715B] hover:bg-red-50"
                onClick={handleCancelPasswordChange}
                disabled={isUpdatingPassword}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-[#FF715B] text-white hover:bg-[#ff4d2d] disabled:opacity-50"
                onClick={handleChangePassword}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? 'Updating...' : 'Update password'}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AccountPage; 