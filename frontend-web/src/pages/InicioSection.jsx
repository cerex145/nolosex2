import React from 'react';
import { Search, Users, Clock, MapPin, Dumbbell, BookOpen, Wrench, Calendar } from 'lucide-react';
import ReservationForm from '../components/ReservationForm';
import { mockData } from '../services/reservationAPI';

export default function InicioSection({ user, onShowReservationForm }) {
  const [selectedCategory, setSelectedCategory] = React.useState('Todos');
  const [selectedSpace, setSelectedSpace] = React.useState(null);
  const [showReservationForm, setShowReservationForm] = React.useState(false);

  const categories = [
    { id: 'Todos', label: 'Todos', icon: null },
    { id: 'Laboratorio', label: 'Laboratorio', icon: Wrench },
    { id: 'Cancha Deportiva', label: 'Deportivos', icon: Dumbbell },
    { id: 'Sala de Estudio', label: 'Sala de Estudio', icon: BookOpen },
    { id: 'Auditorio', label: 'Auditorio', icon: Users }
  ];

  // Cargar espacios desde el backend
  React.useEffect(() => {
    const cargarEspacios = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/espacios');
        if (response.ok) {
          const espaciosBackend = await response.json();
          // Convertir formato del backend al formato del frontend
          const espaciosFormateados = espaciosBackend.map(espacio => ({
            id: espacio.id,
            name: espacio.nombre,
            category: espacio.tipoEspacioNombre,
            location: espacio.ubicacion,
            capacity: espacio.capacidad,
            status: 'Disponible',
            precio_por_hora: espacio.precioPorHora,
            descripcion: espacio.descripcion,
            equipamiento: espacio.equipamiento,
            icon: getIconForCategory(espacio.tipoEspacioNombre)
          }));
          setSpaces(espaciosFormateados);
        } else {
          // Si hay error, usar datos mock
          const espaciosMock = mockData.espacios.map(espacio => ({
            id: espacio.id,
            name: espacio.nombre,
            category: espacio.tipo_espacio,
            location: espacio.ubicacion,
            capacity: espacio.capacidad,
            status: 'Disponible',
            precio_por_hora: espacio.precio_por_hora,
            descripcion: espacio.descripcion,
            equipamiento: espacio.equipamiento,
            icon: getIconForCategory(espacio.tipo_espacio)
          }));
          setSpaces(espaciosMock);
        }
      } catch (error) {
        console.warn('Error cargando espacios, usando datos mock:', error);
        // Usar datos mock en caso de error
        const espaciosMock = mockData.espacios.map(espacio => ({
          id: espacio.id,
          name: espacio.nombre,
          category: espacio.tipo_espacio,
          location: espacio.ubicacion,
          capacity: espacio.capacidad,
          status: 'Disponible',
          precio_por_hora: espacio.precio_por_hora,
          descripcion: espacio.descripcion,
          equipamiento: espacio.equipamiento,
          icon: getIconForCategory(espacio.tipo_espacio)
        }));
        setSpaces(espaciosMock);
      }
    };

    cargarEspacios();
  }, []);

  const [spaces, setSpaces] = React.useState([]);

  // Función para obtener el ícono según la categoría
  function getIconForCategory(category) {
    switch (category) {
      case 'Laboratorio':
        return Wrench;
      case 'Cancha Deportiva':
        return Dumbbell;
      case 'Sala de Estudio':
        return BookOpen;
      case 'Auditorio':
        return Users;
      default:
        return Wrench;
    }
  }

  const filteredSpaces = spaces.filter(space => 
    selectedCategory === 'Todos' || space.category === selectedCategory
  );

  const handleReserveSpace = (space) => {
    setSelectedSpace(space);
    setShowReservationForm(true);
  };

  const handleBackFromReservation = () => {
    setShowReservationForm(false);
    setSelectedSpace(null);
  };

  const handleReservationSuccess = (reservaData) => {
    console.log('Reserva exitosa:', reservaData);
    setShowReservationForm(false);
    setSelectedSpace(null);
    // Aquí podrías mostrar una notificación de éxito
    alert('¡Reserva confirmada exitosamente!');
  };

  // Si se está mostrando el formulario de reserva
  if (showReservationForm && selectedSpace) {
    return (
      <ReservationForm
        espacio={selectedSpace}
        onBack={handleBackFromReservation}
        onReservationSuccess={handleReservationSuccess}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ¡Bienvenido, {user?.firstName || 'Usuario'}!
              </h1>
              <p className="text-gray-600 mt-2">Reserva tu espacio favorito en TecUnify</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Campus</div>
              <div className="font-semibold text-gray-900">Norte</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar espacios..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => {
            const Icon = space.icon;
            return (
              <div key={space.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Space Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <Icon className="w-16 h-16 text-blue-600" />
                </div>

                {/* Space Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{space.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      space.status === 'Disponible' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {space.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{space.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Capacidad: {space.capacity} personas</span>
                    </div>
                    {space.precio_por_hora > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">S/. {space.precio_por_hora}/hora</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{space.descripcion}</p>

                  <button
                    onClick={() => handleReserveSpace(space)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Calendar className="w-4 h-4" />
                    Reservar Espacio
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredSpaces.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron espacios</h3>
            <p className="text-gray-600">Intenta cambiar los filtros o busca con otros términos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
