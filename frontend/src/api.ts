import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log("API baseURL =>", api.defaults.baseURL); // <-- agregar esta línea

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
