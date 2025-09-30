// src/App.js

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate, // Importamos Navigate para proteger las rutas
} from "react-router-dom";

// Vistas principales
import Home from "./pages/Home.jsx";

// Vistas Admin
import AdminDashboard from "./pages/Gestion/AdminDashboard.jsx";
import UserList from "./pages/Gestion/UserList.jsx";
import UserCreate from "./pages/Gestion/UserCreate.jsx";
import UserEdit from "./pages/Gestion/UserEdit.jsx";
import UserDetail from "./pages/Gestion/UserDetail.jsx";
import UserDelete from "./pages/Gestion/UserDelete.jsx";
import ZonasList from "./pages/Zonas/ZonasList.jsx";
import CreateZona from "./pages/Zonas/CreateZona.jsx";
import UpdateZona from "./pages/Zonas/UpdateZona.jsx";
import DeleteZona from "./pages/Zonas/DeleteZona.jsx";
import ReadZona from "./pages/Zonas/ReadZona.jsx";
import HotelesList from "./pages/Hoteles/HotelesList.jsx"; // Lista para Admin

// Login y Perfil
import Login from "./pages/Login/Login.jsx";
import Perfil from "./pages/Login/Perfil.jsx";

// Navbar
import Navbar from "./components/Navbar.jsx";

const ADMIN_ROLE_ID = 1;

function App() {
  function MainRouter() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        try {
          setUser(JSON.parse(storedUserData));
        } catch (error) {
          console.error("Error al parsear usuario:", error);
          localStorage.removeItem("user");
        }
      }
    }, []);

    const handleLogin = (userData) => {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    };

    // Componente de Ruta Protegida para manejar el acceso por autenticación y rol
    const ProtectedRoute = ({ children, allowedRoleIds }) => {
      if (!user) {
        return <Navigate to="/login" replace />; // No logueado
      }
      if (allowedRoleIds && !allowedRoleIds.includes(user.idRol)) {
        // Usuario logueado pero sin el rol permitido, redirige a Home (ruta default)
        // Ya que la ruta /hoteles fue eliminada
        return <Navigate to="/" replace />;
      }
      return children;
    };

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* Ruta principal, redirige a /login si no hay usuario */}
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLogin} />}
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil user={user} />
              </ProtectedRoute>
            }
          />

          {/* ❌ RUTA /hoteles (Cliente) ELIMINADA ❌ */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/usuarios"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <UserList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/usuarios/crear"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <UserCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/usuarios/editar/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <UserEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/usuarios/detalles/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <UserDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/usuarios/eliminar/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <UserDelete />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/zonas"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ZonasList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/zonas/crear"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <CreateZona />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/zonas/editar/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <UpdateZona />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/zonas/eliminar/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <DeleteZona />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/zonas/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ReadZona />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion/hoteles"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <HotelesList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    );
  }

  return (
    <Router>
      <MainRouter />
    </Router>
  );
}

export default App;
