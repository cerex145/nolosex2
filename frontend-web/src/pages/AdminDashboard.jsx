import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8081/api';

export default function AdminDashboard() {
  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [activeTab, setActiveTab] = useState('espacios');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'ADMIN') {
      window.location.href = '/';
      return;
    }
    cargarEspacios();
    cargarReservas();
  }, []);

  const cargarEspacios = async () => {
    try {
      const response = await axios.get(`${API_BASE}/espacios`, {
        headers: { 'X-User-Role': role }
      });
      setEspacios(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarReservas = async () => {
    try {
      const response = await axios.get(`${API_BASE}/reservas`, {
        headers: { 'X-User-Role': role }
      });
      setReservas(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCambiarEstado = async (reservaId, nuevoEstado) => {
    try {
      await axios.put(
        `${API_BASE}/reservas/${reservaId}/estado?estado=${nuevoEstado}`,
        {},
        { headers: { 'X-User-Role': role } }
      );
      cargarReservas();
      alert('Estado actualizado');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white p-4">
        <h1 className="text-2xl font-bold">Panel Administrativo - TecUnify</h1>
        <p className="text-sm">{localStorage.getItem('email')}</p>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('espacios')}
            className={`px-4 py-2 rounded ${activeTab === 'espacios' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Espacios
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-4 py-2 rounded ${activeTab === 'reservas' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Reservas
          </button>
        </div>

        {/* Espacios Tab */}
        {activeTab === 'espacios' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Gestión de Espacios</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Capacidad</th>
                  <th className="border p-2">Precio/Hora</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {espacios.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-100">
                    <td className="border p-2">{e.id}</td>
                    <td className="border p-2">{e.nombre}</td>
                    <td className="border p-2">{e.capacidad}</td>
                    <td className="border p-2">${e.precioHora}</td>
                    <td className="border p-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Editar</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reservas Tab */}
        {activeTab === 'reservas' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Gestión de Reservas</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Usuario</th>
                  <th className="border p-2">Espacio</th>
                  <th className="border p-2">Fecha</th>
                  <th className="border p-2">Estado</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-100">
                    <td className="border p-2">{r.id}</td>
                    <td className="border p-2">{r.usuario?.email}</td>
                    <td className="border p-2">{r.espacio?.nombre}</td>
                    <td className="border p-2">{r.fechaReserva}</td>
                    <td className="border p-2">{r.estado}</td>
                    <td className="border p-2">
                      <select
                        defaultValue={r.estado}
                        onChange={(e) => handleCambiarEstado(r.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option>PENDIENTE</option>
                        <option>CONFIRMADA</option>
                        <option>CANCELADA</option>
                        <option>COMPLETADA</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}