import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // production

const axiosInstance = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT || 3000}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
