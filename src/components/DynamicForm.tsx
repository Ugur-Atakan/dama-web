import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { FormSchema, FormField, FormSection, Condition } from '../types';
import { AlertCircle, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// Zod şeması oluşturan fonksiyon
const createValidationSchema = (formSchema: FormSchema, language: string) => {
  const schemaMap: Record<string, any> = {};
  
  formSchema.sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.conditions && field.conditions.length > 0) {
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
  
  const [initialSchema] = useState(formSchema);
  const [initialLanguage] = useState(currentLanguage);
  
  const validationSchema = createValidationSchema(formSchema, currentLanguage);
  
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData,
    mode: 'onBlur'
  });
  
  const { handleSubmit, watch, control, formState: { errors, isSubmitting } } = methods;
  const formValues = watch();
  
  useEffect(() => {
    methods.clearErrors();
  }, [formSchema, currentLanguage, methods]);

  const renderField = (field: FormField, section: FormSection) => {
    if (!shouldShowField(field, formValues)) {
      return null;
    }
    
    const label = field.label[currentLanguage] || field.name;
    const placeholder = field.placeholder?.[currentLanguage] || '';
    const description = field.description?.[currentLanguage] || '';
    
    const baseInputClasses = "w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300";
    const errorInputClasses = "border-red-300 focus:ring-red-500";
    
    switch (field.type) {
      case 'text':
        return (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-2 text-sm text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <input
                    type="text"
                    className={`${baseInputClasses} ${errors[field.name] ? errorInputClasses : ''}`}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={onChange}
                    ref={ref}
                    {...rest}
                  />
                  {errors[field.name] && (
                    <p className="mt-2 text-sm text-red-600">
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
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-2 text-sm text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <textarea
                    className={`${baseInputClasses} min-h-[120px] ${errors[field.name] ? errorInputClasses : ''}`}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={onChange}
                    ref={ref}
                    rows={4}
                    {...rest}
                  />
                  {errors[field.name] && (
                    <p className="mt-2 text-sm text-red-600">
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
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-2 text-sm text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <input
                    type="date"
                    className={`${baseInputClasses} ${errors[field.name] ? errorInputClasses : ''}`}
                    value={value || ''}
                    onChange={onChange}
                    ref={ref}
                    {...rest}
                  />
                  {errors[field.name] && (
                    <p className="mt-2 text-sm text-red-600">
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
          <div className="mb-6">
            <div className="flex items-start">
              <Controller
                name={field.name}
                control={control}
                render={({ field: { onChange, value, ref, ...rest } }) => (
                  <>
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[#292A2D] focus:ring-[#292A2D] transition-all duration-300"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        ref={ref}
                        {...rest}
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-700">
                        {label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                      )}
                    </div>
                  </>
                )}
              />
            </div>
            {errors[field.name] && (
              <p className="mt-2 text-sm text-red-600">
                {String(errors[field.name]?.message)}
              </p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-2 text-sm text-gray-500">{description}</p>
            )}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <>
                  <select
                    className={`${baseInputClasses} ${errors[field.name] ? errorInputClasses : ''}`}
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
                    <p className="mt-2 text-sm text-red-600">
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
          <div className="mb-8">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="mb-2 text-sm text-gray-500">{description}</p>
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
                        <div key={itemIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-700">{t('item', 'Öğe')} #{itemIndex + 1}</h4>
                            <button
                              type="button"
                              className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                              onClick={() => {
                                const newItems = [...items];
                                newItems.splice(itemIndex, 1);
                                onChange(newItems);
                              }}
                            >
                              <Trash2 size={16} className="mr-1" />
                              {t('remove', 'Kaldır')}
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            {field.fields?.map((subField) => {
                              const subFieldLabel = subField.label[currentLanguage] || subField.name;
                              const subFieldPlaceholder = subField.placeholder?.[currentLanguage] || '';
                              
                              return (
                                <div key={subField.name}>
                                  <label className="block mb-2 text-sm font-medium text-gray-700">
                                    {subFieldLabel}
                                    {subField.required && <span className="text-red-500 ml-1">*</span>}
                                  </label>
                                  
                                  {subField.type === 'date' ? (
                                    <input
                                      type="date"
                                      className={baseInputClasses}
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
                                        className="h-4 w-4 rounded border-gray-300 text-[#292A2D] focus:ring-[#292A2D]"
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
                                      className={baseInputClasses}
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
                      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">{t('noDynamicItems', 'Henüz öğe eklenmemiş')}</p>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      className="w-full py-3 px-4 border border-[#292A2D] rounded-lg shadow-sm text-sm font-medium text-[#292A2D] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292A2D] transition-all duration-300 flex items-center justify-center"
                      onClick={() => {
                        const newItem = field.fields?.reduce((acc, subField) => {
                          return { ...acc, [subField.name]: '' };
                        }, {});
                        onChange([...items, newItem]);
                      }}
                    >
                      <Plus size={20} className="mr-2" />
                      {t('addNew', 'Yeni Ekle')}
                    </button>
                    
                    {errors[field.name] && (
                      <div className="mt-2 flex items-start p-4 rounded-lg bg-red-50">
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                        <p className="ml-3 text-sm text-red-600">
                          {String(errors[field.name]?.message)}
                        </p>
                      </div>
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="space-y-8">
          {formSchema.sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 bg-[#f3f1f0]">
                <h2 className="text-xl font-bold text-[#292A2D]">{section.title[currentLanguage]}</h2>
                {section.description && section.description[currentLanguage] && (
                  <p className="mt-2 text-sm text-gray-600">{section.description[currentLanguage]}</p>
                )}
              </div>
              
              <div className="p-6">
                {section.fields.map((field) => (
                  <React.Fragment key={field.name}>
                    {renderField(field, section)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#292A2D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292A2D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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