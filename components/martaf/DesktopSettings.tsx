import React, { useState } from 'react';

interface NotificationSettings {
  emailNotifications: boolean;
  orderTracking: boolean;
  securityAlerts: boolean;
  promotions: boolean;
  supportUpdates: boolean;
  featureUpdates: boolean;
  pushNotifications: boolean;
  pushOrderTracking: boolean;
  pushSecurityAlerts: boolean;
  pushPromotions: boolean;
  pushSupportUpdates: boolean;
  pushFeatureUpdates: boolean;
}

interface DesktopSettingsProps {
  setIsChangePasswordOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled = false }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
      checked ? 'bg-orange-500' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const DesktopSettings: React.FC<DesktopSettingsProps> = ({ setIsChangePasswordOpen }) => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: false,
    orderTracking: true,
    securityAlerts: true,
    promotions: true,
    supportUpdates: true,
    featureUpdates: false,
    pushNotifications: false,
    pushOrderTracking: false,
    pushSecurityAlerts: true,
    pushPromotions: true,
    pushSupportUpdates: false,
    pushFeatureUpdates: false
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  const toggleNotification = (key: keyof NotificationSettings): void => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleUpdatePassword = (): void => {
    // Handle password update logic
    console.log('Update password clicked');
    setIsChangePasswordOpen(true)
  };

  const handleDeleteAccount = (): void => {
    // Handle account deletion logic
    console.log('Delete account clicked');
  };

  return (
    <div className="hidden md:block mx-auto py-6 bg-white">
      {/* Notifications Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Notifications</h2>
        
        <div className="grid grid-cols-2 gap-12">
          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Email notifications</h3>
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Email notifications</div>
                  <div className="text-sm text-gray-500">Confirmations, shipping, and refunds</div>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onChange={() => toggleNotification('emailNotifications')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Security Alerts</div>
                  <div className="text-sm text-gray-500">Login attempts, password changes, and suspicious activity</div>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onChange={() => toggleNotification('securityAlerts')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Promotions</div>
                  <div className="text-sm text-gray-500">Discounts, new arrivals, and newsletters</div>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onChange={() => toggleNotification('promotions')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Support Updates</div>
                  <div className="text-sm text-gray-500">Responses to inquiries and feedback requests</div>
                </div>
                <Switch
                  checked={notifications.supportUpdates}
                  onChange={() => toggleNotification('supportUpdates')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Feature Updates</div>
                  <div className="text-sm text-gray-500">New features, improvements, and important changes</div>
                </div>
                <Switch
                  checked={notifications.featureUpdates}
                  onChange={() => toggleNotification('featureUpdates')}
                />
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Push notifications</h3>
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Order Tracking</div>
                  <div className="text-sm text-gray-500">Live updates on shipping and delivery</div>
                </div>
                <Switch
                  checked={notifications.pushOrderTracking}
                  onChange={() => toggleNotification('pushOrderTracking')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Security Alerts</div>
                  <div className="text-sm text-gray-500">Login attempts, password changes, and suspicious activity</div>
                </div>
                <Switch
                  checked={notifications.pushSecurityAlerts}
                  onChange={() => toggleNotification('pushSecurityAlerts')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Promotions</div>
                  <div className="text-sm text-gray-500">Discounts, new arrivals, and newsletters</div>
                </div>
                <Switch
                  checked={notifications.pushPromotions}
                  onChange={() => toggleNotification('pushPromotions')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Support Updates</div>
                  <div className="text-sm text-gray-500">Responses to inquiries and feedback requests</div>
                </div>
                <Switch
                  checked={notifications.pushSupportUpdates}
                  onChange={() => toggleNotification('pushSupportUpdates')}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">Feature Updates</div>
                  <div className="text-sm text-gray-500">New features, improvements, and important changes</div>
                </div>
                <Switch
                  checked={notifications.pushFeatureUpdates}
                  onChange={() => toggleNotification('pushFeatureUpdates')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Languages & Regions Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Languages & regions</h2>
        
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white">
                <option value="nigeria">🇳🇬 Nigeria</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white">
                <option value="english">English</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white">
                <option value="ngn">NGN</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 w-[42%]">
          Your country selection determines your language and currency which are updated automatically.
        </p>
      </div>

      {/* Password & Security Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Password & security</h2>
        
        <div className="space-y-8">
          <div>
            <button 
              onClick={handleUpdatePassword}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Update password
            </button>
          </div>

          <div className="flex items-center justify-between w-[50%]">
            <Switch
              checked={twoFactorAuth}
              onChange={() => setTwoFactorAuth(!twoFactorAuth)}
            />
            <div>
              <div className="font-medium text-gray-900">Two-factor authentication</div>
              <div className="text-sm text-gray-500">Use an authenticator or SMS OTP each time you log in</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Third-party accounts</h3>
            <div className="flex items-center justify-between w-[50%]">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-900">Google</span>
              </div>
              <span className="text-orange-500 font-medium">Linked</span>
            </div>
          </div>

          <div className='mt-20'>
            <h3 className="font-semibold text-2xl text-gray-900 mb-4">Delete account</h3>
            <p className="text-sm text-gray-500 mb-4 font-semibold">
              Permanently delete your account, including order history, saved payment methods, and preferences. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="deleteConfirm"
                checked={deleteConfirm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirm(e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="deleteConfirm" className="text-sm text-gray-700">
                Confirm that I want to delete my account
              </label>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={!deleteConfirm}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                deleteConfirm
                  ? 'bg-white hover:text-white hover:bg-red-700 text-red-600 border border-red-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSettings;