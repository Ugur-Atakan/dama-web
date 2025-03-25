import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import FormSchemaList from '../admin/pages/forms/FormSchemaList';
import FormSchemaBuilder from '../admin/pages/forms/FormSchemaBuilder';
import UserManagement from '../admin/pages/users/UserList';
import AppointmentList from '../admin/pages/appointments/AppointmentList';
import FileManager from '../admin/pages/files/FileManager';
import Settings from '../admin/pages/settings/Settings';
import NewUser from '../admin/pages/users/NewUser';
import ApplicationList from '../admin/pages/applications';
import ApplicationDetails from '../admin/pages/applications/ApplicationDetails';
import ProtectedRoute from './ProtectedRoute';

export default function AdminRoutes() {
  return (
    <ProtectedRoute>
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Form Management */}
        <Route path="forms" element={<FormSchemaList />} />
        <Route path="forms/new" element={<FormSchemaBuilder />} />
        <Route path="forms/:id" element={<FormSchemaBuilder />} />

        <Route path='applications' element={<ApplicationList />} />
        <Route path='applications/:id' element={<ApplicationDetails />} />
        
        {/* User Management */}
        <Route path="users" element={<UserManagement />} />
        <Route path="users/new" element={<NewUser />} />

        
        {/* Appointment Management */}
        <Route path="appointments" element={<AppointmentList />} />
        
        {/* File Management */}
        <Route path="files" element={<FileManager />} />
        
        {/* Settings */}
        <Route path="settings" element={<Settings />} />
        
        {/* Default Route */}
        <Route path="*" element={<Navigate to="forms" replace />} />
      </Route>
    </Routes>
    </ProtectedRoute>
  );
}