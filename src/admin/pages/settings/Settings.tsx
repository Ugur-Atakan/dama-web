import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Bell,
  Lock,
  Mail,
  Globe,
  Palette,
  Save,
  User
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    language: 'tr'
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30'
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Sistem Ayarları</h1>
          <p className="mt-2 text-sm text-gray-700">
            Sistem tercihlerinizi ve güvenlik ayarlarınızı yönetin.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Profile Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Profil Ayarları</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Ad Soyad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  placeholder="E-posta"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Bildirim Ayarları</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">E-posta Bildirimleri</label>
                  <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta al</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                  className={`${
                    notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.email ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Push Bildirimleri</label>
                  <p className="text-sm text-gray-500">Anlık bildirimler al</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                  className={`${
                    notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.push ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <Palette className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Görünüm Ayarları</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tema</label>
                <select
                  value={appearance.theme}
                  onChange={(e) => setAppearance(prev => ({ ...prev, theme: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="light">Açık</option>
                  <option value="dark">Koyu</option>
                  <option value="system">Sistem</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Yazı Boyutu</label>
                <select
                  value={appearance.fontSize}
                  onChange={(e) => setAppearance(prev => ({ ...prev, fontSize: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="small">Küçük</option>
                  <option value="medium">Orta</option>
                  <option value="large">Büyük</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Güvenlik Ayarları</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">İki Faktörlü Doğrulama</label>
                  <p className="text-sm text-gray-500">Hesabınızı daha güvenli hale getirin</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                  className={`${
                    security.twoFactor ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      security.twoFactor ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Oturum Zaman Aşımı (dakika)</label>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="15">15 dakika</option>
                  <option value="30">30 dakika</option>
                  <option value="60">1 saat</option>
                  <option value="120">2 saat</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-5 w-5 mr-2" />
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;