import React, { useState } from 'react';
import { FieldBuilder } from './FieldBuilder';
import { FormSection, FormField, FormOption, FieldType } from '../../types';
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown, Trash2, Plus, Layout, TextIcon, CalendarIcon, ToggleLeft, ListIcon, List } from 'lucide-react';

interface SectionBuilderProps {
  section: FormSection;
  index: number;
  currentLanguage: string;
  onUpdate: (section: FormSection) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  createNewField: (type: FieldType) => FormField;
  createNewOption: () => FormOption;
}

export const SectionBuilder: React.FC<SectionBuilderProps> = ({
  section,
  index,
  currentLanguage,
  onUpdate,
  onDelete,
  onMove,
  isFirst,
  isLast,
  createNewField,
  createNewOption
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      title: {
        ...section.title,
        [currentLanguage]: e.target.value
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...section,
      description: {
        ...section.description || {},
        [currentLanguage]: e.target.value
      }
    });
  };

  const handleAddField = (type: FieldType = 'text') => {
    onUpdate({
      ...section,
      fields: [...section.fields, createNewField(type)]
    });
  };

  const handleUpdateField = (updatedField: FormField, fieldIndex: number) => {
    onUpdate({
      ...section,
      fields: section.fields.map((field, idx) => 
        idx === fieldIndex ? updatedField : field
      )
    });
  };

  const handleDeleteField = (fieldIndex: number) => {
    onUpdate({
      ...section,
      fields: section.fields.filter((_, idx) => idx !== fieldIndex)
    });
  };

  const handleMoveField = (fieldIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && fieldIndex === 0) || 
      (direction === 'down' && fieldIndex === section.fields.length - 1)
    ) {
      return;
    }

    const updatedFields = [...section.fields];
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    [updatedFields[fieldIndex], updatedFields[targetIndex]] = 
    [updatedFields[targetIndex], updatedFields[fieldIndex]];
    
    onUpdate({
      ...section,
      fields: updatedFields
    });
  };

  const getFieldTypeIcon = (type: FieldType) => {
    const icons = {
      text: <TextIcon size={18} />,
      textarea: <Layout size={18} />,
      date: <CalendarIcon size={18} />,
      boolean: <ToggleLeft size={18} />,
      select: <ListIcon size={18} />,
      dynamicList: <List size={18} />
    };
    return icons[type] || <TextIcon size={18} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="bg-[#f3f1f0] p-6">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-[#292A2D] text-lg">Bölüm {index + 1}</span>
              <input
                type="text"
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                value={section.title[currentLanguage] || ''}
                onChange={handleTitleChange}
                placeholder={`Bölüm başlığını ${currentLanguage.toUpperCase()} dilinde girin`}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isFirst && (
              <button
                className="p-2 text-[#292A2D] hover:bg-white rounded-full transition-all duration-300"
                onClick={() => onMove('up')}
                title="Yukarı Taşı"
              >
                <ArrowUp size={20} />
              </button>
            )}
            {!isLast && (
              <button
                className="p-2 text-[#292A2D] hover:bg-white rounded-full transition-all duration-300"
                onClick={() => onMove('down')}
                title="Aşağı Taşı"
              >
                <ArrowDown size={20} />
              </button>
            )}
            <button
              className="p-2 text-[#292A2D] hover:bg-white rounded-full transition-all duration-300"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Genişlet' : 'Daralt'}
            >
              {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <button
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
              onClick={onDelete}
              title="Bölümü Sil"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-4">
            <textarea
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
              value={section.description?.[currentLanguage] || ''}
              onChange={handleDescriptionChange}
              placeholder={`Bölüm açıklamasını ${currentLanguage.toUpperCase()} dilinde girin (opsiyonel)`}
              rows={2}
            />
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-lg text-[#292A2D] mb-4">Sorular</h3>
            {section.fields.length === 0 ? (
              <div className="p-8 bg-gray-50 rounded-xl text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">Bu bölümde henüz hiç soru yok.</p>
                <button
                  className="inline-flex items-center px-4 py-2 bg-[#292A2D] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300"
                  onClick={() => handleAddField('text')}
                >
                  <Plus size={20} className="mr-2" />
                  İlk Soruyu Ekle
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <FieldBuilder
                    key={field.name}
                    field={field}
                    index={fieldIndex}
                    currentLanguage={currentLanguage}
                    onUpdate={(updatedField) => handleUpdateField(updatedField, fieldIndex)}
                    onDelete={() => handleDeleteField(fieldIndex)}
                    onMove={(direction) => handleMoveField(fieldIndex, direction)}
                    isFirst={fieldIndex === 0}
                    isLast={fieldIndex === section.fields.length - 1}
                    allFieldNames={section.fields.map(f => f.name).filter(name => name !== field.name)}
                    createNewOption={createNewOption}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#f3f1f0] p-6 rounded-xl">
            <h4 className="font-medium text-[#292A2D] mb-4">Soru Ekle</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { type: 'text', label: 'Metin' },
                { type: 'textarea', label: 'Geniş Metin' },
                { type: 'date', label: 'Tarih' },
                { type: 'boolean', label: 'Evet/Hayır' },
                { type: 'select', label: 'Çoktan Seçmeli' },
                { type: 'dynamicList', label: 'Dinamik Liste' }
              ].map(({ type, label }) => (
                <button 
                  key={type}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-white hover:bg-gray-50 rounded-lg text-[#292A2D] transition-all duration-300 border border-gray-200"
                  onClick={() => handleAddField(type as FieldType)}
                >
                  {getFieldTypeIcon(type as FieldType)}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};