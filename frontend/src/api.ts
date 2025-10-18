// frontend/src/api.ts

import axios from 'axios';

// 1. Instancia base de Axios
const api = axios.create({
  // Usar una ruta relativa o variable de entorno de Vite
  baseURL: import.meta.env.VITE_API_URL || "/api/", 
});

// Variables para manejar el flujo de refresco
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// Interceptor 1: Añade el Access Token a todas las peticiones salientes
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken && !config.headers.Authorization) {
        // Solo si la cabecera no está ya establecida (ej: para la propia llamada de refresh)
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor 2: Maneja el error 401 (Token Expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute = originalRequest.url.includes('/auth/login/') || originalRequest.url.includes('/auth/web3/');

    // 1. Ignorar: Si no es 401, o es una ruta de login (que no debe tener token), o si ya intentamos el refresh
    if (status !== 401 || isAuthRoute || originalRequest._retry) {
        return Promise.reject(error);
    }

    // 2. Access Token expirado (401)
    originalRequest._retry = true; // Marca esta petición como ya reintentada

    // 3. Si ya estamos refrescando, encola la petición
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        }).then(() => {
            return api(originalRequest);
        }).catch(err => Promise.reject(err));
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem('refresh');

    // 4. Si no hay Refresh Token, forzar logout (sesión terminada)
    if (!refreshToken) {
        localStorage.clear();
        window.location.reload(); 
        return Promise.reject(error);
    }

    // 5. Intentar obtener nuevos tokens
    try {
        const res = await axios.post(
            `${api.defaults.baseURL}auth/refresh/`, // <--- USAR RUTA DE REFRESH
            { refresh: refreshToken }
        );

        const newAccessToken = res.data.access;
        const newRefreshToken = res.data.refresh; 
        
        // Guardar nuevos tokens
        localStorage.setItem('access', newAccessToken);
        if (newRefreshToken) {
            localStorage.setItem('refresh', newRefreshToken);
        }

        // Reconfigurar y procesar la cola
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        
        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

    } catch (_error) {
        // 6. Fallo en el refresh (Refresh Token expirado)
        localStorage.clear();
        processQueue(_error); 
        window.location.reload();
        return Promise.reject(_error);
    } finally {
        isRefreshing = false;
    }
  }
);

export default api;