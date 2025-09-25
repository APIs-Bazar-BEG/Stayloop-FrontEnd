import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importar HotelesList para la nueva ruta
import HotelesList from "./pages/Hoteles/HotelesList"; 
import Navbar from "./pages/Navbar"; 
import Home from "./pages/Home";
// Los siguientes 3 componentes están en la subcarpeta 'Login'
import Login from "./pages/Login/Login"; 
import Register from "./pages/Login/Register"; 
import Perfil from "./pages/Login/Perfil"; 

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("stayloopUser");
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hoteles" element={<HotelesList />} /> 
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/perfil" element={<Perfil user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;