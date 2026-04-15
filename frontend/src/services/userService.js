import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const USER_API = `${BASE_URL}/api/v1/auth/user`;

const API_URL = USER_API;

//function to set Authheader
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// get user data
export const getUserData = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}`, getAuthHeader());
  return res.data;
};