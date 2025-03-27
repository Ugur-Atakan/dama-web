import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, ArrowRight, Clock } from 'lucide-react';
import { DashboardStats, RecentApplication, UpcomingAppointment } from '../../types/dashboard';
import { mockStats, mockRecentApplications, mockUpcomingAppointments } from '../../data/mockDashboardData';
import { statusClasses, statusLabels } from '../../types/application';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockStats);
      setRecentApplications(mockRecentApplications);
      setUpcomingAppointments(mockUpcomingAppointments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#292A2D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="bg-gradient-to-r from-[#292A2D] to-gray-800 rounded-xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz 👋</h1>
          <p className="text-gray-200 mb-6">
            Bugün {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-lg">
              <FileText className="w-6 h-6 mb-2" />
              <p className="text-sm text-gray-200">Aktif Başvuru</p>
              <p className="text-2xl font-bold">{stats?.activeApplications || 0}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-lg">
              <Users className="w-6 h-6 mb-2" />
              <p className="text-sm text-gray-200">Müvekkil Sayısı</p>
              <p className="text-2xl font-bold">{stats?.totalClients || 0}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-lg">
              <Calendar className="w-6 h-6 mb-2" />
              <p className="text-sm text-gray-200">Randevu Sayısı</p>
              <p className="text-2xl font-bold">{stats?.totalAppointments || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Son Başvurular</h2>
                <p className="text-sm text-gray-500">Son 7 günün başvuruları</p>
              </div>
              <button className="text-sm text-[#292A2D] hover:text-[#292A2D]/80 flex items-center">
                Tümünü Gör
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{application.clientName}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(application.date).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[application.status]}`}>
                    {statusLabels[application.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Yaklaşan Randevular</h2>
                <p className="text-sm text-gray-500">Bugün ve sonraki randevular</p>
              </div>
              <button className="text-sm text-[#292A2D] hover:text-[#292A2D]/80 flex items-center">
                Tümünü Gör
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{appointment.clientName}</p>
                    <div className="flex items-center text-sm font-medium text-[#292A2D]">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(appointment.date).toLocaleDateString('tr-TR')}
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-500 mt-2 bg-white p-2 rounded">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}