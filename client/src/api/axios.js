import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("luxestride_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // token invalid/expired — clear it so ProtectedRoute redirects cleanly
      localStorage.removeItem("luxestride_token");
      localStorage.removeItem("luxestride_user");
    }
    return Promise.reject(err);
  }
);

export default api;
