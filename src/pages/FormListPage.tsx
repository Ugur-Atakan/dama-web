// src/pages/FormListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import instance from '../http/instance';

interface FormListItem {
  id: string;
  formId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const FormListPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await instance.get('/api/form-schemas');
        const currentLanguage = i18n.language;
        
        // API'den gelen verileri formatlayalım
        const formattedForms = response.data.map((item: any) => {
          // Title ve description, JSON string olarak geliyorsa parse edelim
          let title = parseStringOrObject(item.title);
          let description = parseStringOrObject(item.description);
          
          // Çoklu dil desteği için title ve description'ı doğru dilde gösterelim
          const displayTitle = typeof title === 'object' 
            ? (title[currentLanguage] || title.en || Object.values(title)[0]) 
            : title;
            
          const displayDescription = typeof description === 'object' && description
            ? (description[currentLanguage] || description.en || Object.values(description)[0]) 
            : description;
          
          return {
            id: item.id,
            formId: item.formId,
            title: displayTitle,
            description: displayDescription,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
            updatedAt: new Date(item.updatedAt).toLocaleDateString()
          };
        });
        
        setForms(formattedForms);
        setError(null);
      } catch (err) {
        console.error('Form listesi yüklenirken hata oluştu:', err);
        setError(t('errorLoadingForms', 'Formlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'));
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [i18n.language, t]);

  // JSON string ise parse et, değilse olduğu gibi döndür
  const parseStringOrObject = (value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('availableForms', 'Mevcut Formlar')}
          </h1>
          <LanguageSwitcher />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : forms.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-16 sm:px-6 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('noFormsAvailable', 'Henüz hiç form oluşturulmamış.')}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t('checkBackLater', 'Lütfen daha sonra tekrar kontrol edin veya yöneticinizle iletişime geçin.')}
              </p>
              {/* Yönetici paneline bağlantı (opsiyonel) */}
              <div className="mt-6">
                <Link 
                  to="/admin/forms" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('adminPanel', 'Yönetici Paneli')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div key={form.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 mb-4 line-clamp-3">
                      {form.description}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{t('lastUpdated', 'Son Güncelleme')}: {form.updatedAt}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
                  <Link
                    to={`/forms/${form.formId}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('fillForm', 'Formu Doldur')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormListPage;