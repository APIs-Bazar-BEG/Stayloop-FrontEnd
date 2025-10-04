// src/services/axios.js

import axios from "axios";

// Crea una instancia de Axios con la configuración base
const api = axios.create({
  // Usa el proxy definido en package.json o la URL base de tu API
  baseURL: "/",
});

// Helper para obtener el token de autenticación
export const getToken = () => localStorage.getItem("token");

// Helper para obtener los encabezados de autenticación (Bearer Token)
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    // En un entorno de React, es mejor devolver un error controlado
    throw new Error("Acceso denegado. Se requiere autenticación.");
  }
  return { Authorization: `Bearer ${token}` };
};

export default api;
