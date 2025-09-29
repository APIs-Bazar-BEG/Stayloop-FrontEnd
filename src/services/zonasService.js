//Jira

import axios from "axios";

// 🚀 Usamos rutas relativas porque configuramos "proxy" en package.json
const api = axios.create({
  baseURL: "/", // el proxy en package.json redirige a https://stayloop-api.onrender.com
});

// --- Función para obtener token ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token disponible. Por favor, inicia sesión.");
  }
  return { Authorization: `Bearer ${token}` };
};

// --- READ ---

export const getZonas = async () => {
  try {
    const response = await api.get("/zones/getall"); // no necesita token
    return response.data;
  } catch (error) {
    console.error("Error al obtener zonas públicas:", error.response || error);
    throw new Error(error.response?.data?.message || "Error al obtener zonas.");
  }
};

export const getZonaById = async (id) => {
  try {
    const response = await api.get(`/zones/get/${id}`); // no necesita token
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la zona ${id}:`, error.response || error);
    throw new Error(error.response?.data?.message || "Zona no encontrada.");
  }
};

// --- CREATE ---

export const createZona = async (zonaData) => {
  try {
    const response = await api.post("/zones/create", zonaData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear zona:", error.response || error);
    throw new Error(error.response?.data?.message || "Error al crear zona");
  }
};

// --- UPDATE ---

export const updateZona = async (id, zonaData) => {
  try {
    const response = await api.put(`/zones/update/${id}`, zonaData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar zona ${id}:`, error.response || error);
    throw new Error(error.response?.data?.message || "Error al actualizar zona");
  }
};

// --- DELETE ---

export const deleteZona = async (id) => {
  try {
    const response = await api.delete(`/zones/delete/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.status === 204;
  } catch (error) {
    console.error(`Error al eliminar zona ${id}:`, error.response || error);
    throw new Error(error.response?.data?.message || "Error al eliminar zona");
  }
};
