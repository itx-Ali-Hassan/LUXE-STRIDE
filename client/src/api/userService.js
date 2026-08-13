import api from "./axios.js";

export const getUsers = () => api.get("/users").then((r) => r.data);
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role }).then((r) => r.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data);
export const getDashboardStats = () => api.get("/users/stats/dashboard").then((r) => r.data);
export const getWishlist = () => api.get("/users/wishlist/me").then((r) => r.data);
export const toggleWishlist = (productId) => api.post(`/users/wishlist/${productId}`).then((r) => r.data);
