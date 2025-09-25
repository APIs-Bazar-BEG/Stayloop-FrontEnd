import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (file) {
      formData.append("imagen", file);
    }

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en el registro");

      const data = await res.json();
      setUser(data);
      localStorage.setItem("stayloopUser", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      alert("⚠️ Error al registrarse");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
        />
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
          className="w-full mb-4 p-3 border rounded-lg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4"
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
          />
        )}
        <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
