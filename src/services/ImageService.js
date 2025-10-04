// src/services/ImageService.js

// Importamos solo los helpers de autenticación que vamos a usar
import { getAuthHeaders } from "./axios";
import axios from "axios";

const API_BASE_URL = "https://stayloop-api.onrender.com";
const IMAGES_ENDPOINT = "/images";
const API_URL = `${API_BASE_URL}${IMAGES_ENDPOINT}`;

// ... el resto de las funciones sigue igual ...
/**
 * Obtiene la lista de IDs de imágenes asociadas a un hotel.
 * @param {number} hotelId - El ID del hotel.
 * @returns {Promise<Array<Object>>} Un array de objetos de imagen (ej: [{id: 1, idHotel: 1}]).
 */
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

/**
 * Función auxiliar para construir la URL pública de la imagen.
 * @param {number} imageId - El ID de la imagen.
 * @returns {string} La URL completa de la imagen.
 */
export const getImageUrl = (imageId) => {
  return `${API_URL}/getbyid/${imageId}`;
};

// --- CREATE (Nueva función usando Axios y FormData) ---

/**
 * Sube un archivo de imagen a un hotel.
 * POST https://stayloop-api.onrender.com/images/upload/1
 * @param {number} hotelId - ID del hotel.
 * @param {File} imageFile - El objeto File de la imagen.
 */
export const uploadImage = async (hotelId, imageFile) => {
  try {
    const formData = new FormData(); // Asegúrate de que el nombre del campo ("image") coincida con lo que tu Multer/backend espera
    formData.append("image", imageFile);
    const response = await axios.post(
      `${API_URL}/upload/${hotelId}`,
      formData,
      {
        // Usamos getAuthHeaders para incluir el token
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al subir la imagen:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error al subir la imagen."
    );
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
