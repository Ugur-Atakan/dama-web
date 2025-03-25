// src/admin/pages/FormSchemaList.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import instance from '../../http/instance';

interface FormSchemaListItem {
  id: string;
  formId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const FormSchemaList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formSchemas, setFormSchemas] = useState<FormSchemaListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormSchemas = async () => {
      try {
        const response = await instance.get('/api/form-schemas');
        const currentLanguage = i18n.language;
        
        // API'den gelen verileri formatlayalım
        const formattedSchemas = response.data.map((item: any) => {
          // Title JSON string olarak geliyorsa parse edelim
          let title = item.title;
          if (typeof title === 'string') {
            try {
              title = JSON.parse(title);
            } catch (e) {
              // Parse edilemezse string olarak kullanılır
            }
          }
          
          // Çoklu dil desteği için title'ı doğru dilde gösterelim
          const displayTitle = typeof title === 'object' 
            ? (title[currentLanguage] || title.en || Object.values(title)[0]) 
            : title;
          
          return {
            id: item.id,
            formId: item.formId,
            title: displayTitle,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
            updatedAt: new Date(item.updatedAt).toLocaleDateString()
          };
        });
        
        setFormSchemas(formattedSchemas);
      } catch (err) {
        console.error(err);
        setError('Form şemaları yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchFormSchemas();
  }, [i18n.language]);

  const handleDeleteFormSchema = async (formId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Bu form şemasını silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      await instance.delete(`/api/form-schemas/${formId}`);
      setFormSchemas(prev => prev.filter(schema => schema.formId !== formId));
    } catch (err) {
      console.error(err);
      setError('Form şeması silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Form Şemaları</h1>
        <Link 
          to="/admin/forms/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Yeni Form Oluştur
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {formSchemas.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600 mb-4">Henüz hiç form şeması oluşturulmamış.</p>
          <Link 
            to="/admin/forms/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            İlk Formu Oluştur
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Adı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturulma Tarihi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Güncelleme
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formSchemas.map((schema) => (
                <tr 
                  key={schema.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/forms/${schema.formId}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{schema.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{schema.formId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{schema.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{schema.updatedAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/forms/${schema.formId}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Düzenle
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={(e) => handleDeleteFormSchema(schema.formId, e)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormSchemaList;