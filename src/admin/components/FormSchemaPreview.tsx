// src/admin/components/FormSchemaPreview.tsx
import React from 'react';
import DynamicForm from '../../components/DynamicForm';
import { FormSchema } from '../../types';

interface FormSchemaPreviewProps {
  formSchema: FormSchema;
  currentLanguage: string;
}

export const FormSchemaPreview: React.FC<FormSchemaPreviewProps> = ({
  formSchema,
  currentLanguage
}) => {
  // Önizleme verisi için boş bir onSubmit fonksiyonu
  const handleSubmit = (data: any) => {
    console.log('Form verisi:', data);
    alert('Form gönderildi (Önizleme modu)');
  };

  return (
    <div>
      <p className="mb-4 text-gray-600">
        Bu, formunuzun nasıl görüneceğinin bir önizlemesidir. Formları doldurup "Gönder" düğmesine tıklayabilirsiniz, 
        ancak bu sadece bir simülasyondur ve veriler kaydedilmeyecektir.
      </p>

      <DynamicForm
        formSchema={formSchema}
        onSubmit={handleSubmit}
        initialData={{}}
      />
    </div>
  );
};