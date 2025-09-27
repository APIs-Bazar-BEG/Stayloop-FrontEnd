// src/pages/Gestion/AdminDashboard.jsx

import React from "react";
import { Link } from "react-router-dom";

const UserIcon = () => (
  <svg
    className="w-12 h-12 text-blue-600 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H9a6 6 0 01-6-6V7a3 3 0 013-3h12a3 3 0 013 3v8a6 6 0 01-6 6z"
    />
  </svg>
);
const HotelIcon = () => (
  <svg
    className="w-12 h-12 text-blue-600 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2M7 21H5m0 0a2 2 0 01-2-2v-2a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2"
    />
  </svg>
);
const ZoneIcon = () => (
  <svg
    className="w-12 h-12 text-blue-600 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const ReserveIcon = () => (
  <svg
    className="w-12 h-12 text-blue-600 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const AdminDashboard = () => {
  const Card = ({ icon: Icon, title, description, to }) => (
    <Link
      to={to}
      className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-[1.02]"
    >
      <div className="flex flex-col items-center text-center">
        <Icon />
        <h3 className="text-xl font-semibold text-gray-800 mt-2">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <span className="text-blue-600 mt-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </div>
    </Link>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Panel de Control
          </h1>
          <p className="mt-4 text-xl text-gray-600">¿Qué necesita gestionar?</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card
            icon={UserIcon}
            title="Gestión de Usuarios"
            description="Disponga de todas las cuentas."
            to="/gestion/usuarios" // Ruta a UserList.jsx
          />
          <Card
            icon={HotelIcon}
            title="Config. Hoteles"
            description="Gestione las propiedades del sitio."
            to="/gestion/hoteles"
          />
          <Card
            icon={ZoneIcon}
            title="Config. Zonas"
            description="Gestione las zonas disponibles."
            to="/gestion/zonas"
          />
          <Card
            icon={ReserveIcon}
            title="Config. Reservas"
            description="Gestione sus Reservas."
            to="/gestion/reservas"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
