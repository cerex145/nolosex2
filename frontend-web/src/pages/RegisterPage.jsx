import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock } from 'lucide-react';
import { authAPI } from '../services/api';

function RegisterPage({ onBack, onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      const { confirmPassword, ...userData } = formData;
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      alert(`¡Registro exitoso! Bienvenido ${user.firstName}`);
      onRegisterSuccess(user);
    } catch (err) {
      setError(err.response?.data || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Función de Google Login próximamente');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {/* Card Principal con dos columnas */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex animate-scale-in">
        
        {/* Columna Izquierda - Formulario */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 relative">
          {/* Botón Volver */}
          <button 
            onClick={onBack} 
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="mt-8">
            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              REGISTRARSE
            </h1>

            {/* Botón Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-300 rounded-full py-3 px-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium text-sm">iniciar sesión con google</span>
            </button>

            {/* Separador */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">o</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nombres y Apellidos en grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Juan"
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Pérez"
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu-email@tecsup.edu.pe"
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="987654321"
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400 text-white py-3 rounded-full font-medium hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
              >
                {loading ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </form>

            {/* Link a Login */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-xs">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={onSwitchToLogin} 
                  className="text-cyan-500 font-semibold hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Imagen Tecsup */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src="/Rectangle 2.png" 
            alt="Campus Tecsup" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;