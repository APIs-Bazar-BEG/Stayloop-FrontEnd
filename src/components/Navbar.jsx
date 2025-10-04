// src/components/Navbar.jsx

import React from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../services/stayloopService";

const Navbar = ({ user, onLogout }) => {
  const ADMIN_ROLE_ID = 1;
  const isAdmin = user && user.idRol === ADMIN_ROLE_ID;

  const userImageUrl =
    user && user.imageUrl ? getFullImageUrl(user.imageUrl) : null; // Definición de enlaces de navegación

  const navLinks = [
    {
      // 🌟 CORRECCIÓN CLAVE: La ruta pública de hoteles es /reservas/hoteles
      to: "/reservas/hoteles",
      label: "Hoteles",
      requiresAuth: false, // Ahora es visible incluso si no están logueados
      showIfAdmin: false,
    }, // Mi Perfil es visible para todos los logueados
    { to: "/perfil", label: "Mi Perfil", requiresAuth: true }, // Admin solo es visible para el Admin logueado
    { to: "/admin", label: "Admin", requiresAuth: true, showIfAdmin: true },
  ];

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">StayLoop</Link>
          </div>

          {navLinks.map((link) => {
            // Si no requiere autenticación O si el usuario está logueado
            if (!link.requiresAuth || user) {
              // Lógica para enlaces de Admin
              if (link.showIfAdmin !== undefined) {
                // Si es un enlace de Admin, solo lo ve el Admin
                if (link.showIfAdmin === isAdmin) {
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-gray-600 hover:text-blue-600 font-medium ${
                        link.showIfAdmin && "font-bold"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                } else {
                  return null;
                }
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  {link.label}
                </Link>
              );
            }
            return null;
          })}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <img
                src={
                  userImageUrl ||
                  "https://via.placeholder.com/40/cccccc/ffffff?text=U"
                }
                alt="Perfil"
                className="h-10 w-10 rounded-full object-cover"
              />

              <span className="text-gray-700 font-medium hidden sm:block">
                {user.nombre}
              </span>

              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-gray-600 hover:text-blue-600 font-medium hidden sm:block"
              >
                Registrarse
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
