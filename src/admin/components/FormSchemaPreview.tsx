import React from 'react';
import DynamicForm from '../../components/DynamicForm';
import { FormSchema } from '../../types';
import { Eye, AlertCircle } from 'lucide-react';

interface FormSchemaPreviewProps {
  formSchema: FormSchema;
  currentLanguage: string;
}

export const FormSchemaPreview: React.FC<FormSchemaPreviewProps> = ({
  formSchema,
  currentLanguage
}) => {
  const handleSubmit = (data: any) => {
    console.log('Form verisi:', data);
    alert('Form gönderildi (Önizleme modu)');
  };

  return (
    <div className="bg-[#f3f1f0] rounded-xl p-6 shadow-lg">
      <div className="mb-6 flex items-start space-x-3 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex-shrink-0">
          <Eye className="h-6 w-6 text-[#292A2D]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#292A2D] mb-2">
            Form Önizleme
          </h3>
          <div className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Bu, formunuzun nasıl görüneceğinin bir önizlemesidir. Formları doldurup "Gönder" düğmesine tıklayabilirsiniz, 
              ancak bu sadece bir simülasyondur ve veriler kaydedilmeyecektir.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <DynamicForm
          formSchema={formSchema}
          onSubmit={handleSubmit}
          initialData={{}}
        />
      </div>
    </div>
  );
};