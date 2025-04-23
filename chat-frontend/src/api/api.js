import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chat-backend-3-bbzi.onrender.com', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies if needed
});

export default api;
