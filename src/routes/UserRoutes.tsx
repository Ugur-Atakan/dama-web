import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { lazy } from "react";

const FormListPage = lazy(() => import("./../pages/FormListPage"));
const FormPage = lazy(() => import("./../pages/FormPage"));
const FormSuccessPage = lazy(() => import("./../pages/FormSuccessPage"));

export default function UserRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/forms" element={<FormListPage />} />
        <Route path="/forms/:formId" element={<FormPage />} />
        <Route path="/success" element={<FormSuccessPage />} />
      </Routes>
    </ProtectedRoute>
  );
}
