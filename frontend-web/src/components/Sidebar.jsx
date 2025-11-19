import React from 'react';
import { Home, Calendar, Clock, User, LogOut, Bot } from 'lucide-react';

export default function Sidebar({ activeSection, onSectionChange, onLogout }) {
  const menuItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: Home,
      active: activeSection === 'inicio'
    },
    {
      id: 'horario',
      label: 'Horario',
      icon: Calendar,
      active: activeSection === 'horario'
    },
    {
      id: 'mis-reservas',
      label: 'Mis Reservas',
      icon: Clock,
      active: activeSection === 'mis-reservas'
    },
    {
      id: 'tecia',
      label: 'TecIA',
      icon: Bot,
      active: activeSection === 'tecia'
    },
    {
      id: 'mi-perfil',
      label: 'Mi Perfil',
      icon: User,
      active: activeSection === 'mi-perfil'
    }
  ];

  return (
    <div className="w-64 bg-blue-50 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-100">
        <h1 className="text-2xl font-bold text-blue-600">TecUnify</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    item.active
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
