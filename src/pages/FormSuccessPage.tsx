// src/pages/FormSuccessPage.tsx
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const FormSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Form verilerini ve meta bilgileri location state'inden alma
  const formData = location.state?.formData;
  const formId = location.state?.formId;
  const formTitle = location.state?.formTitle;
  
  // Eğer doğrudan bu sayfaya yönlendirildiyse (state olmadan) ana sayfaya geri yönlendir
  useEffect(() => {
    if (!location.state) {
      const timer = setTimeout(() => {
        navigate('/forms');
      }, 5000); // 5 saniye sonra yönlendir
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-8 sm:px-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2">
              {t('formSubmittedSuccessfully', 'Form Başarıyla Gönderildi')}
            </h3>
            
            {formTitle && (
              <p className="mt-4 text-lg text-gray-900">
                "{formTitle}" {t('formSubmitted', 'formu başarıyla gönderildi.')}
              </p>
            )}
            
            <p className="mt-2 text-md text-gray-500">
              {t('thankYouMessage', 'Katılımınız için teşekkür ederiz. Form yanıtlarınız başarıyla kaydedildi.')}
            </p>
            
            {/* Submission ID veya diğer bilgiler (opsiyonel) */}
            {location.state?.submissionId && (
              <div className="mt-6 max-w-xl mx-auto">
                <div className="rounded-md bg-gray-50 px-6 py-5 border border-gray-200">
                  <div className="text-sm">
                    <h4 className="font-medium text-gray-900">
                      {t('submissionReference', 'Gönderim Referansı')}
                    </h4>
                    <p className="mt-2 text-gray-700">
                      {location.state.submissionId}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Link
                to="/forms"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
              >
                {t('backToFormList', 'Form Listesine Dön')}
              </Link>
              
              {formId && (
                <Link
                  to={`/forms/${formId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                >
                  {t('fillFormAgain', 'Formu Tekrar Doldur')}
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Detaylı Form Bilgileri (İsteğe bağlı) */}
        {formData && location.state?.showSummary && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">{t('formSummary', 'Form Özeti')}</h4>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <pre className="text-sm text-gray-500 overflow-x-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSuccessPage;