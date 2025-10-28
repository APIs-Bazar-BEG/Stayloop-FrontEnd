// src/pages/Reservas/ReservasList.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTools, FaHome, FaHotel } from "react-icons/fa";

const ReservasList = () => {
  return (
    <div className="flex flex-1 justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center">
        {/* Icono de mantenimiento */}
        <div className="mb-8 flex justify-center">
          <div className="bg-yellow-100 p-6 rounded-full">
            <FaTools className="text-yellow-600 text-6xl" />
          </div>
        </div>

        {/* Título principal */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Página en Mantenimiento
        </h1>

        {/* Mensaje descriptivo */}
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Estamos trabajando para mejorar tu experiencia. Esta sección estará disponible muy pronto.
        </p>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            ¿Qué puedes hacer mientras tanto?
          </h2>
          <p className="text-blue-700">
            Explora otras secciones de la aplicación o vuelve más tarde.
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <FaHome className="text-lg" />
            <span>Ir al Inicio</span>
          </Link>
          
          <Link
            to="/gestion/hoteles"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <FaHotel className="text-lg" />
            <span>Ver Hoteles</span>
          </Link>
        </div>

        {/* Mensaje de contacto */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Si necesitas asistencia inmediata, contacta al administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default ReservasList;