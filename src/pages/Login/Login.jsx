import React, { useState } from "react";
import { login } from "../../services/stayloopService";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login(email, password);
      if (response && response.user) {
        onLoginSuccess(response.user);
        navigate("/");
      }
    } catch (err) {
      setError(err || "Error desconocido en el inicio de sesión");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            ¡Hola de nuevo!
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Inicia sesión para continuar.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                autoComplete="email"
                className="relative block w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-500 ring-inset ring-blue-400 transition-shadow duration-200 focus:outline-none focus:ring-2"
                name="username"
                placeholder="Ingresa tu correo"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                autoComplete="current-password"
                className="relative block w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-500 ring-inset ring-blue-400 transition-shadow duration-200 focus:outline-none focus:ring-2"
                name="password"
                placeholder="Ingresa tu contraseña"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-full border border-transparent bg-blue-600 py-3 px-4 text-base font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
