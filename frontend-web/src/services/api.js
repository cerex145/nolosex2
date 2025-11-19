import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8081'; // URL directa del backend

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authAPI = {
  // Registro de usuario
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response;
  },

  // Login de usuario
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response;
  },

  // Login con Google
  loginWithGoogle: async (googleToken) => {
    const response = await api.post('/api/auth/google', {
      token: googleToken
    });
    return response;
  },

  // Validar token
  validateToken: async (token) => {
    const response = await api.get('/api/auth/validate', {
      headers: { Authorization: token }
    });
    return response;
  }
};

// Servicios de usuarios
export const userAPI = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response;
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response;
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response;
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response;
  }
};

// Servicios de espacios
export const espacioAPI = {
  // Obtener todos los espacios
  getAllEspacios: async () => {
    const response = await api.get('/api/espacios');
    return response;
  },

  // Obtener espacio por ID
  getEspacioById: async (id) => {
    const response = await api.get(`/api/espacios/${id}`);
    return response;
  },

  // Obtener espacios disponibles
  getEspaciosDisponibles: async () => {
    const response = await api.get('/api/espacios/disponibles');
    return response;
  },

  // Obtener espacios por tipo
  getEspaciosByTipo: async (tipo) => {
    const response = await api.get(`/api/espacios/tipo/${tipo}`);
    return response;
  },

  // Crear espacio
  createEspacio: async (espacioData) => {
    const response = await api.post('/api/espacios', espacioData);
    return response;
  },

  // Actualizar espacio
  updateEspacio: async (id, espacioData) => {
    const response = await api.put(`/api/espacios/${id}`, espacioData);
    return response;
  }
};

// Servicios de reservas
export const reservaAPI = {
  // Obtener todas las reservas
  getAllReservas: async () => {
    const response = await api.get('/api/reservas');
    return response;
  },

  // Obtener reserva por ID
  getReservaById: async (id) => {
    const response = await api.get(`/api/reservas/${id}`);
    return response;
  },

  // Obtener reservas por usuario
  getReservasByUsuario: async (usuarioId) => {
    const response = await api.get(`/api/reservas/usuario/${usuarioId}`);
    return response;
  },

  // Obtener reservas por espacio
  getReservasByEspacio: async (espacioId) => {
    const response = await api.get(`/api/reservas/espacio/${espacioId}`);
    return response;
  },

  // Crear reserva
  createReserva: async (reservaData) => {
    const response = await api.post('/api/reservas', reservaData);
    return response;
  },

  // Actualizar reserva
  updateReserva: async (id, reservaData) => {
    const response = await api.put(`/api/reservas/${id}`, reservaData);
    return response;
  },

  // Cancelar reserva
  cancelarReserva: async (id) => {
    const response = await api.delete(`/api/reservas/${id}`);
    return response;
  }
};

export default api;