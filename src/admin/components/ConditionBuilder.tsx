import React from 'react';
import { Condition } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface ConditionBuilderProps {
  conditions: Condition[];
  availableFields: string[];
  onChange: (conditions: Condition[]) => void;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditions,
  availableFields,
  onChange
}) => {
  // Koşul alanını güncelle
  const handleConditionFieldChange = (index: number, field: string) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      field
    };
    onChange(updatedConditions);
  };

  // Koşul operatörünü güncelle
  const handleConditionOperatorChange = (index: number, operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains') => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      operator
    };
    onChange(updatedConditions);
  };

  // Koşul değerini güncelle
  const handleConditionValueChange = (index: number, value: string) => {
    const updatedConditions = [...conditions];
    const processedValue = value === 'true' ? true : value === 'false' ? false : value;
    updatedConditions[index] = {
      ...updatedConditions[index],
      value: processedValue
    };
    onChange(updatedConditions);
  };

  // Yeni koşul ekle
  const handleAddCondition = () => {
    onChange([
      ...conditions,
      {
        field: availableFields.length > 0 ? availableFields[0] : '',
        operator: 'eq',
        value: ''
      }
    ]);
  };

  // Koşul sil
  const handleDeleteCondition = (index: number) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    onChange(updatedConditions);
  };

  return (
    <div className="bg-[#f3f1f0] p-6 rounded-xl shadow-lg transition-all duration-300">
      <p className="text-sm text-[#292A2D] mb-4 font-medium">
        Bu alan, yalnızca belirli koşullar karşılandığında gösterilecektir. Koşul eklemezseniz, alan her zaman görünür olacaktır.
      </p>

      {conditions.length === 0 ? (
        <div className="text-center text-[#292A2D] opacity-75 mb-4 p-6 border-2 border-dashed border-[#292A2D] rounded-lg">
          Henüz koşul eklenmemiş.
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                  value={condition.field}
                  onChange={(e) => handleConditionFieldChange(index, e.target.value)}
                >
                  {availableFields.length === 0 ? (
                    <option value="">Kullanılabilir alan yok</option>
                  ) : (
                    availableFields.map(field => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))
                  )}
                </select>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                  value={condition.operator}
                  onChange={(e) => handleConditionOperatorChange(index, e.target.value as any)}
                >
                  <option value="eq">Eşittir (=)</option>
                  <option value="neq">Eşit Değildir (≠)</option>
                  <option value="gt">Büyüktür (&gt;)</option>
                  <option value="lt">Küçüktür (&lt;)</option>
                  <option value="contains">İçerir</option>
                </select>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#292A2D] focus:border-transparent transition-all duration-300"
                  value={condition.value === true ? 'true' : condition.value === false ? 'false' : condition.value || ''}
                  onChange={(e) => handleConditionValueChange(index, e.target.value)}
                  placeholder="Değer"
                />
              </div>
              <button
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                onClick={() => handleDeleteCondition(index)}
                title="Koşulu Sil"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full p-3 bg-[#292A2D] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddCondition}
        disabled={availableFields.length === 0}
      >
        <Plus size={20} />
        <span>Koşul Ekle</span>
      </button>
    </div>
  );
};