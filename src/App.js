import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
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

// Login y Perfil
import Login from "./pages/Login/Login.jsx";
import Perfil from "./pages/Login/Perfil.jsx";

// Navbar
import Navbar from "./components/Navbar.jsx";

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

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Login y Perfil */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLogin} />}
          />
          <Route path="/perfil" element={<Perfil user={user} />} />

          {/* Admin Dashboard y CRUD */}
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

          <Route path="/gestion/zonas" element={<ZonasList />} />
          <Route path="/gestion/zonas/crear" element={<CreateZona />} />
          <Route path="/gestion/zonas/editar/:id" element={<UpdateZona />} />
          <Route path="/gestion/zonas/eliminar/:id" element={<DeleteZona />} />
          <Route path="/gestion/zonas/:id" element={<ReadZona />} />

          <Route path="/gestion/hoteles" element={<HotelesList />} />
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
