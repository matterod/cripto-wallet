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

api.interceptors.response.use(
  (response) => response, // si la respuesta fue exitosa, continuar normalmente
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("refresh");

    // Si el access token venció (401) y hay refresh disponible
    if (error.response?.status === 401 && refresh && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh/`, { refresh });
        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest); // reintenta el request original
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // si también falla el refresh → forzar logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
