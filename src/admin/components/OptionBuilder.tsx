// src/admin/components/OptionBuilder.tsx
import React from 'react';
import { FormOption } from '../../types';

interface OptionBuilderProps {
  options: FormOption[];
  onChange: (options: FormOption[]) => void;
  currentLanguage: string;
  createNewOption: () => FormOption;
}

export const OptionBuilder: React.FC<OptionBuilderProps> = ({
  options,
  onChange,
  currentLanguage,
  createNewOption
}) => {
  // Seçenek değerini güncelle
  const handleOptionValueChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      value
    };
    onChange(updatedOptions);
  };

  // Seçenek etiketini güncelle
  const handleOptionLabelChange = (index: number, label: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      label: {
        ...updatedOptions[index].label,
        [currentLanguage]: label
      }
    };
    onChange(updatedOptions);
  };

  // Yeni seçenek ekle
  const handleAddOption = () => {
    onChange([...options, createNewOption()]);
  };

  // Seçenek sil
  const handleDeleteOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    onChange(updatedOptions);
  };

  // Seçeneklerin sırasını değiştir
  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === options.length - 1)
    ) {
      return;
    }

    const updatedOptions = [...options];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap options
    [updatedOptions[index], updatedOptions[targetIndex]] = 
    [updatedOptions[targetIndex], updatedOptions[index]];
    
    onChange(updatedOptions);
  };

  return (
    <div className="bg-gray-50 p-3 rounded">
      {options.length === 0 ? (
        <div className="text-center text-gray-500 mb-3">
          Henüz seçenek eklenmemiş.
        </div>
      ) : (
        <div className="space-y-3 mb-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-1"
                  value={option.value}
                  onChange={(e) => handleOptionValueChange(index, e.target.value)}
                  placeholder="Değer (value)"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={option.label[currentLanguage] || ''}
                  onChange={(e) => handleOptionLabelChange(index, e.target.value)}
                  placeholder={`Etiket (${currentLanguage.toUpperCase()})`}
                />
              </div>
              <div className="flex flex-col space-y-1">
                {index !== 0 && (
                  <button
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => handleMoveOption(index, 'up')}
                    title="Yukarı Taşı"
                  >
                    ⬆️
                  </button>
                )}
                {index !== options.length - 1 && (
                  <button
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => handleMoveOption(index, 'down')}
                    title="Aşağı Taşı"
                  >
                    ⬇️
                  </button>
                )}
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteOption(index)}
                  title="Seçeneği Sil"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleAddOption}
      >
        Seçenek Ekle
      </button>
    </div>
  );
};