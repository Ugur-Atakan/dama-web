import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, ArrowLeft, Loader } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { saveUserTokens } from '../../utils/storage';
import { loginWithEmail } from '../../http/requests/auth';
import { login } from '../../store/slices/userSlice';

const AdminLogin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginData = await loginWithEmail(email, password);
      // Only store serializable data
      const { tokens, user } = loginData;
      saveUserTokens(tokens);
      dispatch(login({ user, tokens }));

      navigate("admin/", { replace: true });
     } catch (error: any) {
  // Konsola yazdırırken sembollerden kurtulmak için bu satırı kullan.
  console.error("Login error:", JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));

  if (error.message === "Bu hesap çalışan hesabı değil.") {
    setError(error.message);
  } else if (error.code === "auth/invalid-email") {
    setError("Geçersiz e-posta adresi.");
  } else if (error.code === "auth/wrong-password") {
    setError("Hatalı şifre.");
  } else {
    setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
  }
} finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f1f0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div>
            <Link 
              to="/forms" 
              className="inline-flex items-center text-sm font-medium text-[#292A2D] hover:text-opacity-80 transition-all duration-300 mb-6"
            >
              <ArrowLeft size={16} className="mr-1" />
              {t('backToForms', 'Form Sayfasına Dön')}
            </Link>

            <h2 className="text-2xl font-bold text-[#292A2D]">
              {t('adminLogin', 'Yönetici Paneli Girişi')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Yönetici paneline erişmek için giriş yapın
            </p>
          </div>
          
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email', 'E posta')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                    placeholder={t('email', 'E posta')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password', 'Şifre')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                    placeholder={t('password', 'Şifre')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#292A2D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292A2D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    {t('loggingIn', 'Giriş yapılıyor...')}
                  </>
                ) : (
                  t('login', 'Giriş Yap')
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Bilgileri</h4>
            <div className="text-sm text-blue-700">
              <p>Kullanıcı adı: <code className="bg-blue-100 px-2 py-1 rounded">admin</code></p>
              <p>Şifre: <code className="bg-blue-100 px-2 py-1 rounded">password</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;