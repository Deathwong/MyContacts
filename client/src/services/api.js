// client/src/services/api.js
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050"; // default dev API
const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
