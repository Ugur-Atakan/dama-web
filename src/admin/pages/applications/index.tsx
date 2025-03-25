import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Download
} from 'lucide-react';

const ApplicationList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock başvuru verileri
  const applications = [
    {
      id: '1a2b3c4d-5e6f-7g8h-9i0j',
      applicant: {
        id: '1234',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'PENDING',
      formCount: 3,
      fileCount: 2,
      createdAt: '2024-05-15T10:30:00',
      updatedAt: '2024-05-16T09:45:00'
    },
    {
      id: '2b3c4d5e-6f7g-8h9i-0j1k',
      applicant: {
        id: '5678',
        name: 'Ayşe Demir',
        email: 'ayse@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'APPROVED',
      formCount: 5,
      fileCount: 4,
      createdAt: '2024-05-10T14:20:00',
      updatedAt: '2024-05-17T11:30:00'
    },
    {
      id: '3c4d5e6f-7g8h-9i0j-1k2l',
      applicant: {
        id: '9012',
        name: 'Mehmet Öz',
        email: 'mehmet@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'REJECTED',
      formCount: 2,
      fileCount: 1,
      createdAt: '2024-05-12T09:15:00',
      updatedAt: '2024-05-14T16:45:00'
    },
    {
      id: '4d5e6f7g-8h9i-0j1k-2l3m',
      applicant: {
        id: '3456',
        name: 'Zeynep Kaya',
        email: 'zeynep@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'INPROGRESS',
      formCount: 4,
      fileCount: 3,
      createdAt: '2024-05-14T11:20:00',
      updatedAt: '2024-05-18T10:15:00'
    },
  ];

  // Başvuru durumları ve Türkçe karşılıkları
  const applicationStatuses = {
    PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
    ACTIVE: { label: 'Aktif', color: 'bg-blue-100 text-blue-800' },
    INPROGRESS: { label: 'İşlemde', color: 'bg-indigo-100 text-indigo-800' },
    APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
    DOCTOR_APPROVAL: { label: 'Doktor Onayında', color: 'bg-purple-100 text-purple-800' },
    DOCTOR_REJECTION: { label: 'Doktor Reddi', color: 'bg-red-100 text-red-800' },
    DOCTOR_PENDING: { label: 'Doktor Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
    DOCTOR_INPROGRESS: { label: 'Doktor İnceliyor', color: 'bg-blue-100 text-blue-800' },
    DOCTOR_COMPLETED: { label: 'Doktor Tamamladı', color: 'bg-green-100 text-green-800' },
  };

  // Tarih aralıkları
  const dateRanges = {
    all: { label: 'Tüm Tarihler' },
    today: { label: 'Bugün' },
    week: { label: 'Bu Hafta' },
    month: { label: 'Bu Ay' },
    custom: { label: 'Özel Tarih Aralığı' }
  };

  // Filtrelenmiş başvurular
  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;
    
    // Basit tarih filtresi (gerçek uygulamada daha detaylı olabilir)
    let matchesDate = true;
    const applicationDate = new Date(application.createdAt);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setDate(today.getDate() - 30);

    if (dateRange === 'today') {
      matchesDate = applicationDate.toDateString() === today.toDateString();
    } else if (dateRange === 'week') {
      matchesDate = applicationDate >= weekAgo;
    } else if (dateRange === 'month') {
      matchesDate = applicationDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Tarih formatlamak için yardımcı fonksiyon
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Saat formatlamak için yardımcı fonksiyon
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('tr-TR', options);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Başvurular</h1>
          <p className="mt-2 text-sm text-gray-700">
            Sistemdeki tüm başvuruları görüntüleyin, filtreleyerek arayın ve detaylarını inceleyin.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/applications/export"
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Download className="h-5 w-5 mr-2" />
            Rapor İndir
          </Link>
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
              placeholder="Başvuran adı, e-posta veya ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                {Object.entries(applicationStatuses).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {Object.entries(dateRanges).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başvuran
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formlar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Güncelleme
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  {/* Applicant info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={application.applicant.avatar} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.applicant.name}</div>
                        <div className="text-sm text-gray-500">{application.applicant.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${applicationStatuses[application.status].color}`}>
                      {applicationStatuses[application.status].label}
                    </span>
                  </td>
                  
                  {/* Forms and Files */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{application.formCount} Form</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{application.fileCount} Dosya</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatDate(application.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatTime(application.createdAt)}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Last Updated */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatDate(application.updatedAt)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatTime(application.updatedAt)}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/applications/${application.id}`}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">Görüntüle</span>
                      </Link>
                      
                      <div className="relative group">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Daha Fazla</span>
                        </button>
                        
                        {/* Dropdown menu - in real app would be implemented with state */}
                        <div className="hidden group-hover:block absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <Link
                              to={`/admin/applications/${application.id}/status`}
                              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                              role="menuitem"
                            >
                              Durum Değiştir
                            </Link>
                            {application.status !== 'APPROVED' && (
                              <button
                                className="text-green-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                              >
                                <CheckCircle className="h-4 w-4 inline mr-2" />
                                Onayla
                              </button>
                            )}
                            {application.status !== 'REJECTED' && (
                              <button
                                className="text-red-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                              >
                                <XCircle className="h-4 w-4 inline mr-2" />
                                Reddet
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="px-6 py-10 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Başvuru Bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun başvuru bulunamadı.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setDateRange('all');
                }}
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination - Simple version */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Önceki
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sonraki
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Toplam <span className="font-medium">{filteredApplications.length}</span> başvuru gösteriliyor
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Önceki</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Sonraki</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationList;