import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedForm, setExpandedForm] = useState(null);
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Başvuru durumları ve Türkçe karşılıkları
  const applicationStatuses = {
    PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-200' },
    ACTIVE: { label: 'Aktif', color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-200' },
    INPROGRESS: { label: 'İşlemde', color: 'bg-indigo-100 text-indigo-800', borderColor: 'border-indigo-200' },
    APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800', borderColor: 'border-green-200' },
    REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800', borderColor: 'border-red-200' },
    DOCTOR_APPROVAL: { label: 'Doktor Onayında', color: 'bg-purple-100 text-purple-800', borderColor: 'border-purple-200' },
    DOCTOR_REJECTION: { label: 'Doktor Reddi', color: 'bg-red-100 text-red-800', borderColor: 'border-red-200' },
    DOCTOR_PENDING: { label: 'Doktor Bekliyor', color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-200' },
    DOCTOR_INPROGRESS: { label: 'Doktor İnceliyor', color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-200' },
    DOCTOR_COMPLETED: { label: 'Doktor Tamamladı', color: 'bg-green-100 text-green-800', borderColor: 'border-green-200' },
  };

  // Mock data for application details - in a real application, you would fetch this from an API
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call like:
        // const response = await fetch(`/api/applications/${id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockApplication = {
          id: id,
          status: 'INPROGRESS',
          createdAt: '2024-05-14T11:20:00',
          updatedAt: '2024-05-18T10:15:00',
          user: {
            id: '3456',
            firstName: 'Zeynep',
            lastName: 'Kaya',
            email: 'zeynep@example.com',
            telephone: '+90 555 123 4567',
            address: 'Atatürk Caddesi No:123, Kadıköy, İstanbul',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          },
          statusHistory: [
            { status: 'PENDING', date: '2024-05-14T11:20:00', note: 'Başvuru alındı', by: 'Sistem' },
            { status: 'ACTIVE', date: '2024-05-15T09:30:00', note: 'Başvuru inceleme için aktifleştirildi', by: 'Ahmet Yıldız' },
            { status: 'INPROGRESS', date: '2024-05-18T10:15:00', note: 'Belgeler inceleniyor', by: 'Mehmet Öz' }
          ],
          submissions: [
            {
              id: 'form1',
              formSchemaId: 'schema1',
              formTitle: 'Kişisel Bilgiler Formu',
              submittedAt: '2024-05-14T12:30:00',
              data: {
                fullName: 'Zeynep Kaya',
                birthDate: '1990-05-15',
                gender: 'Kadın',
                nationality: 'TC',
                idNumber: '12345678901'
              }
            },
            {
              id: 'form2',
              formSchemaId: 'schema2',
              formTitle: 'Sağlık Geçmişi Formu',
              submittedAt: '2024-05-14T13:15:00',
              data: {
                existingConditions: 'Hipertansiyon',
                allergies: 'Penisilin alerjisi',
                medications: 'Lisinopril 10mg günde bir kez',
                surgeries: 'Apendektomi (2010)'
              }
            },
            {
              id: 'form3',
              formSchemaId: 'schema3',
              formTitle: 'Tedavi Onay Formu',
              submittedAt: '2024-05-14T14:00:00',
              data: {
                consentGiven: true,
                consentDate: '2024-05-14',
                additionalNotes: 'Tüm riskler tarafıma anlatıldı ve anladım.'
              }
            }
          ],
          files: [
            {
              id: 'file1',
              originalName: 'kimlik.pdf',
              path: '/uploads/kimlik.pdf',
              mimeType: 'application/pdf',
              size: 1240000,
              formId: 'form1',
              questionId: 'idDocument',
              createdAt: '2024-05-14T12:35:00'
            },
            {
              id: 'file2',
              originalName: 'saglik_raporu.pdf',
              path: '/uploads/saglik_raporu.pdf',
              mimeType: 'application/pdf',
              size: 2450000,
              formId: 'form2',
              questionId: 'healthDocument',
              createdAt: '2024-05-14T13:20:00'
            },
            {
              id: 'file3',
              originalName: 'tedavi_onay.pdf',
              path: '/uploads/tedavi_onay.pdf',
              mimeType: 'application/pdf',
              size: 980000,
              formId: 'form3',
              questionId: 'consentDocument',
              createdAt: '2024-05-14T14:05:00'
            }
          ]
        };
        
        setApplication(mockApplication);
        setNewStatus(mockApplication.status);
      } catch (err) {
        setError(err.message || 'Başvuru detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleStatusUpdate = () => {
    // In a real app, you would send this update to your API
    // const response = await fetch(`/api/applications/${id}/status`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus, note: statusNote })
    // });

    // For demo, just update the local state
    setApplication(prev => ({
      ...prev,
      status: newStatus,
      statusHistory: [
        {
          status: newStatus,
          date: new Date().toISOString(),
          note: statusNote,
          by: 'Demo Kullanıcı'
        },
        ...prev.statusHistory
      ],
      updatedAt: new Date().toISOString()
    }));

    setShowStatusUpdateModal(false);
    setStatusNote('');
  };

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

  // Dosya boyutunu formatlayan fonksiyon
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Form detaylarını genişleten/daralan fonksiyon
  const toggleFormExpand = (formId) => {
    if (expandedForm === formId) {
      setExpandedForm(null);
    } else {
      setExpandedForm(formId);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-medium text-red-800 mt-3">Başvuru Yüklenemedi</h2>
          <p className="text-red-700 mt-2">{error || 'Başvuru bulunamadı veya erişim izniniz yok.'}</p>
          <button
            onClick={() => navigate('/admin/applications')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Başvuru Listesine Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <button
            onClick={() => navigate('/admin/applications')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Başvuru Detayları</h1>
            <p className="text-sm text-gray-500">ID: {application.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Rapor İndir
          </button>
          
          <button
            onClick={() => setShowStatusUpdateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Durumu Güncelle
          </button>
        </div>
      </div>

      {/* Status and Date Information */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <div className="text-sm text-gray-500">Başvuru Durumu</div>
          <div className="mt-1 flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${applicationStatuses[application.status].color}`}>
              {applicationStatuses[application.status].label}
            </span>
            <button 
              onClick={() => setShowStatusHistory(!showStatusHistory)}
              className="ml-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
            >
              <History className="h-4 w-4 mr-1" />
              Durum Geçmişi
              {showStatusHistory ? 
                <ChevronUp className="h-4 w-4 ml-1" /> : 
                <ChevronDown className="h-4 w-4 ml-1" />
              }
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Oluşturulma Tarihi</div>
            <div className="mt-1 flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm font-medium">{formatDate(application.createdAt)}</span>
              <Clock className="h-4 w-4 text-gray-400 mx-1" />
              <span className="text-sm">{formatTime(application.createdAt)}</span>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">Son Güncelleme</div>
            <div className="mt-1 flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm font-medium">{formatDate(application.updatedAt)}</span>
              <Clock className="h-4 w-4 text-gray-400 mx-1" />
              <span className="text-sm">{formatTime(application.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status History */}
      {showStatusHistory && (
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="text-sm font-medium text-gray-700">Durum Geçmişi</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {application.statusHistory.map((history, index) => (
              <div key={index} className="px-4 py-3 flex items-start">
                <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${applicationStatuses[history.status].color}`}></div>
                <div className="flex-1">
                  <div className="flex items-center text-sm">
                    <span className={`font-medium ${applicationStatuses[history.status].color} px-2 py-0.5 rounded-full`}>
                      {applicationStatuses[history.status].label}
                    </span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-500">{formatDate(history.date)} {formatTime(history.date)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{history.note}</p>
                  <p className="text-xs text-gray-500">İşlemi yapan: {history.by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applicant Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="text-sm font-medium text-gray-700">Başvuran Bilgileri</h3>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-4">
                <img 
                  src={application.user.profileImage} 
                  alt={`${application.user.firstName} ${application.user.lastName}`} 
                  className="h-16 w-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-medium">
                    {application.user.firstName} {application.user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">Kullanıcı ID: {application.user.id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">E-posta</div>
                    <div className="text-sm">{application.user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Telefon</div>
                    <div className="text-sm">{application.user.telephone || 'Belirtilmemiş'}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Adres</div>
                    <div className="text-sm">{application.user.address || 'Belirtilmemiş'}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/admin/users/${application.user.id}`}
                  className="text-indigo-600 hover:text-indigo-900 inline-flex items-center text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Kullanıcı Profilini Görüntüle
                </Link>
              </div>
            </div>
          </div>
          
          {/* Files Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="text-sm font-medium text-gray-700">
                Yüklenen Dosyalar
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {application.files.length}
                </span>
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {application.files.map((file) => (
                <div key={file.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 bg-blue-100 text-blue-500 rounded-lg p-2">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{file.originalName}</h4>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {application.files.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-500 text-sm">Bu başvuru için henüz dosya yüklenmemiş.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Submissions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="text-sm font-medium text-gray-700">
                Form Bilgileri
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {application.submissions.length}
                </span>
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {application.submissions.map((submission) => (
                <div key={submission.id} className="p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFormExpand(submission.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 bg-indigo-100 text-indigo-500 rounded-lg p-2">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{submission.formTitle}</h4>
                        <p className="text-xs text-gray-500">
                          Gönderilme: {formatDate(submission.submittedAt)} {formatTime(submission.submittedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <button className="text-gray-400 hover:text-gray-600">
                      {expandedForm === submission.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {expandedForm === submission.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="rounded-md bg-gray-50 p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="mb-2">
                              <div className="text-xs font-medium text-gray-500 mb-1 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </div>
                              <div className="text-sm">
                                {typeof value === 'boolean' 
                                  ? (value ? 'Evet' : 'Hayır')
                                  : (value || 'Belirtilmemiş')
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Form Detayları
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {application.submissions.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-500 text-sm">Bu başvuru için henüz form gönderimi yapılmamış.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Add Comments Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="text-sm font-medium text-gray-700">Notlar ve Yorumlar</h3>
            </div>
            
            <div className="p-4">
              <textarea
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Bu başvuru hakkında not ekleyin..."
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Not Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Update Modal */}
      {showStatusUpdateModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Başvuru Durumunu Güncelle
                    </h3>
                    <div className="mt-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Yeni Durum
                      </label>
                      <select
                        id="status"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        {Object.entries(applicationStatuses).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                        Not (Opsiyonel)
                      </label>
                      <textarea
                        id="note"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Durum değişikliği hakkında not..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleStatusUpdate}
                >
                  Durumu Güncelle
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowStatusUpdateModal(false)}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;