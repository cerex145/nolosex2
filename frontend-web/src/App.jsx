import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas - Admin */}
      <Route
        path="/admin/dashboard"
        element={
          localStorage.getItem("role") === "ADMIN" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Rutas protegidas - Usuario */}
      <Route
        path="/home"
        element={
          localStorage.getItem("user") ? (
            <HomePage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;