import React, { useState } from 'react';
import { FolderOpen, File, Search, Upload, Download, Trash2, Share2, MoreVertical, Grid, List, Filter, FileText, FileImage, File as FilePdf, FileArchive } from 'lucide-react';

const FileManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState('all');

  // Mock files data
  const files = [
    {
      id: 1,
      name: 'Proje Raporu.pdf',
      type: 'pdf',
      size: '2.5 MB',
      modified: '2024-01-22 14:30',
      shared: true,
      icon: <FilePdf className="h-10 w-10 text-red-500" />
    },
    {
      id: 2,
      name: 'Toplantı Notları.docx',
      type: 'document',
      size: '524 KB',
      modified: '2024-01-21 09:15',
      shared: false,
      icon: <FileText className="h-10 w-10 text-blue-500" />
    },
    {
      id: 3,
      name: 'Sunum.pptx',
      type: 'presentation',
      size: '4.2 MB',
      modified: '2024-01-20 16:45',
      shared: true,
      icon: <FileText className="h-10 w-10 text-orange-500" />
    },
    {
      id: 4,
      name: 'Logo.png',
      type: 'image',
      size: '1.8 MB',
      modified: '2024-01-19 11:20',
      shared: false,
      icon: <FileImage className="h-10 w-10 text-green-500" />
    },
    // Add more mock files as needed
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dosya Yönetimi</h1>
          <p className="mt-2 text-sm text-gray-700">
            Tüm dosyalarınızı görüntüleyin, düzenleyin ve yönetin.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Upload className="h-5 w-5 mr-2" />
            Dosya Yükle
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
              placeholder="Dosya ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Tüm Dosyalar</option>
              <option value="document">Dokümanlar</option>
              <option value="image">Görseller</option>
              <option value="pdf">PDF'ler</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* File Display */}
      <div className="mt-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-4"
              >
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg mb-4">
                  {file.icon}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </h3>
                  <div className="relative">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{file.size}</span>
                  <span>{file.modified}</span>
                </div>
                <div className="absolute top-2 right-2">
                  {file.shared && (
                    <span className="inline-flex items-center p-1 rounded-full bg-blue-100 text-blue-500">
                      <Share2 className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Boyut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Değiştirilme
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paylaşım
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {file.icon}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {file.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {file.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.modified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.shared ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Paylaşıldı
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Özel
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-gray-400 hover:text-gray-500">
                          <Download className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-500">
                          <Share2 className="h-5 w-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;