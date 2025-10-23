// src/services/ImageService.js

// Importamos solo los helpers de autenticación que vamos a usar
import { getAuthHeaders } from "./axios";
import axios from "axios";

// En services/ImageService.js - Forzar CORS
// En services/ImageService.js - Cambia las URLs
const API_BASE_URL = ""; // Vacío para usar el proxy
const IMAGES_ENDPOINT = "/images";
const API_URL = `${API_BASE_URL}${IMAGES_ENDPOINT}`;

export const uploadImage = async (hotelId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("imagen", imageFile);
    
    const response = await axios.post(`${API_URL}/upload/${hotelId}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw new Error(error.response?.data?.message || "Error al subir la imagen.");
  }
};

export const getImageUrl = (imageId) => {
  return `https://stayloop-api.onrender.com/images/getbyid/${imageId}`;
};

export const getImagesByHotelId = async (hotelId) => {
  try {
    const response = await fetch(`${API_URL}/getbyhotelid/${hotelId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener imágenes: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getImagesByHotelId:", error);
    return []; // Devolvemos array vacío en caso de error para no romper la UI
  }
};


// --- DELETE (Nueva función usando Axios) ---

/**
 * Elimina una imagen por su ID.
 * DELETE https://stayloop-api.onrender.com/images/delete/1
 */
export const deleteImage = async (id) => {
  try {
    // Usamos axios con la URL completa para mantener la consistencia con upload
    await axios.delete(`${API_URL}/delete/${id}`, {
      headers: getAuthHeaders(), // Requiere autenticación
    });
    return true;
  } catch (error) {
    console.error(
      `Error al eliminar imagen ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error al eliminar la imagen."
    );
  }
};
