import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Calendar, Clock, CheckCircle } from 'lucide-react';
import { reservationAPI } from '../services/reservationAPI';

export default function ReservationForm({ espacio, onBack, onReservationSuccess }) {
  const [formData, setFormData] = useState({
    fecha_reserva: new Date().toISOString().split('T')[0], // Fecha de hoy en formato YYYY-MM-DD
    hora_inicio: '',
    hora_fin: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Motivos predefinidos
  const motivos = [
    'Clase Académica',
    'Proyecto de Investigación',
    'Estudio Grupal',
    'Evento Académico',
    'Deporte',
    'Proyecto Personal',
    'Práctica',
    'Otro'
  ];

  // Calcular precio estimado
  const calcularPrecio = () => {
    if (!formData.hora_inicio || !formData.hora_fin) return 0;
    
    const inicio = new Date(`2000-01-01T${formData.hora_inicio}`);
    const fin = new Date(`2000-01-01T${formData.hora_fin}`);
    const horas = (fin - inicio) / (1000 * 60 * 60);
    
    return horas * (espacio?.precio_por_hora || 0);
  };

  // Función para registrar usuario de Google
  const registrarUsuarioGoogle = async (user) => {
    try {
      const response = await fetch('http://localhost:8081/api/auth/google-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          googleId: user.googleId || user.email, // Usar email como Google ID si no hay uno
          email: user.email,
          nombre: user.firstName || user.nombre || 'Usuario',
          apellido: user.lastName || user.apellido || 'Google'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Usuario de Google registrado:', result);
        return result.user;
      } else {
        const error = await response.text();
        console.error('Error registrando usuario de Google:', error);
        throw new Error('Error registrando usuario de Google');
      }
    } catch (error) {
      console.error('Error en registro de Google:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones
      if (!formData.fecha_reserva || !formData.hora_inicio || !formData.hora_fin || !formData.motivo) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Validar que la fecha no sea anterior a hoy
      const fechaReserva = new Date(formData.fecha_reserva);
      
      // Validar que la fecha sea válida
      if (isNaN(fechaReserva.getTime())) {
        throw new Error('La fecha seleccionada no es válida');
      }
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaReserva < hoy) {
        throw new Error('La fecha de reserva no puede ser anterior a hoy');
      }

      // Validar que la hora de fin sea posterior a la hora de inicio
      if (formData.hora_fin <= formData.hora_inicio) {
        throw new Error('La hora de fin debe ser posterior a la hora de inicio');
      }

      // Obtener datos del usuario del localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.email) {
        throw new Error('Usuario no encontrado. Por favor, inicia sesión nuevamente.');
      }

      // Preparar datos de la reserva
      const reservaData = {
        usuarioId: user.id || 1, // Usar el ID del usuario logueado
        espacioId: espacio.id,
        fechaReserva: formData.fecha_reserva,
        horaInicio: formData.hora_inicio,
        horaFin: formData.hora_fin,
        motivo: formData.motivo,
        precioTotal: calcularPrecio(),
        observaciones: ''
      };

      // Si el usuario no tiene ID (usuario de Google), registrarlo primero
      if (!user.id && user.email) {
        console.log('Registrando usuario de Google:', user.email);
        const googleUser = await registrarUsuarioGoogle(user);
        if (googleUser && googleUser.id) {
          reservaData.usuarioId = googleUser.id;
          // Actualizar el usuario en localStorage
          localStorage.setItem('user', JSON.stringify(googleUser));
        } else {
          throw new Error('No se pudo registrar el usuario de Google');
        }
      }

      // Llamar a la API real
      console.log('Enviando reserva:', reservaData);
      const response = await reservationAPI.crearReserva(reservaData);
      
      console.log('Respuesta de la API:', response);
      
      setSuccess(true);
      
      // Llamar callback de éxito después de 2 segundos
      setTimeout(() => {
        onReservationSuccess && onReservationSuccess(response);
      }, 2000);

    } catch (err) {
      console.error('Error en reserva:', err);
      setError(err.message || 'Error al crear la reserva. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Establecer fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h2>
          <p className="text-gray-600 mb-6">
            Tu reserva ha sido enviada exitosamente. Recibirás una confirmación por email.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Volver a Espacios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservar Espacio</h1>
          <p className="text-gray-600">Completa los detalles de tu reserva</p>
        </div>

        {/* Información del Espacio */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{espacio?.nombre}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">{espacio?.ubicacion}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Capacidad: {espacio?.capacidad} personas</span>
            </div>
          </div>
          {espacio?.precio_por_hora > 0 && (
            <div className="mt-3 p-3 bg-white rounded-lg">
              <span className="text-sm font-medium text-gray-600">Precio estimado: </span>
              <span className="text-lg font-bold text-green-600">S/. {calcularPrecio().toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Fecha de reserva */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de reserva
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="fecha_reserva"
                  value={formData.fecha_reserva}
                  onChange={handleInputChange}
                  min={today}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la reserva
              </label>
              <select
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona un motivo</option>
                {motivos.map((motivo) => (
                  <option key={motivo} value={motivo}>{motivo}</option>
                ))}
              </select>
            </div>

            {/* Hora de inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de inicio
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Hora de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de fin
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="hora_fin"
                  value={formData.hora_fin}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Nota importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Recuerda que debes presentar tu carnet estudiantil al momento de usar el espacio reservado.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Confirmando...' : 'Confirmar reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
