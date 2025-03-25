// src/admin/components/ConditionBuilder.tsx
import React from 'react';
import { Condition } from '../types';

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
    // Boolean değerler için otomatik dönüşüm
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
    <div className="bg-gray-50 p-3 rounded">
      <p className="text-sm text-gray-600 mb-3">
        Bu alan, yalnızca belirli koşullar karşılandığında gösterilecektir. Koşul eklemezseniz, alan her zaman görünür olacaktır.
      </p>

      {conditions.length === 0 ? (
        <div className="text-center text-gray-500 mb-3">
          Henüz koşul eklenmemiş.
        </div>
      ) : (
        <div className="space-y-3 mb-3">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <select
                  className="p-2 border rounded"
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
                  className="p-2 border rounded"
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
                  className="p-2 border rounded"
                  value={condition.value === true ? 'true' : condition.value === false ? 'false' : condition.value || ''}
                  onChange={(e) => handleConditionValueChange(index, e.target.value)}
                  placeholder="Değer"
                />
              </div>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDeleteCondition(index)}
                title="Koşulu Sil"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleAddCondition}
        disabled={availableFields.length === 0}
      >
        Koşul Ekle
      </button>
    </div>
  );
};
