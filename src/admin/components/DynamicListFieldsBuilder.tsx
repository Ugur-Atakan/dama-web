import React from 'react';
import { DynamicListField } from '../../types';
import { Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

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
    
    [updatedFields[index], updatedFields[targetIndex]] = 
    [updatedFields[targetIndex], updatedFields[index]];
    
    onChange(updatedFields);
  };

  return (
    <div className="bg-[#f3f1f0] p-6 rounded-xl shadow-lg transition-all duration-300">
      {fields.length === 0 ? (
        <div className="text-center text-[#292A2D] opacity-75 mb-4 p-6 border-2 border-dashed border-[#292A2D] rounded-lg">
          Henüz alt alan eklenmemiş.
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {fields.map((field, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-[#292A2D]">Alt Alan {index + 1}</h5>
                  <div className="flex space-x-2">
                    {index !== 0 && (
                      <button
                        className="p-2 text-gray-600 hover:text-[#292A2D] hover:bg-gray-100 rounded-full transition-all duration-300"
                        onClick={() => handleMoveField(index, 'up')}
                        title="Yukarı Taşı"
                      >
                        <ArrowUp size={18} />
                      </button>
                    )}
                    {index !== fields.length - 1 && (
                      <button
                        className="p-2 text-gray-600 hover:text-[#292A2D] hover:bg-gray-100 rounded-full transition-all duration-300"
                        onClick={() => handleMoveField(index, 'down')}
                        title="Aşağı Taşı"
                      >
                        <ArrowDown size={18} />
                      </button>
                    )}
                    <button
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                      onClick={() => handleDeleteField(index)}
                      title="Alt Alanı Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Alan ID:</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                      value={field.name}
                      onChange={(e) => handleFieldNameChange(index, e.target.value)}
                      placeholder="Alt alan ID"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Tip:</label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                      value={field.type}
                      onChange={(e) => handleFieldTypeChange(index, e.target.value)}
                    >
                      <option value="text">Metin</option>
                      <option value="date">Tarih</option>
                      <option value="boolean">Evet/Hayır</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Etiket ({currentLanguage.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                      value={field.label[currentLanguage] || ''}
                      onChange={(e) => handleFieldLabelChange(index, e.target.value)}
                      placeholder={`Etiketi ${currentLanguage.toUpperCase()} dilinde girin`}
                    />
                  </div>
                  {field.type === 'text' && (
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-700">
                        Placeholder ({currentLanguage.toUpperCase()}):
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                        value={field.placeholder?.[currentLanguage] || ''}
                        onChange={(e) => handleFieldPlaceholderChange(index, e.target.value)}
                        placeholder={`Placeholder ${currentLanguage.toUpperCase()} dilinde girin (opsiyonel)`}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-[#292A2D] border-gray-300 rounded focus:ring-[#292A2D] transition-all duration-300"
                      checked={field.required || false}
                      onChange={(e) => handleFieldRequiredChange(index, e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Zorunlu alan</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full p-3 bg-[#292A2D] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center space-x-2"
        onClick={handleAddField}
      >
        <Plus size={20} />
        <span>Alt Alan Ekle</span>
      </button>
    </div>
  );
};