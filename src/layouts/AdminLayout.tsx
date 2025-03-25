import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  Globe, 
  LogOut,
  FileText,
  Users,
  Calendar,
  FolderOpen,
  Settings,
  ChevronDown,
  Layout,
  Bell,
  Search,
  PersonStanding
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferredLanguage', lng);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Form Yönetimi',
      icon: <FileText size={20} />,
      path: '/admin/forms',
      description: 'Form şablonları ve yanıtları'
    },
    {
      title: 'Başvuru Yönetimi',
      icon: <PersonStanding size={20} />,
      path: '/admin/applications',
      description: 'Başvurular ve yanıtları'
    },
    {
      title: 'Kullanıcı Yönetimi',
      icon: <Users size={20} />,
      path: '/admin/users',
      description: 'Kullanıcı hesapları ve roller'
    },
    {
      title: 'Randevu Yönetimi',
      icon: <Calendar size={20} />,
      path: '/admin/appointments',
      description: 'Randevu takibi ve planlaması'
    },
    {
      title: 'Dosya Yönetimi',
      icon: <FolderOpen size={20} />,
      path: '/admin/files',
      description: 'Belge ve dosya arşivi'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link to="/admin" className="flex items-center">
                  <Layout className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    Yönetim Paneli
                  </span>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="hidden lg:flex lg:ml-6 lg:items-center">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ara..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <span className="sr-only">Bildirimler</span>
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900">Bildirimler</h3>
                      <div className="mt-2 space-y-2">
                        <a href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">Yeni form yanıtı</p>
                          <p className="text-sm text-gray-500">İş başvuru formu yanıtlandı</p>
                          <p className="text-xs text-gray-400 mt-1">5 dakika önce</p>
                        </a>
                        <a href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">Yeni randevu talebi</p>
                          <p className="text-sm text-gray-500">Yarın 14:00 için randevu talebi</p>
                          <p className="text-xs text-gray-400 mt-1">1 saat önce</p>
                        </a>
                      </div>
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <a href="#" className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Tüm bildirimleri görüntüle
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <Globe className="h-5 w-5" />
                  <span>{i18n.language.toUpperCase()}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          i18n.language === 'tr' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          changeLanguage('tr');
                          setIsProfileDropdownOpen(false);
                        }}
                      >
                        Türkçe
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          i18n.language === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          changeLanguage('en');
                          setIsProfileDropdownOpen(false);
                        }}
                      >
                        English
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <Link
                to="/admin/settings"
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
              >
                <Settings className="h-6 w-6" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Çıkış
              </button>

              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Menüyü Aç</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                    ${location.pathname.includes(item.path)
                      ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    }
                  `}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 border-r border-gray-200 bg-white">
            <div className="h-full flex flex-col">
              <nav className="flex-1 overflow-y-auto">
                <div className="px-4 py-4 space-y-8">
                  {/* Menu Groups */}
                  <div>
                    <div className="px-3 mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Ana Menü
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`
                            group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                            ${location.pathname.includes(item.path)
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className={`
                            mr-3
                            ${location.pathname.includes(item.path)
                              ? 'text-indigo-700'
                              : 'text-gray-400 group-hover:text-gray-500'
                            }
                          `}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <div className="px-3 mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Hızlı İstatistikler
                      </h3>
                    </div>
                    <div className="space-y-4 px-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-900">Aktif Formlar</div>
                        <div className="mt-1 text-2xl font-semibold text-indigo-600">24</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-900">Bugünkü Randevular</div>
                        <div className="mt-1 text-2xl font-semibold text-indigo-600">8</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-900">Yeni Mesajlar</div>
                        <div className="mt-1 text-2xl font-semibold text-indigo-600">12</div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <main className="flex-1 relative z-0 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;