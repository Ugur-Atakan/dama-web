// src/pages/UserLogin.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const UserLogin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Yönlendirme için state'i kontrol et
  const from = location.state?.from || '/user/forms';
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Email validasyonu
    if (!email.trim()) {
      toast.error('E-posta adresi gerekli');
      setLoading(false);
      return;
    }
    
    // Şifre validasyonu
    if (!password) {
      toast.error('Şifre gerekli');
      setLoading(false);
      return;
    }
    
    try {
      // Sahte login - gerçek uygulamada burada API çağrısı olur
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekletme
      
      // Hatırla beni seçeneği aktifse token'ı localStorage'a, değilse sessionStorage'a kaydet
      if (rememberMe) {
        localStorage.setItem('auth-token', 'dummy-token-123');
        localStorage.setItem('user', JSON.stringify({ email, role: 'user' }));
      } else {
        sessionStorage.setItem('auth-token', 'dummy-token-123');
        sessionStorage.setItem('user', JSON.stringify({ email, role: 'user' }));
      }
      
      toast.success('Giriş başarılı');
      navigate(from);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          {/* Logo */}
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {t('userLogin', 'Kullanıcı Girişi')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('loginDescription', 'Hesabınıza giriş yapın')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('email', 'E-posta')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('emailPlaceholder', 'E-posta adresiniz')}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password', 'Şifre')}
                </label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                  {t('forgotPassword', 'Şifremi unuttum')}
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('passwordPlaceholder', 'Şifreniz')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {t('rememberMe', 'Beni hatırla')}
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('loggingIn', 'Giriş yapılıyor...')}
                </span>
              ) : (
                t('login', 'Giriş Yap')
              )}
            </button>
          </div>

          <div className="flex items-center justify-center mt-4">
            <span className="text-sm text-gray-600">Hesabınız yok mu?</span>
            <a href="#" className="ml-1 text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Kayıt ol
            </a>
          </div>
        </form>
        
        {/* Demo bilgileri - gerçek uygulamada kaldırılmalı */}
        <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm text-gray-700">
          <p className="font-medium text-center mb-1">Demo Bilgileri</p>
          <p>Herhangi bir e-posta ve şifre ile giriş yapabilirsiniz.</p>
          <p className="mt-1">Örn: user@example.com / password</p>
        </div>

        {/* Sosyal medya girişleri */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t('orLoginWith', 'veya şununla giriş yapın')}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">Facebook</span>
              </a>
            </div>

            <div>
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span className="ml-2">Google</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;