import axios from "axios";

const api = axios.create({
  baseURL: "/", // proxy 
});

// --- Helpers para Auth ---
const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error("No hay token, inicia sesión primero.");
  }
  return { Authorization: `Bearer ${token}` };
};

// --- READ ---
export const getHoteles = async () => {
  try {
    const response = await api.get("/hotels/getall");
    return response.data;
  } catch (error) {
    console.error("Error al obtener hoteles:", error.response || error);
    throw new Error(error.response?.data?.message || "No se pudo obtener la lista de hoteles");
  }
};

export const getHotelById = async (id) => {
  try {
    const response = await api.get(`/hotels/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener hotel ${id}:`, error.response || error);
    throw new Error(error.response?.data?.message || "Hotel no encontrado");
  }
};

// --- CREATE ---
export const createHotel = async (hotelData) => {
  try {
    const response = await api.post("/hotels/create", hotelData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear hotel:", error.response || error);
    throw new Error(error.response?.data?.message || "Error al crear el hotel");
  }
};

// --- UPDATE ---
export const updateHotel = async (id, hotelData) => {
  try {
    const response = await api.put(`/hotels/update/${id}`, hotelData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar hotel ${id}:`, error.response || error);
    throw new Error(error.response?.data?.message || "Error al actualizar el hotel");
  }
};

// --- DELETE ---
export const deleteHotel = async (id) => {
  try {
    const response = await api.delete(`/hotels/delete/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.status === 204; // true si se eliminó
  } catch (error) {
    console.error(`Error al eliminar hotel ${id}:`, error.response || error);
    throw new Error(error.response?.data?.message || "Error al eliminar el hotel");
  }
};
