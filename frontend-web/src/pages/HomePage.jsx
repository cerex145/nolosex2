import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './HomePage.css'

const API_BASE = 'http://localhost:8081/api'

export default function HomePage() {
  const navigate = useNavigate()
  const [espacios, setEspacios] = useState([])
  const [miReservas, setMiReservas] = useState([])
  const [activeTab, setActiveTab] = useState('espacios')
  const [loading, setLoading] = useState(true)
  const email = localStorage.getItem('email')

  useEffect(() => {
    if (!email) {
      navigate('/')
      return
    }
    cargarDatos()
  }, [email, navigate])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      // Cargar espacios
      const espaciosRes = await axios.get(`${API_BASE}/espacios`)
      setEspacios(espaciosRes.data)

      // Cargar mis reservas
      const reservasRes = await axios.get(`${API_BASE}/reservas/mi?email=${email}`)
      setMiReservas(reservasRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  if (loading) {
    return <div className="loading-screen">Cargando...</div>
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>TecUnify</h1>
        <div className="header-right">
          <span>{email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'espacios' ? 'active' : ''}`}
          onClick={() => setActiveTab('espacios')}
        >
          Espacios Disponibles
        </button>
        <button
          className={`tab ${activeTab === 'misReservas' ? 'active' : ''}`}
          onClick={() => setActiveTab('misReservas')}
        >
          Mis Reservas
        </button>
      </div>

      {/* Contenido */}
      <main className="home-content">
        {activeTab === 'espacios' && (
          <div>
            <h2>Espacios Disponibles</h2>
            <div className="espacios-grid">
              {espacios.map((espacio) => (
                <div key={espacio.id} className="espacio-card">
                  <h3>{espacio.nombre}</h3>
                  <p>{espacio.descripcion}</p>
                  <p>
                    <strong>Capacidad:</strong> {espacio.capacidad} personas
                  </p>
                  <p>
                    <strong>Precio:</strong> ${espacio.precioHora}/hora
                  </p>
                  <button className="reserve-btn">Reservar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'misReservas' && (
          <div>
            <h2>Mis Reservas</h2>
            {miReservas.length === 0 ? (
              <p>No tienes reservas</p>
            ) : (
              <table className="reservas-table">
                <thead>
                  <tr>
                    <th>Espacio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {miReservas.map((r) => (
                    <tr key={r.id}>
                      <td>{r.espacio?.nombre}</td>
                      <td>{r.fechaReserva}</td>
                      <td>
                        {r.horaInicio} - {r.horaFin}
                      </td>
                      <td>{r.estado}</td>
                      <td>
                        {r.estado === 'PENDIENTE' && (
                          <button className="cancel-btn">Cancelar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  )
}