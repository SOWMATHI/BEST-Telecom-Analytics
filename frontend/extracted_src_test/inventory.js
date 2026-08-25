import api from "./axios";
export const getInventory = (params) => api.get("/inventory", { params });
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);
