import React from 'react';
import { Search, Users, Clock, MapPin, Dumbbell, BookOpen, Wrench, Calendar } from 'lucide-react';
import TecIAChat from '../components/TecIAChat';
import InicioSection from './InicioSection';

// Componente para la sección de Inicio (dashboard principal)
export function InicioSectionWrapper({ user }) {
  return <InicioSection user={user} />;
}

// Componente para la sección de Horario
export function HorarioSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Horarios de Espacios
          </h1>
          <div className="text-center py-12">
            <Clock className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h3>
            <p className="text-gray-600">Esta sección mostrará los horarios de disponibilidad de todos los espacios.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para la sección de Mis Reservas
export function MisReservasSection() {
  const [reservas, setReservas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      // Conectar con la API real del backend
      const response = await fetch('http://localhost:8081/api/reservas/mis-reservas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('user')?.email || ''}`
        }
      });

      if (response.ok) {
        const reservasBackend = await response.json();
        // Convertir formato del backend al formato del frontend
        const reservasFormateadas = reservasBackend.map(reserva => ({
          id: reserva.id,
          espacio: { 
            nombre: reserva.espacioNombre, 
            ubicacion: reserva.espacioUbicacion 
          },
          fechaReserva: reserva.fechaReserva,
          horaInicio: reserva.horaInicio,
          horaFin: reserva.horaFin,
          motivo: reserva.motivo,
          estado: reserva.estado,
          precioTotal: reserva.precioTotal
        }));
        setReservas(reservasFormateadas);
      } else {
        // Si hay error, usar datos mock
        const mockReservas = [
          {
            id: 1,
            espacio: { nombre: "Laboratorio de Computación A", ubicacion: "Campus Norte - Edificio A" },
            fechaReserva: "2024-01-15",
            horaInicio: "09:00",
            horaFin: "11:00",
            motivo: "Clase Académica",
            estado: "CONFIRMADA",
            precioTotal: 100.00
          },
          {
            id: 2,
            espacio: { nombre: "Sala de Estudio Silenciosa", ubicacion: "Campus Norte - Biblioteca" },
            fechaReserva: "2024-01-16",
            horaInicio: "14:00",
            horaFin: "16:00",
            motivo: "Estudio Grupal",
            estado: "PENDIENTE",
            precioTotal: 40.00
          }
        ];
        setReservas(mockReservas);
      }
    } catch (err) {
      console.warn('Error cargando reservas, usando datos mock:', err);
      // Usar datos mock en caso de error
      const mockReservas = [
        {
          id: 1,
          espacio: { nombre: "Laboratorio de Computación A", ubicacion: "Campus Norte - Edificio A" },
          fechaReserva: "2024-01-15",
          horaInicio: "09:00",
          horaFin: "11:00",
          motivo: "Clase Académica",
          estado: "CONFIRMADA",
          precioTotal: 100.00
        }
      ];
      setReservas(mockReservas);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Mis Reservas
            </h1>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando reservas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Mis Reservas
          </h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {reservas.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes reservas</h3>
              <p className="text-gray-600">Cuando hagas una reserva, aparecerá aquí.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{reserva.espacio.nombre}</h3>
                      <p className="text-gray-600">{reserva.espacio.ubicacion}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                      {getEstadoTexto(reserva.estado)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <p className="text-gray-900">{new Date(reserva.fechaReserva).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                      <p className="text-gray-900">{reserva.horaInicio} - {reserva.horaFin}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                      <p className="text-gray-900">{reserva.motivo}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-green-600">
                      S/. {reserva.precioTotal.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      {reserva.estado === 'PENDIENTE' && (
                        <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium">
                          Cancelar
                        </button>
                      )}
                      <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para la sección de TecIA
export function TecIASection() {
  return <TecIAChat />;
}

// Componente para la sección de Mi Perfil
export function MiPerfilSection({ user }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Mi Perfil
          </h1>
          
          {user && (
            <div className="space-y-6">
              {/* Información del usuario */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
                    <p className="text-gray-900">Estudiante</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                    <p className="text-gray-900">Norte</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Reservas Activas</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Reservas Completadas</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Horas Reservadas</div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  Editar Perfil
                </button>
                <button className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}