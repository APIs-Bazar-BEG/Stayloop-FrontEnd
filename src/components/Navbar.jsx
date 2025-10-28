import React from "react";
import { Link } from "react-router-dom";
// Asegúrate de que 'getFullImageUrl' esté correctamente importado desde tu servicio de usuario/auth
import { getFullImageUrl } from "../services/stayloopService";

const Navbar = ({ user, onLogout }) => {
  // Definición de Roles (Asegúrate de que coincida con tu backend)
  const ADMIN_ROLE_ID = 1;
  const HOTEL_ROLE_ID = 2;

  // Verificaciones de Roles
  const isAdmin = user && user.idRol === ADMIN_ROLE_ID;
  const isHotel = user && user.idRol === HOTEL_ROLE_ID;
  const isLoggedIn = !!user;

  const userImageUrl =
    user && user.imageUrl ? getFullImageUrl(user.imageUrl) : null;

  // Definición de enlaces de navegación centralizados y con lógica clara
  const navLinks = [
    // Enlace de Hoteles Público (Solo visible para Clientes o no logueados)
    {
      to: "/reservas/hoteles",
      label: "Hoteles",
      // Visible si no es Admin ni Hotel
      show: !isAdmin && !isHotel,
    },
    // Enlace de Gestión para Hoteles (Solo visible para Rol Hotel)
    {
      to: "/hoteles", // ⭐ RUTA ADMINISTRATIVA DE HOTELES (HotelesList.jsx)
      label: "Mis Hoteles",
      show: isHotel,
      isSpecial: true,
    },
    // Enlace de Gestión para Admin (Solo visible para Rol Admin)
    {
      to: "/admin",
      label: "Admin",
      show: isAdmin,
      isSpecial: true,
    },
    // Mi Perfil (Visible para todos los logueados)
    {
      to: "/perfil",
      label: "Mi Perfil",
      show: isLoggedIn,
    },
  ];

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-bold text-blue-600">
            {/* StayLoop actúa como enlace de inicio */}
            <Link to="/">StayLoop</Link>
          </div>

          {/* Mapeo de Enlaces de Navegación */}
          {navLinks.map((link) => {
            if (link.show) {
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-600 hover:text-blue-600 font-medium ${
                    link.isSpecial && "font-bold" // Poner en negrita para Admin/Hotel
                  }`}
                >
                  {link.label}
                </Link>
              );
            }
            return null;
          })}
        </div>

        {/* Botones de Login/Logout y Perfil */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <span className="text-xl">👤</span>
              </div>

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
