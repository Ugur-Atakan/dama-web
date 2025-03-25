import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import AdminLogin from "../admin/pages/AdminLogin";
import UserLogin from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ana sayfa yönlendirmesini ekleyin */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}