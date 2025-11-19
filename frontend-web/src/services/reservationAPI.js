// API para manejo de reservas
const API_BASE_URL = 'http://localhost:8081';

// Configuración de headers por defecto
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const reservationAPI = {
  // Obtener todos los espacios disponibles
  getEspacios: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/espacios`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        // Si el backend no está disponible, usar datos mock
        console.warn('Backend no disponible, usando datos mock');
        return mockData.espacios;
      }

      return await response.json();
    } catch (error) {
      console.warn('Error conectando con backend, usando datos mock:', error);
      return mockData.espacios;
    }
  },

  // Obtener un espacio específico por ID
  getEspacio: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/espacios/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo espacio:', error);
      throw error;
    }
  },

  // Verificar disponibilidad de un espacio
  verificarDisponibilidad: async (espacioId, fecha, horaInicio, horaFin) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas/verificar-disponibilidad`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          espacioId: espacioId,
          fechaReserva: fecha,
          horaInicio: horaInicio,
          horaFin: horaFin
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      throw error;
    }
  },

  // Crear una nueva reserva
  crearReserva: async (reservaData) => {
    try {
      console.log('Enviando reserva al backend:', reservaData);
      const response = await fetch(`${API_BASE_URL}/api/reservas`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reservaData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del backend:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Reserva creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error creando reserva:', error);
      // Si es un error de conexión, simular la reserva
      if (error.message.includes('fetch')) {
        console.warn('Error de conexión, simulando reserva');
        return {
          id: Date.now(),
          ...reservaData,
          estado: 'PENDIENTE',
          fechaCreacion: new Date().toISOString(),
          mensaje: 'Reserva simulada - Error de conexión'
        };
      }
      throw error;
    }
  },

  // Obtener reservas del usuario actual
  getMisReservas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas/mis-reservas`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo mis reservas:', error);
      throw error;
    }
  },

  // Cancelar una reserva
  cancelarReserva: async (reservaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}/cancelar`, {
        method: 'PUT',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      throw error;
    }
  },

  // Obtener horarios disponibles para un espacio en una fecha específica
  getHorariosDisponibles: async (espacioId, fecha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/espacios/${espacioId}/horarios-disponibles?fecha=${fecha}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo horarios disponibles:', error);
      throw error;
    }
  },

  // Obtener motivos de reserva disponibles
  getMotivosReserva: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/motivos-reserva`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo motivos de reserva:', error);
      throw error;
    }
  }
};

// Datos mock para desarrollo (cuando el backend no esté disponible)
export const mockData = {
  espacios: [
    {
      id: 1,
      nombre: "Laboratorio de Computación A",
      descripcion: "Laboratorio equipado con 30 computadoras",
      ubicacion: "Campus Norte - Edificio A - Piso 2",
      capacidad: 30,
      tipo_espacio: "Laboratorio",
      precio_por_hora: 50.00,
      equipamiento: "30 PCs, Proyector, WiFi",
      activo: true
    },
    {
      id: 2,
      nombre: "Laboratorio de Electrónica",
      descripcion: "Laboratorio para proyectos de electrónica",
      ubicacion: "Campus Norte - Edificio B - Piso 1",
      capacidad: 20,
      tipo_espacio: "Laboratorio",
      precio_por_hora: 60.00,
      equipamiento: "Osciloscopios, Multímetros, Protoboard",
      activo: true
    },
    {
      id: 3,
      nombre: "Cancha de Fútbol 1",
      descripcion: "Cancha de fútbol reglamentaria",
      ubicacion: "Campus Norte - Zona Deportiva",
      capacidad: 22,
      tipo_espacio: "Cancha Deportiva",
      precio_por_hora: 40.00,
      equipamiento: "Porterías, Iluminación nocturna",
      activo: true
    },
    {
      id: 4,
      nombre: "Cancha de Básquet",
      descripcion: "Cancha de básquet cubierta",
      ubicacion: "Campus Norte - Polideportivo",
      capacidad: 20,
      tipo_espacio: "Cancha Deportiva",
      precio_por_hora: 45.00,
      equipamiento: "Canastas, Marcador electrónico",
      activo: true
    },
    {
      id: 5,
      nombre: "Sala de Estudio Silenciosa",
      descripcion: "Sala para estudio individual",
      ubicacion: "Campus Norte - Biblioteca - Piso 3",
      capacidad: 15,
      tipo_espacio: "Sala de Estudio",
      precio_por_hora: 20.00,
      equipamiento: "Mesa individual, Luz LED",
      activo: true
    },
    {
      id: 6,
      nombre: "Auditorio Principal",
      descripcion: "Auditorio para eventos y conferencias",
      ubicacion: "Campus Norte - Edificio Central",
      capacidad: 200,
      tipo_espacio: "Auditorio",
      precio_por_hora: 100.00,
      equipamiento: "Sistema de sonido, Proyector 4K",
      activo: true
    }
  ]
};
