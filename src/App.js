import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { getProfile } from "./services/stayloopService";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Perfil from "./pages/Login/Perfil.jsx";
import Register from "./pages/Login/Register.jsx";

import Navbar from "./components/Navbar.jsx";

function App() {
  function MainRouter() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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
      navigate("/");
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
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLogin} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<Perfil />} />
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
