// src/pages/FormPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DynamicForm from '../components/DynamicForm';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FormSchema } from '../types';
import instance from '../http/instance';

const FormPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');

  // Form şemasını yükle
  useEffect(() => {
    const fetchFormSchema = async () => {
      if (!formId) return;
      
      try {
        setLoading(true);
        const response = await instance.get(`/form-schemas/${formId}`);
        
        // API'den gelen formu tip güvenliği için kontrol et ve dönüştür
        if (response.data && response.data.schema) {
          setFormSchema(response.data.schema);
          
          // Form başlığını mevcut dile göre ayarla
          const title = response.data.schema.title;
          if (title) {
            const currentLanguage = i18n.language;
            setFormTitle(
              typeof title === 'object' 
                ? title[currentLanguage] || title.en || Object.values(title)[0] 
                : title
            );
          }
        } else {
          throw new Error('Geçersiz form şeması formatı');
        }
        
        setError(null);
      } catch (err) {
        console.error('Form şeması yüklenirken hata oluştu:', err);
        setError(t('errorLoadingForm', 'Form şeması yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'));
      } finally {
        setLoading(false);
      }
    };

    fetchFormSchema();
  }, [formId, i18n.language, t]);

  // Form başlığını dil değiştiğinde güncelle
  useEffect(() => {
    if (formSchema && formSchema.title) {
      const currentLanguage = i18n.language;
      const title = formSchema.title;
      setFormTitle(
        typeof title === 'object' 
          ? title[currentLanguage] || title.en || Object.values(title)[0] 
          : title
      );
    }
  }, [formSchema, i18n.language]);

  // Form gönderimini işle
  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      // Form verilerini API'ye gönder
      const response = await instance.post(`/forms/${formId}/submissions`, data);
      
      // Başarı sayfasına yönlendir (ek bilgilerle)
      navigate('/success', { 
        state: { 
          formData: data, 
          formId, 
          formTitle,
          submissionId: response.data?.id || null,
          showSummary: false // Form özetini göster/gizle
        } 
      });
    } catch (err) {
      console.error('Form gönderilirken hata oluştu:', err);
      setError(t('errorSubmittingForm', 'Form gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'));
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link to="/forms" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToFormList', 'Form Listesine Dön')}
            </Link>
          </div>
          <LanguageSwitcher />
        </div>
        
        {loading ? (
          <div className="bg-white shadow sm:rounded-lg p-8">
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white shadow sm:rounded-lg p-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <div className="mt-4">
                    <Link
                      to="/forms"
                      className="text-sm font-medium text-red-700 hover:text-red-600"
                    >
                      {t('backToFormList', 'Form Listesine Dön')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !formSchema ? (
          <div className="bg-white shadow sm:rounded-lg p-8">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900">
                {t('formNotFound', 'Form bulunamadı.')}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t('formNotFoundDescription', 'İstediğiniz form bulunamadı veya artık mevcut değil.')}
              </p>
              <div className="mt-6">
                <Link
                  to="/forms"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  {t('backToFormList', 'Form Listesine Dön')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{formTitle}</h1>
            <div className="bg-white shadow sm:rounded-lg p-6">
              <DynamicForm 
                formSchema={formSchema} 
                onSubmit={handleSubmit} 
                initialData={{}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Link bileşeni eksikse import et
const Link: React.FC<{ 
  to: string, 
  className?: string, 
  children?: React.ReactNode 
}> = ({ to, className, children }) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };
  
  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

export default FormPage;