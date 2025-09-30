// src/components/Navbar.jsx (CORREGIDO)

import React from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../services/stayloopService";

const Navbar = ({ user, onLogout }) => {
  const ADMIN_ROLE_ID = 1;
  const isAdmin = user && user.idRol === ADMIN_ROLE_ID;

  const userImageUrl =
    user && user.imageUrl ? getFullImageUrl(user.imageUrl) : null;

  // Definición de enlaces de navegación
  const navLinks = [
    {
      to: "/hoteles",
      label: "Hoteles",
      requiresAuth: true,
      showIfAdmin: false,
    },
    // Mi Perfil es visible para todos los logueados
    { to: "/perfil", label: "Mi Perfil", requiresAuth: true },
    // Admin solo es visible para el Admin logueado
    { to: "/admin", label: "Admin", requiresAuth: true, showIfAdmin: true },
  ];

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Bloque izquierdo: Logo y enlaces */}
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-bold text-blue-600">
            {/* El logo siempre enlaza al home */}
            <Link to="/">StayLoop</Link>
          </div>

          {/* Renderizado de enlaces según el estado de autenticación */}
          {navLinks.map((link) => {
            if (link.requiresAuth) {
              // Si requiere autenticación
              if (user) {
                // Si es un enlace de Admin, solo lo ve el Admin
                if (link.showIfAdmin !== undefined) {
                  return link.showIfAdmin === isAdmin ? (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-gray-600 hover:text-blue-600 font-medium ${
                        link.showIfAdmin && "font-bold"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : null;
                }
                // Si es un enlace general logueado (como Mi Perfil), se muestra
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
              return null; // No logueado, requiere auth, no muestra
            }
            // --- CORRECCIÓN DE HOME: si no requiere auth, lo mostramos ---
            return (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Bloque derecho: Autenticación */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Contenido cuando el usuario está logueado */}
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
            // Contenido cuando el usuario NO está logueado (Invitado)
            <>
              {/* Enlace de REGISTRO (Nueva línea agregada) */}
              <Link
                to="/register"
                className="text-gray-600 hover:text-blue-600 font-medium hidden sm:block"
              >
                Registrarse
              </Link>
              {/* Enlace de INICIAR SESIÓN */}
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
