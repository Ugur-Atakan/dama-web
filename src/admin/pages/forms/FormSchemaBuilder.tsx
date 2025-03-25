import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { FormSchemaPreview } from '../../components/FormSchemaPreview';
import { SectionBuilder } from '../../components/SectionBuilder';
import { 
  FormSchema, 
  FormSection, 
  FormField, 
  FormOption,
  FieldType
} from '../../../types';
import instance from '../../../http/instance';
import { Plus, Eye, Save, ArrowLeft, Loader, AlertCircle } from 'lucide-react';

const SUPPORTED_LANGUAGES = ['tr', 'en'];

const createNewFormSchema = (): FormSchema => {
  const formId = uuidv4();
  return {
    id: formId,
    title: {
      tr: 'Yeni Form',
      en: 'New Form'
    },
    sections: [createNewSection()]
  };
};

const createNewSection = (): FormSection => {
  return {
    id: uuidv4(),
    title: {
      tr: 'Yeni Bölüm',
      en: 'New Section'
    },
    fields: []
  };
};

const createNewField = (type: FieldType = 'text'): FormField => {
  return {
    name: `field_${uuidv4().substring(0, 8)}`,
    type,
    label: {
      tr: 'Yeni Soru',
      en: 'New Field'
    },
    placeholder: {
      tr: '',
      en: ''
    },
    required: false
  };
};

const createNewOption = (): FormOption => {
  return {
    value: `option_${uuidv4().substring(0, 8)}`,
    label: {
      tr: 'Yeni Seçenek',
      en: 'New Option'
    }
  };
};

const FormSchemaBuilder: React.FC = () => {
  const { id: formId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [formSchema, setFormSchema] = useState<FormSchema>(createNewFormSchema());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  const [formName, setFormName] = useState<string>('');

  useEffect(() => {
    if (formId && formId !== 'new') {
      setLoading(true);
      instance.get(`/form-schemas/${formId}`)
        .then(response => {
          setFormSchema(response.data.schema);
          setFormName(response.data.schema.title[currentLanguage] || '');
        })
        .catch(err => {
          setError('Form şeması yüklenemedi');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [formId, currentLanguage]);

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
    setFormSchema(prev => ({
      ...prev,
      title: {
        ...prev.title,
        [currentLanguage]: e.target.value
      }
    }));
  };

  const handleFormDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormSchema(prev => ({
      ...prev,
      description: {
        ...prev.description || {},
        [currentLanguage]: e.target.value
      }
    }));
  };

  const handleAddSection = () => {
    setFormSchema(prev => ({
      ...prev,
      sections: [...prev.sections, createNewSection()]
    }));
  };

  const handleUpdateSection = (updatedSection: FormSection, index: number) => {
    setFormSchema(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[index] = updatedSection;
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const handleDeleteSection = (index: number) => {
    setFormSchema(prev => {
      const updatedSections = [...prev.sections];
      updatedSections.splice(index, 1);
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formSchema.sections.length - 1)
    ) {
      return;
    }

    setFormSchema(prev => {
      const updatedSections = [...prev.sections];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [updatedSections[index], updatedSections[targetIndex]] = 
      [updatedSections[targetIndex], updatedSections[index]];
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setFormName(formSchema.title[lang] || '');
  };

  const handleSaveFormSchema = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!formSchema.title[currentLanguage]) {
        setError('Form adı boş olamaz');
        setLoading(false);
        return;
      }

      if (formSchema.sections.length === 0) {
        setError('Formda en az bir bölüm olmalıdır');
        setLoading(false);
        return;
      }

      const emptySectionIndex = formSchema.sections.findIndex(section => section.fields.length === 0);
      if (emptySectionIndex !== -1) {
        setError(`"${formSchema.sections[emptySectionIndex].title[currentLanguage]}" bölümünde en az bir alan olmalıdır`);
        setLoading(false);
        return;
      }

      const isNewForm = !formId || formId === 'new';
      const apiUrl = isNewForm ? '/form-schemas' : `/form-schemas/${formId}`;
      const apiMethod = isNewForm ? instance.post : instance.put;
      
      await apiMethod(apiUrl, formSchema);
      navigate('/admin/forms', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Form şeması kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading && formId !== 'new') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-[#292A2D] animate-spin" />
          <p className="text-[#292A2D] font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/admin/forms')}
              className="inline-flex items-center text-[#292A2D] hover:text-opacity-80 mb-4 transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              Formlara Dön
            </button>
            <h1 className="text-3xl font-bold text-[#292A2D]">
              {formId && formId !== 'new' ? 'Form Düzenle' : 'Yeni Form Oluştur'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`
                inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${previewMode 
                  ? 'bg-white text-[#292A2D] border border-[#292A2D]' 
                  : 'bg-[#292A2D] text-white'
                }
              `}
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye size={20} className="mr-2" />
              {previewMode ? 'Düzenleme Modu' : 'Önizleme'}
            </button>
            <button
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveFormSchema}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center space-x-3 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <h2 className="text-lg font-medium text-[#292A2D]">Dil:</h2>
              <div className="flex space-x-2">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-300
                      ${currentLanguage === lang 
                        ? 'bg-[#292A2D] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Form Adı:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                  value={formName}
                  onChange={handleFormNameChange}
                  placeholder={`Form adını ${currentLanguage.toUpperCase()} dilinde girin`}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Form Açıklaması (Opsiyonel):</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                  value={formSchema.description?.[currentLanguage] || ''}
                  onChange={handleFormDescriptionChange}
                  placeholder={`Form açıklamasını ${currentLanguage.toUpperCase()} dilinde girin`}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!previewMode ? (
        <div className="space-y-6">
          {formSchema.sections.map((section, index) => (
            <SectionBuilder
              key={section.id}
              section={section}
              index={index}
              currentLanguage={currentLanguage}
              onUpdate={(updatedSection) => handleUpdateSection(updatedSection, index)}
              onDelete={() => handleDeleteSection(index)}
              onMove={(direction) => handleMoveSection(index, direction)}
              isFirst={index === 0}
              isLast={index === formSchema.sections.length - 1}
              createNewField={createNewField}
              createNewOption={createNewOption}
            />
          ))}

          <button
            className="w-full p-4 bg-[#f3f1f0] hover:bg-opacity-80 text-[#292A2D] rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
            onClick={handleAddSection}
          >
            <Plus size={24} />
            <span>Yeni Bölüm Ekle</span>
          </button>
        </div>
      ) : (
        <FormSchemaPreview
          formSchema={formSchema}
          currentLanguage={currentLanguage}
        />
      )}
    </div>
  );
};

export default FormSchemaBuilder;