import axios from "axios";

const API_URL = 'http://localhost:3000/api/v1/auth/user';

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