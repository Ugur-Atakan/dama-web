export interface DashboardStats {
  activeApplications: number;
  totalClients: number;
  totalAppointments: number;
}

export interface RecentApplication {
  id: string;
  clientName: string;
  date: string;
  status: string;
}

export interface UpcomingAppointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  notes?: string;
}