//@ts-nocheck
// src/components/DynamicForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { FormSchema, FormField, FormSection, Condition } from '../types';

// Zod şeması oluşturan fonksiyon
const createValidationSchema = (formSchema: FormSchema, language: string) => {
  const schemaMap: Record<string, any> = {};
  
  formSchema.sections.forEach(section => {
    section.fields.forEach(field => {
      // Alanın koşullu gösterilip gösterilmediğini kontrol et
      if (field.conditions && field.conditions.length > 0) {
        // Koşullu alanlar için validasyon, form submit edildiğinde kontrol edilecek
        schemaMap[field.name] = z.any().optional();
        return;
      }
      
      let fieldSchema: any = z.any();
      const errorMessage = field.required 
        ? `${field.label[language] || field.name} alanı zorunludur` 
        : undefined;
      
      switch (field.type) {
        case 'text':
          fieldSchema = z.string().trim();
          if (field.validation?.minLength) {
            fieldSchema = fieldSchema.min(field.validation.minLength, {
              message: `En az ${field.validation.minLength} karakter girmelisiniz`
            });
          }
          if (field.validation?.maxLength) {
            fieldSchema = fieldSchema.max(field.validation.maxLength, {
              message: `En fazla ${field.validation.maxLength} karakter girebilirsiniz`
            });
          }
          if (field.validation?.pattern) {
            fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern), {
              message: `Geçerli bir format giriniz`
            });
          }
          break;
          
        case 'textarea':
          fieldSchema = z.string().trim();
          if (field.validation?.minLength) {
            fieldSchema = fieldSchema.min(field.validation.minLength, {
              message: `En az ${field.validation.minLength} karakter girmelisiniz`
            });
          }
          if (field.validation?.maxLength) {
            fieldSchema = fieldSchema.max(field.validation.maxLength, {
              message: `En fazla ${field.validation.maxLength} karakter girebilirsiniz`
            });
          }
          break;
          
        case 'date':
          fieldSchema = z.string().refine((val) => !field.required || !!val, {
            message: errorMessage
          });
          break;
          
        case 'boolean':
          fieldSchema = z.boolean().optional();
          if (field.required) {
            fieldSchema = z.boolean().refine(val => val === true, {
              message: errorMessage
            });
          }
          break;
          
        case 'select':
          fieldSchema = z.string().trim();
          break;
          
        case 'dynamicList':
          if (field.fields) {
            const itemSchema: Record<string, any> = {};
            field.fields.forEach(subField => {
              const subErrorMessage = subField.required 
                ? `${subField.label[language] || subField.name} alanı zorunludur` 
                : undefined;
                
              let subFieldSchema = z.string().trim();
              
              if (subField.type === 'date') {
                subFieldSchema = z.string();
              } else if (subField.type === 'boolean') {
                subFieldSchema = z.boolean().optional();
                if (subField.required) {
                  subFieldSchema = z.boolean().refine(val => val === true, {
                    message: subErrorMessage
                  });
                }
              }
              
              itemSchema[subField.name] = subField.required 
                ? subFieldSchema.refine(val => !!val, { message: subErrorMessage }) 
                : subFieldSchema.optional();
            });
            
            const listSchema = z.array(z.object(itemSchema));
            fieldSchema = field.required 
              ? listSchema.min(1, { message: errorMessage }) 
              : listSchema;
          }
          break;
          
        default:
          fieldSchema = z.any();
      }
      
      schemaMap[field.name] = field.required 
        ? fieldSchema.refine(val => {
            if (typeof val === 'string') return val.trim().length > 0;
            return val !== undefined && val !== null;
          }, { message: errorMessage }) 
        : fieldSchema.optional();
    });
  });
  
  return z.object(schemaMap);
};

// Koşul değerlendirme fonksiyonu
const evaluateCondition = (condition: Condition, formValues: any): boolean => {
  const { field, operator, value } = condition;
  const fieldValue = formValues[field];
  
  if (fieldValue === undefined || fieldValue === null) {
    return false;
  }
  
  switch (operator) {
    case 'eq':
      return fieldValue === value;
    case 'neq':
      return fieldValue !== value;
    case 'gt':
      return fieldValue > value;
    case 'lt':
      return fieldValue < value;
    case 'contains':
      return Array.isArray(fieldValue) && fieldValue.includes(value);
    default:
      return false;
  }
};

// Alan görünürlüğünü değerlendiren fonksiyon
const shouldShowField = (field: FormField, formValues: any): boolean => {
  if (!field.conditions || field.conditions.length === 0) {
    return true;
  }
  
  return field.conditions.every(condition => evaluateCondition(condition, formValues));
};

interface DynamicFormProps {
  formSchema: FormSchema;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  formSchema, 
  onSubmit, 
  initialData = {} 
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // State oluşturulurken formun ilk şemasını ve dili sakla
  const [initialSchema] = useState(formSchema);
  const [initialLanguage] = useState(currentLanguage);
  
  // Zod validasyon şeması oluştur
  const validationSchema = createValidationSchema(formSchema, currentLanguage);
  
  // Form hook'unu başlat
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData,
    mode: 'onBlur'
  });
  
  const { handleSubmit, watch, control, formState: { errors, isSubmitting } } = methods;
  const formValues = watch();
  
  // Form şeması değiştiğinde veya dil değiştiğinde resolver'ı güncelle
  useEffect(() => {
    methods.clearErrors();
  }, [formSchema, currentLanguage, methods]);
  
  // Alanları render etme fonksiyonu
  const renderField = (field: FormField, section: FormSection) => {
    // Alan koşullarını kontrol et, gösterilmemesi gerekiyorsa render etme
    if (!shouldShowField(field, formValues)) {
      return null;
    }
    
    const label = field.label[currentLanguage] || field.name;
    const placeholder = field.placeholder?.[currentLanguage] || '';
    const description = field.description?.[currentLanguage] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-1 text-xs text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded-md ${
                      errors[field.name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={onChange}
                    ref={ref}
                    {...rest}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {String(errors[field.name]?.message)}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        );
        
      case 'textarea':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-1 text-xs text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <textarea
                    className={`w-full p-2 border rounded-md ${
                      errors[field.name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={onChange}
                    ref={ref}
                    rows={4}
                    {...rest}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {String(errors[field.name]?.message)}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        );
        
      case 'date':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-1 text-xs text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <input
                    type="date"
                    className={`w-full p-2 border rounded-md ${
                      errors[field.name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={value || ''}
                    onChange={onChange}
                    ref={ref}
                    {...rest}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {String(errors[field.name]?.message)}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        );
        
      case 'boolean':
        return (
          <div className="mb-4">
            <div className="flex items-start">
              <Controller
                name={field.name}
                control={control}
                render={({ field: { onChange, value, ref, ...rest } }) => (
                  <>
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        ref={ref}
                        {...rest}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">
                        {label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {description && (
                        <p className="text-gray-500">{description}</p>
                      )}
                    </div>
                  </>
                )}
              />
            </div>
            {errors[field.name] && (
              <p className="mt-1 text-xs text-red-500">
                {String(errors[field.name]?.message)}
              </p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-1 text-xs text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <select
                    className={`w-full p-2 border rounded-md bg-white ${
                      errors[field.name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={value || ''}
                    onChange={onChange}
                    ref={ref}
                    {...rest}
                  >
                    <option value="">{t('pleaseSelect', 'Lütfen seçiniz')}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label[currentLanguage] || option.value}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {String(errors[field.name]?.message)}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        );
        
      case 'dynamicList':
        return (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-1 text-xs text-gray-500">{description}</p>
            )}
            
            <Controller
              name={field.name}
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => {
                const items = Array.isArray(value) ? value : [];
                
                return (
                  <div className="space-y-4">
                    {items.length > 0 ? (
                      items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 border rounded-md bg-gray-50">
                          <div className="flex justify-between mb-3">
                            <h4 className="font-medium text-gray-700">{t('item', 'Öğe')} #{itemIndex + 1}</h4>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800 text-sm"
                              onClick={() => {
                                const newItems = [...items];
                                newItems.splice(itemIndex, 1);
                                onChange(newItems);
                              }}
                            >
                              {t('remove', 'Kaldır')}
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            {field.fields?.map((subField) => {
                              const subFieldLabel = subField.label[currentLanguage] || subField.name;
                              const subFieldPlaceholder = subField.placeholder?.[currentLanguage] || '';
                              
                              return (
                                <div key={subField.name}>
                                  <label className="block mb-1 text-sm font-medium text-gray-700">
                                    {subFieldLabel}
                                    {subField.required && <span className="text-red-500 ml-1">*</span>}
                                  </label>
                                  
                                  {subField.type === 'date' ? (
                                    <input
                                      type="date"
                                      className="w-full p-2 border rounded-md border-gray-300"
                                      value={item[subField.name] || ''}
                                      onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[itemIndex] = {
                                          ...newItems[itemIndex],
                                          [subField.name]: e.target.value
                                        };
                                        onChange(newItems);
                                      }}
                                    />
                                  ) : subField.type === 'boolean' ? (
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={item[subField.name] || false}
                                        onChange={(e) => {
                                          const newItems = [...items];
                                          newItems[itemIndex] = {
                                            ...newItems[itemIndex],
                                            [subField.name]: e.target.checked
                                          };
                                          onChange(newItems);
                                        }}
                                      />
                                      <span className="ml-2 text-sm text-gray-600">{subFieldLabel}</span>
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      className="w-full p-2 border rounded-md border-gray-300"
                                      placeholder={subFieldPlaceholder}
                                      value={item[subField.name] || ''}
                                      onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[itemIndex] = {
                                          ...newItems[itemIndex],
                                          [subField.name]: e.target.value
                                        };
                                        onChange(newItems);
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 border rounded-md border-dashed border-gray-300 bg-gray-50 text-center text-gray-500">
                        {t('noDynamicItems', 'Henüz öğe eklenmemiş')}
                      </div>
                    )}
                    
                    <button
                      type="button"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        const newItem = field.fields?.reduce((acc, subField) => {
                          return { ...acc, [subField.name]: '' };
                        }, {});
                        onChange([...items, newItem]);
                      }}
                    >
                      {t('addNew', 'Yeni Ekle')}
                    </button>
                    
                    {errors[field.name] && (
                      <p className="mt-1 text-xs text-red-500">
                        {String(errors[field.name]?.message)}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const processFormData = (data: any) => {
    // Gönderilecek veriyi temizle: gösterilmeyen koşullu alanları kaldır
    const cleanedData: Record<string, any> = {};
    
    formSchema.sections.forEach(section => {
      section.fields.forEach(field => {
        if (shouldShowField(field, data)) {
          cleanedData[field.name] = data[field.name];
        }
      });
    });
    
    return cleanedData;
  };
  
  const handleFormSubmit = (data: any) => {
    const processedData = processFormData(data);
    onSubmit(processedData);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-8">
          {formSchema.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{section.title[currentLanguage]}</h2>
                {section.description && section.description[currentLanguage] && (
                  <p className="mt-1 text-sm text-gray-600">{section.description[currentLanguage]}</p>
                )}
              </div>
              
              <div className="bg-white shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 sm:p-6 space-y-4">
                  {section.fields.map((field) => (
                    <React.Fragment key={field.name}>
                      {renderField(field, section)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('submitting', 'Gönderiliyor...')}
              </>
            ) : (
              t('submit', 'Gönder')
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DynamicForm;