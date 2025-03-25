// src/types.ts
/**
 * Form alanları için desteklenen veri tipleri
 */
export type FieldType = 
  | 'text'          // Düz metin
  | 'textarea'      // Geniş metin
  | 'date'          // Tarih
  | 'boolean'       // Evet/Hayır
  | 'select'        // Çoktan seçmeli
  | 'multiSelect'   // Çoklu seçim
  | 'dynamicList';  // Dinamik liste (çocuk bilgileri gibi)

/**
 * Seçenek tabanlı alanlar için seçenek
 */
export interface FormOption {
  /** Seçenek değeri (backend için kullanılır) */
  value: string;
  /** Dile göre seçenek etiketi */
  label: Record<string, string>; // Çoklu dil desteği için { tr: "Seçenek 1", en: "Option 1" }
}

/**
 * Koşullu gösterim için koşul
 */
export interface Condition {
  /** Bağlı olduğu alan adı */
  field: string;
  /** Operatör tipi */
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
  /** Karşılaştırılacak değer */
  value: any;
}

/**
 * Dinamik liste içindeki alt alanlar için tip
 */
export interface DynamicListField {
  /** Alt alan adı */
  name: string;
  /** Alt alan tipi */
  type: Exclude<FieldType, 'dynamicList'>;
  /** Dile göre alan etiketi */
  label: Record<string, string>;
  /** Dile göre placeholder */
  placeholder?: Record<string, string>;
  /** Seçenekler (select tipi için) */
  options?: FormOption[];
  /** Alan zorunlu mu? */
  required?: boolean;
  /** Validasyon kuralları */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    [key: string]: any;
  };
}

/**
 * Form alanı tanımı
 */
export interface FormField {
  /** Alan adı */
  name: string;
  /** Alan tipi */
  type: FieldType;
  /** Dile göre alan etiketi */
  label: Record<string, string>;
  /** Dile göre placeholder */
  placeholder?: Record<string, string>;
  /** Dile göre alan açıklaması */
  description?: Record<string, string>;
  /** Seçenekler (select tipi için) */
  options?: FormOption[];
  /** Validasyon kuralları */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    [key: string]: any;
  };
  /** Alan zorunlu mu? */
  required?: boolean;
  /** Koşullu gösterim için koşullar */
  conditions?: Condition[];
  /** Dinamik liste için alt alanlar */
  fields?: DynamicListField[];
}

/**
 * Form bölümü tanımı
 */
export interface FormSection {
  /** Bölüm ID */
  id: string;
  /** Dile göre bölüm başlığı */
  title: Record<string, string>;
  /** Dile göre bölüm açıklaması */
  description?: Record<string, string>;
  /** Bölümdeki alanlar */
  fields: FormField[];
}

/**
 * Form şeması tanımı
 */
export interface FormSchema {
  /** Form ID */
  id: string;
  /** Dile göre form başlığı */
  title: Record<string, string>;
  /** Dile göre form açıklaması */
  description?: Record<string, string>;
  /** Form bölümleri */
  sections: FormSection[];
}

/**
 * Form verisi tipi
 */
export type FormData = Record<string, any>;

/**
 * Form gönderim cevabı
 */
export interface FormSubmissionResponse {
  id: string;
  formId: string;
  data: FormData;
  submittedAt: string;
}

/**
 * Form görüntüleme modları
 */
export type FormViewMode = 'edit' | 'view' | 'preview';

/**
 * Form builder için tema ayarları
 */
export interface FormThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  spacing: number;
}