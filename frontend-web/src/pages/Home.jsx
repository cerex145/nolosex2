import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { InicioSectionWrapper, HorarioSection, MisReservasSection, TecIASection, MiPerfilSection } from './DashboardSections';

export default function HomePage({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('inicio');

  const renderSection = () => {
    switch (activeSection) {
      case 'inicio':
        return <InicioSectionWrapper user={user} />;
      case 'horario':
        return <HorarioSection />;
      case 'mis-reservas':
        return <MisReservasSection />;
      case 'tecia':
        return <TecIASection />;
      case 'mi-perfil':
        return <MiPerfilSection user={user} />;
      default:
        return <InicioSectionWrapper user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1">
        {renderSection()}
      </div>
    </div>
  );
}