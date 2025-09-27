import axios from "axios";

// URL base de la API, usada SÓLO para construir URLs de imágenes externas.
const API_BASE_URL = "https://stayloop-api.onrender.com";

// Instancia de Axios que utiliza el proxy de desarrollo (baseURL: "/")
const api = axios.create({
  baseURL: "/",
});

// --- Utilidades ---

/**
 * Convierte una ruta relativa de la API a una URL de imagen completa.
 */
export const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

// --- Autenticación ---

/**
 * Inicia sesión y guarda el token y los datos del usuario.
 */
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      // Clave CORRECTA para guardar el token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error("No se recibió token o datos de usuario.");
  } catch (error) {
    // Si la API no está disponible o las credenciales son incorrectas
    throw error.response?.data?.message || "Error en el inicio de sesión";
  }
};

/**
 * Cierra la sesión eliminando el token y los datos de usuario del localStorage.
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Opcional: Podrías redirigir o hacer un `window.location.reload()` aquí
};


/**
 * Registra un nuevo usuario con datos de formulario (incluyendo imagen).
 */
export const register = async (userData) => {
  try {
    const formData = new FormData();
    formData.append("nombre", userData.nombre);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("idRol", userData.idRol);
    formData.append("imgUsuario", userData.imgUsuario);

    const response = await api.post("/auth/register", formData, {
      headers: {
        // Axios detecta FormData, pero especificarlo es una buena práctica
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error en el registro";
  }
};