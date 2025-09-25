import axios from "axios";

const API_BASE_URL = "https://stayloop-api.onrender.com";

const api = axios.create({
  baseURL: "/",
});

export const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error("No se recibió token o datos de usuario.");
  } catch (error) {
    throw error.response?.data?.message || "Error en el inicio de sesión";
  }
};

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
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error en el registro";
  }
};
