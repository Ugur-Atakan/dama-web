import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Search,
  Plus,
  Filter,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AppointmentList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Mock appointment data
  const appointments = [
    {
      id: 1,
      clientName: 'Mehmet Yılmaz',
      date: '2024-01-23',
      time: '10:00',
      type: 'Danışmanlık',
      location: 'Online',
      status: 'confirmed',
      notes: 'İlk görüşme'
    },
    {
      id: 2,
      clientName: 'Zeynep Kaya',
      date: '2024-01-23',
      time: '14:30',
      type: 'Takip',
      location: 'Ofis',
      status: 'pending',
      notes: 'Dosya incelemesi'
    },
    // Add more mock appointments as needed
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Randevu Yönetimi</h1>
          <p className="mt-2 text-sm text-gray-700">
            Tüm randevuları görüntüleyin, düzenleyin ve yönetin.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yeni Randevu
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Müşteri ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="confirmed">Onaylandı</option>
              <option value="pending">Beklemede</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointment List */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih & Saat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tür
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notlar
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.clientName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {appointment.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {appointment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {appointment.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(appointment.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status === 'confirmed' && 'Onaylandı'}
                        {appointment.status === 'pending' && 'Beklemede'}
                        {appointment.status === 'cancelled' && 'İptal Edildi'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;