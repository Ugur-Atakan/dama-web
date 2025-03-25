// src/admin/pages/FormSchemaBuilder.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { FormSchemaPreview } from '../components/FormSchemaPreview';
import { SectionBuilder } from '../components/SectionBuilder';
import { 
  FormSchema, 
  FormSection, 
  FormField, 
  FormOption,
  FieldType
} from '../../types';
import instance from '../../http/instance';

// Form tipi için desteklenen diller
const SUPPORTED_LANGUAGES = ['tr', 'en'];

// Yeni bir form için default şema
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

// Yeni bir bölüm için default şema
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

// Yeni bir alan için default şema
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

// Yeni bir seçenek için default şema
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

  // Form ID varsa, form şemasını sunucudan getir
  useEffect(() => {
    if (formId && formId !== 'new') {
      setLoading(true);
      instance.get(`/api/form-schemas/${formId}`)
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

  // Form adını güncelle
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

  // Form açıklamasını güncelle
  const handleFormDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormSchema(prev => ({
      ...prev,
      description: {
        ...prev.description || {},
        [currentLanguage]: e.target.value
      }
    }));
  };

  // Yeni bir bölüm ekle
  const handleAddSection = () => {
    setFormSchema(prev => ({
      ...prev,
      sections: [...prev.sections, createNewSection()]
    }));
  };

  // Bölümü güncelle
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

  // Bölümü sil
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

  // Bölümlerin sırasını değiştir
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
      
      // Swap sections
      [updatedSections[index], updatedSections[targetIndex]] = 
      [updatedSections[targetIndex], updatedSections[index]];
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  // Dil değiştir
  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    // Form adını seçilen dile göre güncelle
    setFormName(formSchema.title[lang] || '');
  };

  // Form şemasını kaydet
  const handleSaveFormSchema = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validasyon: form adı kontrolü
      if (!formSchema.title[currentLanguage]) {
        setError('Form adı boş olamaz');
        setLoading(false);
        return;
      }

      // Validasyon: en az bir bölüm olmalı
      if (formSchema.sections.length === 0) {
        setError('Formda en az bir bölüm olmalıdır');
        setLoading(false);
        return;
      }

      // Validasyon: her bölümde en az bir alan olmalı
      const emptySectionIndex = formSchema.sections.findIndex(section => section.fields.length === 0);
      if (emptySectionIndex !== -1) {
        setError(`"${formSchema.sections[emptySectionIndex].title[currentLanguage]}" bölümünde en az bir alan olmalıdır`);
        setLoading(false);
        return;
      }

      // Form şemasını API'ye gönder
      const isNewForm = !formId || formId === 'new';
      const apiUrl = isNewForm ? '/api/form-schemas' : `/api/form-schemas/${formId}`;
      const apiMethod = isNewForm ? instance.post : instance.put;
      
      await apiMethod(apiUrl, formSchema);
      navigate('/admin/forms');
    } catch (err) {
      console.error(err);
      setError('Form şeması kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading && formId !== 'new') {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {formId && formId !== 'new' ? 'Form Düzenle' : 'Yeni Form Oluştur'}
        </h1>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Düzenleme Modu' : 'Önizleme'}
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSaveFormSchema}
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 bg-white p-4 rounded shadow">
        <div className="flex mb-4">
          <div className="mr-4">
            <label className="block mb-1 font-medium">Dil:</label>
            <div className="flex space-x-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang}
                  className={`px-3 py-1 rounded ${
                    currentLanguage === lang 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Form Adı:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formName}
              onChange={handleFormNameChange}
              placeholder={`Form adını ${currentLanguage.toUpperCase()} dilinde girin`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Form Açıklaması (Opsiyonel):</label>
            <textarea
              className="w-full p-2 border rounded"
              value={formSchema.description?.[currentLanguage] || ''}
              onChange={handleFormDescriptionChange}
              placeholder={`Form açıklamasını ${currentLanguage.toUpperCase()} dilinde girin`}
              rows={2}
            />
          </div>
        </div>
      </div>

      {!previewMode ? (
        <div>
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

          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleAddSection}
            >
              Yeni Bölüm Ekle
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Form Önizleme</h2>
          <FormSchemaPreview
            formSchema={formSchema}
            currentLanguage={currentLanguage}
          />
        </div>
      )}
    </div>
  );
};

export default FormSchemaBuilder;