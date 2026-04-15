import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AUTH_API = `${BASE_URL}/api/v1/auth`;

const API_URL = AUTH_API;

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const register = async (username, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { username, email, password });
  return res.data;
};