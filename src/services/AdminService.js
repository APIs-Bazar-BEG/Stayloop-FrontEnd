// src/services/AdminService.js

import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

// Función para obtener el token de autenticación del almacenamiento local
const getToken = () => localStorage.getItem("token");

// --- Funciones de Utilidad ---

/**
 * Encapsula la obtención del token y la verificación de su existencia.
 * @returns {object} Headers de autorización.
 * @throws {Error} Si no hay token.
 */
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error(
      "No hay token de autenticación disponible. Por favor, inicie sesión."
    );
  }
  return { Authorization: `Bearer ${token}` };
};

// --- Funciones CRUD (Read) ---

/**
 * Obtiene la lista paginada y filtrada de usuarios.
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get("/users/getall", {
      headers: getAuthHeaders(),
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener la lista de usuarios:",
      error.response || error
    );
    throw new Error(
      error.response?.data?.message ||
        "No se pudo cargar la lista de usuarios. (Verifique token/rol)"
    );
  }
};

/**
 * Obtiene los datos de un usuario por su ID.
 */
export const getUserById = async (userId) => {
  try {
    // 🚨 CORRECCIÓN: Se ajusta la ruta a /users/get/{userId} para coincidir con el endpoint de tu API.
    const response = await api.get(`/users/get/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener el usuario ${userId}:`,
      error.response || error
    ); // Usamos .message para capturar el error lanzado en UserEdit.jsx
    throw new Error(error.response?.data?.message || "Usuario no encontrado.");
  }
};

// --- Crear Usuario (C) ---

/**
 * Crea un nuevo usuario. Debe recibir un objeto FormData que incluya
 * los campos JSON y la imagen bajo la clave 'imgUsuario' (o el nombre que espere tu API).
 */
export const createUser = async (userData) => {
  try {
    // CORRECCIÓN CLAVE: Al enviar FormData, no especificamos 'Content-Type'.
    // Axios detecta el FormData y automáticamente establece 'Content-Type': 'multipart/form-data'
    // con el boundary correcto.
    const response = await api.post("/users/create", userData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error.response || error);
    throw new Error(
      error.response?.data?.message ||
        "Error al crear el usuario. Revise los campos."
    );
  }
};

// --- Actualizar Usuario (U) ---

/**
 * Actualiza los datos de un usuario. Debe recibir un objeto FormData
 * para manejar posibles cambios de imagen.
 */
export const updateUser = async (userId, userData) => {
  try {
    // CORRECCIÓN CLAVE: El mismo manejo de FormData aplica para la actualización.
    const response = await api.put(`/users/update/${userId}`, userData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al actualizar el usuario ${userId}:`,
      error.response || error
    );
    throw new Error(
      error.response?.data?.message || "Error al actualizar el usuario."
    );
  }
};

// --- Eliminar Usuario (D) ---

/**
 * Elimina un usuario por su ID.
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al eliminar el usuario ${userId}:`,
      error.response || error
    );
    throw new Error(
      error.response?.data?.message || "Error al eliminar el usuario."
    );
  }
};

// --- Funciones para Reportes (Simulación) ---

/**
 * Simulación de generación de reportes (Descarga o Impresión).
 * Debe reemplazar la simulación con la URL real de tu API de reportes.
 */
export const generateReport = (type) => {
  // URL de ejemplo para tu API de reportes (ajustar según sea necesario)
  const reportUrl = `${api.defaults.baseURL}reports/general`;

  if (type === "download") {
    console.log("Simulando descarga de reporte general..."); // Reemplazar con la llamada real de descarga de archivo. // Ejemplo real: window.open(`${reportUrl}/download?token=${getToken()}`, '_blank');
    alert("Descarga simulada. Reemplace con la lógica de API real.");
  } else if (type === "print") {
    console.log("Simulando impresión/vista previa de reporte general..."); // Reemplazar con la llamada real para vista previa/impresión. // Ejemplo real: window.open(`${reportUrl}/view?token=${getToken()}`, '_blank');
    alert("Impresión simulada. Reemplace con la lógica de API real.");
  }
};
