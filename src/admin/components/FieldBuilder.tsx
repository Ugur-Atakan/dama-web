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
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown, Trash2, Settings, Eye } from 'lucide-react';

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newName = e.target.value.replace(/\s+/g, '_').toLowerCase();
    onUpdate({
      ...field,
      name: newName
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newType = e.target.value as FieldType;
    onUpdate({
      ...field,
      type: newType,
      options: newType === 'select' && !field.options ? [createNewOption()] : field.options,
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

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onUpdate({
      ...field,
      label: {
        ...field.label,
        [currentLanguage]: e.target.value
      }
    });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onUpdate({
      ...field,
      placeholder: {
        ...field.placeholder || {},
        [currentLanguage]: e.target.value
      }
    });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onUpdate({
      ...field,
      required: e.target.checked
    });
  };

  const handleOptionsUpdate = (updatedOptions: FormOption[]) => {
    onUpdate({
      ...field,
      options: updatedOptions
    });
  };

  const handleConditionsUpdate = (updatedConditions: Condition[]) => {
    onUpdate({
      ...field,
      conditions: updatedConditions
    });
  };

  const handleDynamicListFieldsUpdate = (updatedFields: DynamicListField[]) => {
    onUpdate({
      ...field,
      fields: updatedFields
    });
  };

  const handleValidationUpdate = (key: string, value: any) => {
    onUpdate({
      ...field,
      validation: {
        ...field.validation || {},
        [key]: value
      }
    });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleConditionBuilderToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConditionBuilder(!showConditionBuilder);
  };

  const handleValidationBuilderToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowValidationBuilder(!showValidationBuilder);
  };

  const getFieldTypeLabel = (type: FieldType): string => {
    const types = {
      text: 'Metin',
      textarea: 'Geniş Metin',
      date: 'Tarih',
      boolean: 'Evet/Hayır',
      select: 'Çoktan Seçmeli',
      dynamicList: 'Dinamik Liste'
    };
    return types[type] || type;
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div 
        className="bg-[#f3f1f0] p-4 flex justify-between items-center cursor-pointer transition-all duration-300 hover:bg-opacity-90"
        onClick={toggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <span className="font-medium text-[#292A2D]">Soru {index + 1}:</span>
          <span className="text-[#292A2D]">{field.label[currentLanguage] || field.name}</span>
          <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-[#292A2D]">
            {getFieldTypeLabel(field.type)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!isFirst && (
            <button
              className="p-2 text-[#292A2D] hover:bg-white rounded-full transition-all duration-300"
              onClick={(e) => {e.stopPropagation(); onMove('up');}}
              title="Yukarı Taşı"
            >
              <ArrowUp size={18} />
            </button>
          )}
          {!isLast && (
            <button
              className="p-2 text-[#292A2D] hover:bg-white rounded-full transition-all duration-300"
              onClick={(e) => {e.stopPropagation(); onMove('down');}}
              title="Aşağı Taşı"
            >
              <ArrowDown size={18} />
            </button>
          )}
          <button
            className="p-2 text-[#292A2D] hover:bg-white rounded-full transition-all duration-300"
            onClick={(e) => {e.stopPropagation(); setIsCollapsed(!isCollapsed);}}
            title={isCollapsed ? "Genişlet" : "Daralt"}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          <button
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
            onClick={(e) => {e.stopPropagation(); onDelete();}}
            title="Soruyu Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Soru Sistem Kodu:</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                value={field.name}
                onChange={handleNameChange}
                onClick={(e) => e.stopPropagation()}
                placeholder="Soru için sistem kodu (otomatik oluşturulur)"
              />
              <p className="mt-2 text-xs text-gray-500">
                Bu kod, sistem tarafında kullanılacaktır. Otomatik oluşturulur, değiştirmeniz gerekmez.
              </p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Soru Tipi:</label>
              <select
                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Soru Metni ({currentLanguage.toUpperCase()}):
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                value={field.label[currentLanguage] || ''}
                onChange={handleLabelChange}
                onClick={(e) => e.stopPropagation()}
                placeholder={`Soru metnini ${currentLanguage.toUpperCase()} dilinde girin`}
              />
            </div>
            {(field.type === 'text' || field.type === 'textarea') && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Örnek/İpucu ({currentLanguage.toUpperCase()}):
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                  value={field.placeholder?.[currentLanguage] || ''}
                  onChange={handlePlaceholderChange}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`İpucu metnini ${currentLanguage.toUpperCase()} dilinde girin (opsiyonel)`}
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-[#292A2D] border-gray-300 rounded focus:ring-[#292A2D] transition-all duration-300"
                checked={field.required || false}
                onChange={handleRequiredChange}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="ml-2 text-sm text-gray-700">Zorunlu soru</span>
            </label>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Settings size={18} className="text-gray-600" />
                  <h4 className="font-medium text-gray-700">Doğrulama Kuralları (Opsiyonel)</h4>
                </div>
                <button
                  className="text-[#292A2D] hover:text-opacity-80 text-sm font-medium transition-all duration-300"
                  onClick={handleValidationBuilderToggle}
                >
                  {showValidationBuilder ? 'Gizle' : 'Göster'}
                </button>
              </div>
              
              {showValidationBuilder && (
                <div className="p-4 border-t border-gray-200">
                  {(field.type === 'text' || field.type === 'textarea') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Minimum Uzunluk:</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                          min="0"
                          value={field.validation?.minLength || ''}
                          onChange={(e) => handleValidationUpdate('minLength', parseInt(e.target.value) || '')}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Maksimum Uzunluk:</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                          min="0"
                          value={field.validation?.maxLength || ''}
                          onChange={(e) => handleValidationUpdate('maxLength', parseInt(e.target.value) || '')}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Pattern (RegEx):</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
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

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Eye size={18} className="text-gray-600" />
                  <h4 className="font-medium text-gray-700">Koşullu Gösterim (Opsiyonel)</h4>
                </div>
                <button
                  className="text-[#292A2D] hover:text-opacity-80 text-sm font-medium transition-all duration-300"
                  onClick={handleConditionBuilderToggle}
                >
                  {showConditionBuilder ? 'Gizle' : 'Göster'}
                </button>
              </div>
              
              {showConditionBuilder && (
                <div className="p-4 border-t border-gray-200">
                  <ConditionBuilder
                    conditions={field.conditions || []}
                    availableFields={allFieldNames}
                    onChange={handleConditionsUpdate}
                  />
                </div>
              )}
            </div>

            {field.type === 'select' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-700">Seçenekler</h4>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <OptionBuilder
                    options={field.options || []}
                    onChange={handleOptionsUpdate}
                    currentLanguage={currentLanguage}
                    createNewOption={createNewOption}
                  />
                </div>
              </div>
            )}

            {field.type === 'dynamicList' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-700">Alt Sorular</h4>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <DynamicListFieldsBuilder
                    fields={field.fields || []}
                    onChange={handleDynamicListFieldsUpdate}
                    currentLanguage={currentLanguage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};