import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TODO_API = `${BASE_URL}/api/v1/todo`;

const API_URL = TODO_API;

//function to set Authheader
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// get all todos
export const getTodos = async () => {
    const res = await axios.get(`${API_URL}/`, getAuthHeader());
    return res.data
}

// get todo by ID
export const getTodo = async (todoId) => {
    const res =  await axios.get(`${API_URL}/${todoId}`, getAuthHeader())
    return res.data
}

// create a new todo 
export const createTodo = async (data) => {
    const res =  await axios.post(`${API_URL}/`, data , getAuthHeader());
    return res.data
}

// update a todo
export const updateTodo = async (todoId, data) => {
    const res =  await axios.put(`${API_URL}/${todoId}`, data , getAuthHeader());
    return res.data
}

// delete a todo
export const deleteTodo = async (todoId) => {
    const res =  await axios.delete(`${API_URL}/${todoId}`, getAuthHeader());
    return res.data
}