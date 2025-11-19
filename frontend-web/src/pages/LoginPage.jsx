import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage({ onBack }) {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8081/api";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  // ✅ Check login solo una vez
  useEffect(() => {
    if (checked) return; // Evitar múltiples checks
    
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (user && role) {
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
    setChecked(true);
  }, []); // Sin dependencias - solo al montar

  // ============================================================
  // 🔹 LOGIN CON GOOGLE REAL
  // ============================================================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      // Decodificar JWT de Google
      const base64Url = credentialResponse.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const googleUser = JSON.parse(jsonPayload);

      console.log("Google User:", googleUser);

      // Validar correo institucional
      if (!googleUser.email || !googleUser.email.endsWith("@tecsup.edu.pe")) {
        setError("❌ Solo se permite correo institucional @tecsup.edu.pe");
        setLoading(false);
        return;
      }

      // Enviar a backend
      const response = await axios.post(`${API_BASE}/auth/google`, {
        googleId: googleUser.sub,
        email: googleUser.email,
        firstName: googleUser.given_name || "",
        lastName: googleUser.family_name || "",
        picture: googleUser.picture,
      });

      console.log("Backend Response:", response.data);

      const { user } = response.data;

      // Guardar datos
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role || "USER");
      localStorage.setItem("userId", user.id);

      // Redirigir según rol
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Error completo:", error);
      setError(
        "❌ " +
        (error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Error al iniciar sesión")
      );
    } finally {
      setLoading(false);
    }
  };

  // Error Google
  const handleGoogleError = () => {
    setError("❌ Error al iniciar sesión con Google");
  };

  // ============================================================
  // 🔹 UI UNIFICADA
  // ============================================================
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex animate-scale-in">

        {/* Columna izquierda */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 relative">

          {/* Botón volver */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              INICIAR SESIÓN
            </h1>

            {/* Google Login */}
            <div className="mb-4 w-full">
              {!loading && (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="pill"
                  locale="es"
                />
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Info */}
            <p className="text-gray-600 text-sm mt-4">
              Solo se permite acceso con correo institucional <b>@tecsup.edu.pe</b>
            </p>

            {loading && (
              <p className="text-blue-500 text-sm mt-2 font-semibold">
                ⏳ Iniciando sesión...
              </p>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="/Rectangle 2.png"
            alt="Campus Tecsup"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}