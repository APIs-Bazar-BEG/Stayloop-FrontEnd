import axios from "axios";

const API_URL = "https://stayloop-api.onrender.com";

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
