import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { getProfile } from "./services/stayloopService";

// Componentes de Vistas de Usuario
import Home from "./pages/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Perfil from "./pages/Login/Perfil.jsx";
import Register from "./pages/Login/Register.jsx";

// Componentes del Administrador
import AdminDashboard from "./pages/Gestion/AdminDashboard.jsx";
import UserList from "./pages/Gestion/UserList.jsx";
import UserCreate from "./pages/Gestion/UserCreate.jsx";
import UserEdit from "./pages/Gestion/UserEdit.jsx";
import UserDetail from "./pages/Gestion/UserDetail.jsx";
import UserDelete from "./pages/Gestion/UserDelete.jsx";

// Importaciones de Zonas (CRUD Completo)
import CreateZona from "./pages/Zonas/CreateZona.jsx";
import ZonasList from "./pages/Zonas/ZonasList.jsx";
import UpdateZona from "./pages/Zonas/UpdateZona.jsx";
import DeleteZona from "./pages/Zonas/DeleteZona.jsx";
import ReadZona from "./pages/Zonas/ReadZona.jsx";

import Navbar from "./components/Navbar.jsx";

function App() {
  function MainRouter() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      // Al iniciar, intentamos cargar el usuario del localStorage
      const storedUserData = localStorage.getItem("user");

      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
        } catch (error) {
          console.error(
            "Error al parsear los datos de usuario de localStorage:",
            error
          );
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

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* Rutas Públicas y de Usuario */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLogin} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<Perfil user={user} />} />

          {/* Rutas de Zonas */}
          <Route path="/zonas" element={<ZonasList />} />
          <Route path="/zonas/create" element={<CreateZona />} />
          <Route path="/zonas/edit/:id" element={<UpdateZona />} />
          <Route path="/zonas/delete/:id" element={<DeleteZona />} />
          <Route path="/zonas/:id" element={<ReadZona />} />

          {/* --- RUTAS DE ADMINISTRACIÓN --- */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/gestion/usuarios" element={<UserList />} />
          <Route path="/gestion/usuarios/crear" element={<UserCreate />} />
          <Route path="/gestion/usuarios/editar/:id" element={<UserEdit />} />
          <Route
            path="/gestion/usuarios/detalles/:id"
            element={<UserDetail />}
          />
          <Route
            path="/gestion/usuarios/eliminar/:id"
            element={<UserDelete />}
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
