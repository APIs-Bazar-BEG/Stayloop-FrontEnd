// src/App.js

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
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
import HotelesList from "./pages/Hoteles/HotelesList.jsx";
import ReservasList from "./pages/Reservas/ReservasList.jsx";
import ReservationCreate from "./pages/Reservas/ReservationCreate.jsx";
import ReservationEdit from "./pages/Reservas/ReservationEdit.jsx";
import ReservationDetails from "./pages/Reservas/ReservationDetails.jsx";
import ReservationDelete from "./pages/Reservas/ReservationDelete.jsx";

// Login y Perfil
import Login from "./pages/Login/Login.jsx";
import Perfil from "./pages/Login/Perfil.jsx";
import Register from "./pages/Login/Register.jsx";

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

    const ProtectedRoute = ({ children, allowedRoleIds }) => {
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      if (allowedRoleIds && !allowedRoleIds.includes(user.idRol)) {
        return <Navigate to="/" replace />;
      }
      return children;
    };

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Home />} />

          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLogin} />}
          />
          <Route path="/register" element={<Register />} />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil user={user} />
              </ProtectedRoute>
            }
          />

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
            path="/zonas"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ZonasList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/zonas/create"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <CreateZona />
              </ProtectedRoute>
            }
          />

          <Route
            path="/zonas/edit/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <UpdateZona />
              </ProtectedRoute>
            }
          />

          <Route
            path="/zonas/delete/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <DeleteZona />
              </ProtectedRoute>
            }
          />

          <Route
            path="/zonas/:id"
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

          <Route
            path="/gestion/reservas"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ReservasList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservas"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ReservasList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservas/create"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ReservationCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservas/edit/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ReservationEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservas/details/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ReservationDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservas/delete/:id"
            element={
              <ProtectedRoute allowedRoleIds={[ADMIN_ROLE_ID]}>
                <ReservationDelete />
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
