import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import instance from '../../../http/instance';
import {
  Plus,
  Pencil,
  Trash2,
  Loader,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
} from 'lucide-react';

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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormSchemas = async () => {
      try {
        const response = await instance.get('/form-schemas');
        console.log(response.data);
        const currentLanguage = i18n.language;

        const formattedSchemas = response.data.map((item: any) => {
          let title = item.title;
          if (typeof title === 'string') {
            try {
              title = JSON.parse(title);
            } catch (e) {}
          }

          const displayTitle =
            typeof title === 'object'
              ? title[currentLanguage] || title.en || Object.values(title)[0]
              : title;

          return {
            id: item.id,
            formId: item.formId,
            title: displayTitle,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
            updatedAt: new Date(item.updatedAt).toLocaleDateString(),
          };
        });

        setFormSchemas(formattedSchemas);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Form şemaları yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchFormSchemas();
  }, [i18n.language]);

  const handleDeleteFormSchema = async (
    formId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (deleteConfirm !== formId) {
      setDeleteConfirm(formId);
      return;
    }

    try {
      await instance.delete(`/form-schemas/${formId}`);
      setFormSchemas((prev) =>
        prev.filter((schema) => schema.formId !== formId)
      );
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      setError('Form şeması silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-[#292A2D] animate-spin" />
          <p className="text-[#292A2D] font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#292A2D]">Form Şemaları</h1>
          <p className="mt-2 text-gray-600">
            Tüm formlarınızı buradan yönetebilirsiniz
          </p>
        </div>
        <Link
          to="/admin/forms/new"
          className="inline-flex items-center px-6 py-3 bg-[#292A2D] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300"
        >
          <Plus size={20} className="mr-2" />
          Yeni Form Oluştur
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-center space-x-3 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {formSchemas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-4">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">
            Henüz hiç form şeması oluşturulmamış.
          </p>
          <Link
            to="/admin/forms/new"
            className="inline-flex items-center px-6 py-3 bg-[#292A2D] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300"
          >
            <Plus size={20} className="mr-2" />
            İlk Formu Oluştur
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f3f1f0]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-[#292A2D]"
                  >
                    Form Adı
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-[#292A2D]"
                  >
                    Form ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-[#292A2D]"
                  >
                    Oluşturulma Tarihi
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-[#292A2D]"
                  >
                    Son Güncelleme
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-sm font-semibold text-[#292A2D]"
                  >
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {formSchemas.map((schema) => (
                  <tr
                    key={schema.id}
                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/admin/forms/${schema.formId}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText size={20} className="text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-[#292A2D]">
                          {schema.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {schema.formId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        {schema.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-2" />
                        {schema.updatedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          to={`/admin/forms/${schema.formId}`}
                          className="inline-flex items-center text-[#292A2D] hover:text-opacity-80 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pencil size={18} className="mr-1" />
                          Düzenle
                        </Link>
                        <button
                          className={`inline-flex items-center ${
                            deleteConfirm === schema.formId
                              ? 'text-red-600 hover:text-red-800'
                              : 'text-gray-600 hover:text-gray-800'
                          } transition-all duration-300`}
                          onClick={(e) =>
                            handleDeleteFormSchema(schema.formId, e)
                          }
                        >
                          <Trash2 size={18} className="mr-1" />
                          {deleteConfirm === schema.formId
                            ? 'Emin misiniz?'
                            : 'Sil'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSchemaList;
