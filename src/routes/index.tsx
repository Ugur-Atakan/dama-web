// AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminLoginPage from "../pages/admin/components/auth/LoginPage";
import DashboardPage from "../pages/admin/components/dashboard/DashboardPage";
import ApplicationsPage from "../pages/admin/components/applications/ApplicationsPage";
import ClientsPage from "../pages/admin/components/clients/ClientsPage";
import AppointmentsPage from "../pages/admin/components/appointments/AppointmentsPage";
import Settings from "../pages/admin/components/settings";
import PreApplicationForm from "../pages/PreApplicationForm";
import ApplicationForm from "../pages/ApplicationForm";
import NotificationsPage from "../pages/admin/components/notifications";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/" element={<Login />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<NotificationsPage/>} />
      </Route>
      
      {/* User routes */}
      <Route path="/forms/pre-application" element={
        <ProtectedRoute>
          <PreApplicationForm />
        </ProtectedRoute>
      } />
      <Route path="/forms/application-form" element={
        <ProtectedRoute>
          <ApplicationForm />
        </ProtectedRoute>
      } />
      
      {/* Redirects */}
      <Route path="/" element={<Navigate to="/forms/pre-application" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}