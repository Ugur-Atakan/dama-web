// src/admin/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dil değiştirme fonksiyonu
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferredLanguage', lng);
  };
  
  // Mobil menü toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Çıkış fonksiyonu (örnek)
  const handleLogout = () => {
    // Burada gerçek logout işlemi yapılabilir
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin" className="text-xl font-bold text-gray-800">
                  Form Yönetim Paneli
                </Link>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin/forms"
                  className={`${
                    location.pathname.includes('/admin/forms')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Formlar
                </Link>
                
                <a
                  href="/forms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Form Sayfasını Göster
                </a>
              </div>
            </div>
            
            {/* Right Menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {/* Dil Seçenekleri */}
              <div className="flex space-x-2">
                <button
                  className={`px-2 py-1 rounded ${i18n.language === 'tr' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => changeLanguage('tr')}
                >
                  TR
                </button>
                <button
                  className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </button>
              </div>
              
              {/* Profil Dropdown (Örnek) */}
              <div className="relative">
                <button 
                  className="bg-white p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => {}}
                >
                  <span className="sr-only">Kullanıcı Ayarları</span>
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </button>
              </div>
              
              {/* Çıkış Butonu */}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={handleLogout}
              >
                Çıkış
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Menüyü Aç</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/admin/forms"
                className={`${
                  location.pathname.includes('/admin/forms')
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                Formlar
              </Link>
              
              <a
                href="/forms"
                target="_blank"
                rel="noopener noreferrer"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Form Sayfasını Göster
              </a>
              
              <button
                className="w-full text-left border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={handleLogout}
              >
                Çıkış
              </button>
              
              {/* Mobil Dil Değiştirici */}
              <div className="pl-3 pr-4 py-2 flex space-x-2">
                <button
                  className={`px-2 py-1 rounded ${i18n.language === 'tr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => changeLanguage('tr')}
                >
                  TR
                </button>
                <button
                  className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Sidebar and Content */}
          <div className="flex flex-col sm:flex-row">
            {/* Sidebar */}
            <div className="w-full sm:w-64 mb-4 sm:mb-0">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-3 bg-gray-800 text-white text-lg font-medium">
                  Menü
                </div>
                <nav className="p-2">
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/admin/forms"
                        className={`block px-4 py-2 rounded-md ${
                          location.pathname.includes('/admin/forms') 
                            ? 'bg-blue-500 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Formlar
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/forms/new"
                        className={`block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700`}
                      >
                        <span className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Yeni Form
                        </span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="/forms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                      >
                        <span className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Formları Görüntüle
                        </span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full sm:flex-1 sm:ml-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow mt-8 py-4">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Form Yönetim Paneli. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;