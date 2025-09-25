import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al iniciar sesión");

      const data = await res.json();
      setUser(data);
      localStorage.setItem("stayloopUser", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      alert("⚠️ Credenciales incorrectas o error en el login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded-lg"
        />
        <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
