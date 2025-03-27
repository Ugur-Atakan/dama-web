export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export const statusLabels: Record<string, string> = {
  'SCHEDULED': 'Planlandı',
  'COMPLETED': 'Tamamlandı',
  'CANCELLED': 'İptal Edildi'
};

export const statusClasses: Record<string, string> = {
  'SCHEDULED': 'bg-blue-100 text-blue-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800'
};