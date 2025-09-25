import React, { useState } from "react";
import { register } from "../../services/stayloopService";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    idRol: 3,
    imgUsuario: null,
  });
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imgUsuario: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, imgUsuario: null }));
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      setErrors(error);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-lg">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Crea una nueva cuenta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="nombre"
              >
                Nombre
              </label>
              {errors.nombre && (
                <span className="text-red-400">{errors.nombre}</span>
              )}
              <div className="mt-1">
                <input
                  className="input-field"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese el nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              {errors.email && (
                <span className="text-red-400">{errors.email}</span>
              )}
              <div className="mt-1">
                <input
                  className="input-field"
                  id="email"
                  name="email"
                  placeholder="Ingrese su email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Contraseña
              </label>
              {errors.password && (
                <span className="text-red-400">{errors.password}</span>
              )}
              <div className="mt-1">
                <input
                  className="input-field"
                  id="password"
                  name="password"
                  placeholder="Ingrese una contraseña segura"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="imgUsuario"
              >
                Foto de Perfil
              </label>
              {errors.imgUsuario && (
                <span className="text-red-400">{errors.imgUsuario}</span>
              )}
              <div className="mt-1 flex items-center gap-4">
                <span className="inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-300">
                  {previewUrl ? (
                    <img
                      id="preview"
                      src={previewUrl}
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      id="default"
                      className="h-full w-full text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  )}
                </span>
                <div className="flex-1">
                  <label className="group relative cursor-pointer rounded-md border border-dashed border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:border-blue-600 hover:text-blue-600">
                    <span>Subir Foto</span>
                    <input
                      className="sr-only"
                      id="img"
                      name="imgUsuario"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-600">
                    Tamaño Máximo: 2MiB
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-full border border-transparent bg-blue-600 px-4 py-3 text-base font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Registrarse
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-xs text-gray-600">
          Al crear una cuenta, aceptas seguir nuestros{" "}
          <Link
            to="/terms"
            className="font-medium underline hover:text-blue-600"
          >
            Términos y Condiciones
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
