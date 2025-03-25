// src/admin/components/FieldBuilder.tsx
import React, { useState } from 'react';
import { DynamicListFieldsBuilder } from './DynamicListFieldsBuilder';
import { OptionBuilder } from './OptionBuilder';
import { ConditionBuilder } from './ConditionBuilder';
import { 
  FormField, 
  FormOption, 
  Condition,
  DynamicListField, 
  FieldType 
} from '../../types';

interface FieldBuilderProps {
  field: FormField;
  index: number;
  currentLanguage: string;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  allFieldNames: string[];
  createNewOption: () => FormOption;
}

export const FieldBuilder: React.FC<FieldBuilderProps> = ({
  field,
  index,
  currentLanguage,
  onUpdate,
  onDelete,
  onMove,
  isFirst,
  isLast,
  allFieldNames,
  createNewOption
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showConditionBuilder, setShowConditionBuilder] = useState<boolean>(false);
  const [showValidationBuilder, setShowValidationBuilder] = useState<boolean>(false);

  // Soru sistem kodunu güncelle
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Olayın yukarı doğru yayılmasını engelliyoruz
    e.stopPropagation();
    
    const newName = e.target.value.replace(/\s+/g, '_').toLowerCase();
    onUpdate({
      ...field,
      name: newName
    });
  };

  // Soru tipini güncelle
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Olayın yukarı doğru yayılmasını engelliyoruz
    e.stopPropagation();
    
    const newType = e.target.value as FieldType;
    onUpdate({
      ...field,
      type: newType,
      // Eğer select tipine geçiliyorsa ve options yoksa, varsayılan options ekleyelim
      options: newType === 'select' && !field.options ? [createNewOption()] : field.options,
      // Eğer dynamicList tipine geçiliyorsa ve fields yoksa, varsayılan fields ekleyelim
      fields: newType === 'dynamicList' && !field.fields ? [
        {
          name: `subfield_${Date.now()}`,
          type: 'text',
          label: {
            tr: 'Alt Soru',
            en: 'Sub Question'
          },
          required: true
        }
      ] : field.fields
    });
  };

  // Soru metnini güncelle
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Olayın yukarı doğru yayılmasını engelliyoruz
    e.stopPropagation();
    
    onUpdate({
      ...field,
      label: {
        ...field.label,
        [currentLanguage]: e.target.value
      }
    });
  };

  // Örnek/İpucu metnini güncelle
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Olayın yukarı doğru yayılmasını engelliyoruz
    e.stopPropagation();
    
    onUpdate({
      ...field,
      placeholder: {
        ...field.placeholder || {},
        [currentLanguage]: e.target.value
      }
    });
  };

  // Zorunlu soru güncelle
  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Olayın yukarı doğru yayılmasını engelliyoruz
    e.stopPropagation();
    
    onUpdate({
      ...field,
      required: e.target.checked
    });
  };

  // Soru seçeneklerini güncelle
  const handleOptionsUpdate = (updatedOptions: FormOption[]) => {
    onUpdate({
      ...field,
      options: updatedOptions
    });
  };

  // Soru koşullarını güncelle
  const handleConditionsUpdate = (updatedConditions: Condition[]) => {
    onUpdate({
      ...field,
      conditions: updatedConditions
    });
  };

  // Dinamik liste alt sorularını güncelle
  const handleDynamicListFieldsUpdate = (updatedFields: DynamicListField[]) => {
    onUpdate({
      ...field,
      fields: updatedFields
    });
  };

  // Doğrulama kurallarını güncelle
  const handleValidationUpdate = (key: string, value: any) => {
    onUpdate({
      ...field,
      validation: {
        ...field.validation || {},
        [key]: value
      }
    });
  };

  // Daraltma/genişletme
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Koşul oluşturucu toggle
  const handleConditionBuilderToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConditionBuilder(!showConditionBuilder);
  };

  // Validasyon oluşturucu toggle
  const handleValidationBuilderToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowValidationBuilder(!showValidationBuilder);
  };

  return (
    <div className="border rounded overflow-hidden">
      <div 
        className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer" 
        onClick={toggleCollapse}
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-700 mr-2">Soru {index + 1}:</span>
          <span className="mr-2">{field.label[currentLanguage] || field.name}</span>
          <span className="px-2 py-1 bg-gray-200 rounded text-xs">
            {field.type === 'text' && 'Metin'}
            {field.type === 'textarea' && 'Geniş Metin'}
            {field.type === 'date' && 'Tarih'}
            {field.type === 'boolean' && 'Evet/Hayır'}
            {field.type === 'select' && 'Çoktan Seçmeli'}
            {field.type === 'dynamicList' && 'Dinamik Liste'}
          </span>
        </div>
        <div className="flex space-x-2">
          {!isFirst && (
            <button
              className="text-gray-700 hover:text-blue-600"
              onClick={(e) => {e.stopPropagation(); onMove('up');}}
              title="Yukarı Taşı"
            >
              ⬆️
            </button>
          )}
          {!isLast && (
            <button
              className="text-gray-700 hover:text-blue-600"
              onClick={(e) => {e.stopPropagation(); onMove('down');}}
              title="Aşağı Taşı"
            >
              ⬇️
            </button>
          )}
          <button
            className="text-gray-700 hover:text-blue-600"
            onClick={(e) => {e.stopPropagation(); setIsCollapsed(!isCollapsed);}}
            title={isCollapsed ? "Genişlet" : "Daralt"}
          >
            {isCollapsed ? '🔽' : '🔼'}
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={(e) => {e.stopPropagation(); onDelete();}}
            title="Soruyu Sil"
          >
            🗑️
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Soru Sistem Kodu:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={field.name}
                onChange={handleNameChange}
                onClick={(e) => e.stopPropagation()}
                placeholder="Soru için sistem kodu (otomatik oluşturulur)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bu kod, sistem tarafında kullanılacaktır. Otomatik oluşturulur, değiştirmeniz gerekmez.
              </p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Soru Tipi:</label>
              <select
                className="w-full p-2 border rounded"
                value={field.type}
                onChange={handleTypeChange}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="text">Metin</option>
                <option value="textarea">Geniş Metin</option>
                <option value="date">Tarih</option>
                <option value="boolean">Evet/Hayır</option>
                <option value="select">Çoktan Seçmeli</option>
                <option value="dynamicList">Dinamik Liste</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Soru Metni ({currentLanguage.toUpperCase()}):</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={field.label[currentLanguage] || ''}
                onChange={handleLabelChange}
                onClick={(e) => e.stopPropagation()}
                placeholder={`Soru metnini ${currentLanguage.toUpperCase()} dilinde girin`}
              />
            </div>
            {(field.type === 'text' || field.type === 'textarea') && (
              <div>
                <label className="block mb-1 text-sm font-medium">Örnek/İpucu ({currentLanguage.toUpperCase()}):</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={field.placeholder?.[currentLanguage] || ''}
                  onChange={handlePlaceholderChange}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`İpucu metnini ${currentLanguage.toUpperCase()} dilinde girin (opsiyonel)`}
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={field.required || false}
                onChange={handleRequiredChange}
                onClick={(e) => e.stopPropagation()}
              />
              Zorunlu soru
            </label>
          </div>

          {/* Doğrulama Kuralları */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Doğrulama Kuralları (Opsiyonel)</h4>
              <button
                className="text-blue-600 text-sm"
                onClick={handleValidationBuilderToggle}
              >
                {showValidationBuilder ? 'Gizle' : 'Göster'}
              </button>
            </div>
            
            {showValidationBuilder && (
              <div className="bg-gray-50 p-3 rounded">
                {(field.type === 'text' || field.type === 'textarea') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-xs">Minimum Uzunluk:</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        min="0"
                        value={field.validation?.minLength || ''}
                        onChange={(e) => handleValidationUpdate('minLength', parseInt(e.target.value) || '')}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs">Maksimum Uzunluk:</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        min="0"
                        value={field.validation?.maxLength || ''}
                        onChange={(e) => handleValidationUpdate('maxLength', parseInt(e.target.value) || '')}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs">Pattern (RegEx):</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={field.validation?.pattern || ''}
                        onChange={(e) => handleValidationUpdate('pattern', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Örn: ^[A-Za-z0-9]+$"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Koşullu Gösterim */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Koşullu Gösterim (Opsiyonel)</h4>
              <button
                className="text-blue-600 text-sm"
                onClick={handleConditionBuilderToggle}
              >
                {showConditionBuilder ? 'Gizle' : 'Göster'}
              </button>
            </div>
            
            {showConditionBuilder && (
              <ConditionBuilder
                conditions={field.conditions || []}
                availableFields={allFieldNames}
                onChange={handleConditionsUpdate}
              />
            )}
          </div>

          {/* Seçenek Oluşturucu (select tipi için) */}
          {field.type === 'select' && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Seçenekler</h4>
              <OptionBuilder
                options={field.options || []}
                onChange={handleOptionsUpdate}
                currentLanguage={currentLanguage}
                createNewOption={createNewOption}
              />
            </div>
          )}

          {/* Dinamik Liste Alt Soruları Oluşturucu */}
          {field.type === 'dynamicList' && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Alt Sorular</h4>
              <DynamicListFieldsBuilder
                fields={field.fields || []}
                onChange={handleDynamicListFieldsUpdate}
                currentLanguage={currentLanguage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};