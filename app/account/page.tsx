"use client"

import React from 'react';
import { ArrowLeft, Edit, Heart, Plane, Ticket, Store, CreditCard, Building, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const quickAccessItems = [
    {
      title: 'Wishlist',
      icon: Heart,
      bgColor: 'bg-purple-400',
      href: '/wishlist'
    },
    {
      title: 'Orders',
      icon: Plane,
      bgColor: 'bg-purple-600',
      href: '/orders'
    },
    {
      title: 'Coupons',
      icon: Ticket,
      bgColor: 'bg-orange-400',
      href: '/coupons'
    },
    {
      title: 'Sellers',
      icon: Store,
      bgColor: 'bg-green-500',
      href: '/sellers'
    },
    {
      title: 'Cards',
      icon: CreditCard,
      bgColor: 'bg-red-500',
      href: '/cards'
    },
    {
      title: 'Addresses',
      icon: Building,
      bgColor: 'bg-yellow-400',
      href: '/addresses'
    }
  ];

  const settingsItems = [
    {
      title: 'Notification settings',
      href: '/account/notifications'
    },
    {
      title: 'Language & Region',
      href: '/account/language-region'
    },
    {
      title: 'Password & Security',
      href: '/account/security'
    },
    {
      title: 'Privacy policy',
      href: '/privacy-policy'
    },
    {
      title: 'Legal information',
      href: '/legal'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold text-black">Account</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* User Profile Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              {user?.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt="Profile" 
                  width={64} 
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black">
                {user?.name || 'Frank Ubara'}
              </h2>
              <p className="text-gray-600 text-sm">
                {user?.email || 'frankubi2023@gmail.com'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 rounded-full bg-orange-400 hover:bg-orange-500"
          >
            <Edit className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4">
          {quickAccessItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className={`${item.bgColor} p-4 h-24 border-0 cursor-pointer hover:opacity-90 transition-opacity`}>
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <item.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-center">{item.title}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="px-6 space-y-1">
        {settingsItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-black font-medium">{item.title}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        ))}
        
        {/* Delete Account */}
        <Link href="/account/delete">
          <div className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors">
            <span className="text-red-600 font-medium">Delete account</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="px-6 py-8">
        <Button 
          variant="outline" 
          className="w-full max-w-sm mx-auto block border-orange-400 text-orange-400 hover:bg-orange-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default AccountPage; 