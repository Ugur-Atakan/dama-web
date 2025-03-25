
// src/admin/components/SectionBuilder.tsx (değiştirilmiş terminoloji)
import React, { useState } from 'react';
import { FieldBuilder } from './FieldBuilder';
import { FormSection, FormField, FormOption, FieldType } from '../../types';

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

  // Bölüm başlığını güncelle
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      title: {
        ...section.title,
        [currentLanguage]: e.target.value
      }
    });
  };

  // Bölüm açıklamasını güncelle
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...section,
      description: {
        ...section.description || {},
        [currentLanguage]: e.target.value
      }
    });
  };

  // Yeni soru ekle
  const handleAddField = (type: FieldType = 'text') => {
    onUpdate({
      ...section,
      fields: [...section.fields, createNewField(type)]
    });
  };

  // Soruyu güncelle
  const handleUpdateField = (updatedField: FormField, fieldIndex: number) => {
    onUpdate({
      ...section,
      fields: section.fields.map((field, idx) => 
        idx === fieldIndex ? updatedField : field
      )
    });
  };

  // Soruyu sil
  const handleDeleteField = (fieldIndex: number) => {
    onUpdate({
      ...section,
      fields: section.fields.filter((_, idx) => idx !== fieldIndex)
    });
  };

  // Soruların sırasını değiştir
  const handleMoveField = (fieldIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && fieldIndex === 0) || 
      (direction === 'down' && fieldIndex === section.fields.length - 1)
    ) {
      return;
    }

    const updatedFields = [...section.fields];
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    // Swap fields
    [updatedFields[fieldIndex], updatedFields[targetIndex]] = 
    [updatedFields[targetIndex], updatedFields[fieldIndex]];
    
    onUpdate({
      ...section,
      fields: updatedFields
    });
  };

  return (
    <div className="bg-white rounded shadow mb-4 overflow-hidden">
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium text-gray-700 mr-2">Bölüm {index + 1}:</span>
          <input
            type="text"
            className="px-2 py-1 border rounded"
            value={section.title[currentLanguage] || ''}
            onChange={handleTitleChange}
            placeholder={`Bölüm başlığını ${currentLanguage.toUpperCase()} dilinde girin`}
          />
        </div>
        <div className="flex space-x-2">
          {!isFirst && (
            <button
              className="text-gray-700 hover:text-blue-600"
              onClick={() => onMove('up')}
              title="Yukarı Taşı"
            >
              ⬆️
            </button>
          )}
          {!isLast && (
            <button
              className="text-gray-700 hover:text-blue-600"
              onClick={() => onMove('down')}
              title="Aşağı Taşı"
            >
              ⬇️
            </button>
          )}
          <button
            className="text-gray-700 hover:text-blue-600"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Genişlet' : 'Daralt'}
          >
            {isCollapsed ? '🔽' : '🔼'}
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={onDelete}
            title="Bölümü Sil"
          >
            🗑️
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Bölüm Açıklaması (Opsiyonel):</label>
            <textarea
              className="w-full p-2 border rounded"
              value={section.description?.[currentLanguage] || ''}
              onChange={handleDescriptionChange}
              placeholder={`Bölüm açıklamasını ${currentLanguage.toUpperCase()} dilinde girin (opsiyonel)`}
              rows={2}
            />
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Sorular</h3>
            {section.fields.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                Bu bölümde henüz hiç soru yok. Soru ekleyin.
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

          <div className="bg-gray-50 p-3 rounded">
            <h4 className="font-medium mb-2">Soru Ekle</h4>
            <div className="grid grid-cols-3 gap-2">
              <button 
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
                onClick={() => handleAddField('text')}
              >
                Metin
              </button>
              <button 
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
                onClick={() => handleAddField('textarea')}
              >
                Geniş Metin
              </button>
              <button 
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
                onClick={() => handleAddField('date')}
              >
                Tarih
              </button>
              <button 
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
                onClick={() => handleAddField('boolean')}
              >
                Evet/Hayır
              </button>
              <button 
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
                onClick={() => handleAddField('select')}
              >
                Çoktan Seçmeli
              </button>
              <button 
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
                onClick={() => handleAddField('dynamicList')}
              >
                Dinamik Liste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};