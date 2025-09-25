import axios from "axios";

export const API_URL = ""; 

// LOGIN
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data; // { token, user }
};

// REGISTER
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data; // { token, user }
};

// GET HOTELS
export const getHoteles = async () => {
  try {
    const response = await axios.get(`${API_URL}/hotels/getall`);
    return response.data; // Debería ser un array de hoteles
  } catch (error) {
    console.error("Error al obtener los hoteles:", error);
    throw error;
  }
};