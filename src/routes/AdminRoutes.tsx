import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import FormSchemaList from "../admin/pages/FormSchemaList";
import FormSchemaBuilder from "../admin/pages/FormSchemaBuilder";

export default function AdminRoutes() {

  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="forms" element={<FormSchemaList />} />
          <Route path="forms/new" element={<FormSchemaBuilder />} />
          <Route path="forms/:id" element={<FormSchemaBuilder/>} />
          <Route path="*" element={<Navigate to="forms" replace />}
          />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}

