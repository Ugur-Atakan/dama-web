// src/admin/components/DynamicListFieldsBuilder.tsx
import React from 'react';
import { DynamicListField } from '../../types';

interface DynamicListFieldsBuilderProps {
  fields: DynamicListField[];
  onChange: (fields: DynamicListField[]) => void;
  currentLanguage: string;
}

export const DynamicListFieldsBuilder: React.FC<DynamicListFieldsBuilderProps> = ({
  fields,
  onChange,
  currentLanguage
}) => {
  // Alan adını güncelle
  const handleFieldNameChange = (index: number, name: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      name: name.replace(/\s+/g, '_').toLowerCase()
    };
    onChange(updatedFields);
  };

  // Alan tipini güncelle
  const handleFieldTypeChange = (index: number, type: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      type: type as any
    };
    onChange(updatedFields);
  };

  // Alan etiketini güncelle
  const handleFieldLabelChange = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      label: {
        ...updatedFields[index].label,
        [currentLanguage]: value
      }
    };
    onChange(updatedFields);
  };

  // Alan placeholder'ını güncelle
  const handleFieldPlaceholderChange = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      placeholder: {
        ...updatedFields[index].placeholder || {},
        [currentLanguage]: value
      }
    };
    onChange(updatedFields);
  };

  // Alan zorunluluğunu güncelle
  const handleFieldRequiredChange = (index: number, required: boolean) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      required
    };
    onChange(updatedFields);
  };

  // Yeni alt alan ekle
  const handleAddField = () => {
    onChange([
      ...fields,
      {
        name: `subfield_${Date.now()}`,
        type: 'text',
        label: {
          tr: 'Yeni Alt Alan',
          en: 'New Sub Field'
        },
        required: false
      }
    ]);
  };

  // Alt alan sil
  const handleDeleteField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    onChange(updatedFields);
  };

  // Alt alanların sırasını değiştir
  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }

    const updatedFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap fields
    [updatedFields[index], updatedFields[targetIndex]] = 
    [updatedFields[targetIndex], updatedFields[index]];
    
    onChange(updatedFields);
  };

  return (
    <div className="bg-gray-50 p-3 rounded">
      {fields.length === 0 ? (
        <div className="text-center text-gray-500 mb-3">
          Henüz alt alan eklenmemiş.
        </div>
      ) : (
        <div className="space-y-4 mb-3">
          {fields.map((field, index) => (
            <div key={index} className="border rounded p-3 bg-white">
              <div className="flex justify-between mb-2">
                <h5 className="font-medium">Alt Alan {index + 1}</h5>
                <div className="flex space-x-2">
                  {index !== 0 && (
                    <button
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => handleMoveField(index, 'up')}
                      title="Yukarı Taşı"
                    >
                      ⬆️
                    </button>
                  )}
                  {index !== fields.length - 1 && (
                    <button
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => handleMoveField(index, 'down')}
                      title="Aşağı Taşı"
                    >
                      ⬇️
                    </button>
                  )}
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteField(index)}
                    title="Alt Alanı Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block mb-1 text-xs font-medium">Alan ID:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={field.name}
                    onChange={(e) => handleFieldNameChange(index, e.target.value)}
                    placeholder="Alt alan ID"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium">Tip:</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={field.type}
                    onChange={(e) => handleFieldTypeChange(index, e.target.value)}
                  >
                    <option value="text">Metin</option>
                    <option value="date">Tarih</option>
                    <option value="boolean">Evet/Hayır</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-2">
                <div>
                  <label className="block mb-1 text-xs font-medium">Etiket ({currentLanguage.toUpperCase()}):</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={field.label[currentLanguage] || ''}
                    onChange={(e) => handleFieldLabelChange(index, e.target.value)}
                    placeholder={`Etiketi ${currentLanguage.toUpperCase()} dilinde girin`}
                  />
                </div>
                {field.type === 'text' && (
                  <div>
                    <label className="block mb-1 text-xs font-medium">Placeholder ({currentLanguage.toUpperCase()}):</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={field.placeholder?.[currentLanguage] || ''}
                      onChange={(e) => handleFieldPlaceholderChange(index, e.target.value)}
                      placeholder={`Placeholder ${currentLanguage.toUpperCase()} dilinde girin (opsiyonel)`}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={field.required || false}
                    onChange={(e) => handleFieldRequiredChange(index, e.target.checked)}
                  />
                  Zorunlu alan
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleAddField}
      >
        Alt Alan Ekle
      </button>
    </div>
  );
};