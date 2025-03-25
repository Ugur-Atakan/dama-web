import React from 'react';
import { FormOption } from '../../types';
import { Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

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
  const handleOptionValueChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      value
    };
    onChange(updatedOptions);
  };

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

  const handleAddOption = () => {
    onChange([...options, createNewOption()]);
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    onChange(updatedOptions);
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === options.length - 1)
    ) {
      return;
    }

    const updatedOptions = [...options];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedOptions[index], updatedOptions[targetIndex]] = 
    [updatedOptions[targetIndex], updatedOptions[index]];
    
    onChange(updatedOptions);
  };

  return (
    <div className="bg-[#f3f1f0] p-6 rounded-xl shadow-lg transition-all duration-300">
      {options.length === 0 ? (
        <div className="text-center text-[#292A2D] opacity-75 mb-4 p-6 border-2 border-dashed border-[#292A2D] rounded-lg">
          Henüz seçenek eklenmemiş.
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Değer (value):
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                      value={option.value}
                      onChange={(e) => handleOptionValueChange(index, e.target.value)}
                      placeholder="Seçenek değeri"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Etiket ({currentLanguage.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                      value={option.label[currentLanguage] || ''}
                      onChange={(e) => handleOptionLabelChange(index, e.target.value)}
                      placeholder={`Etiket (${currentLanguage.toUpperCase()})`}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  {index !== 0 && (
                    <button
                      className="p-2 text-gray-600 hover:text-[#292A2D] hover:bg-gray-100 rounded-full transition-all duration-300"
                      onClick={() => handleMoveOption(index, 'up')}
                      title="Yukarı Taşı"
                    >
                      <ArrowUp size={18} />
                    </button>
                  )}
                  {index !== options.length - 1 && (
                    <button
                      className="p-2 text-gray-600 hover:text-[#292A2D] hover:bg-gray-100 rounded-full transition-all duration-300"
                      onClick={() => handleMoveOption(index, 'down')}
                      title="Aşağı Taşı"
                    >
                      <ArrowDown size={18} />
                    </button>
                  )}
                  <button
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                    onClick={() => handleDeleteOption(index)}
                    title="Seçeneği Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full p-3 bg-[#292A2D] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center space-x-2"
        onClick={handleAddOption}
      >
        <Plus size={20} />
        <span>Seçenek Ekle</span>
      </button>
    </div>
  );
};