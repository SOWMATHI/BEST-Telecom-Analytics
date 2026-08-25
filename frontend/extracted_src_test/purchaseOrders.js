import api from "./axios";
export const getPurchaseOrders = (params) => api.get("/purchase-orders", { params });
export const getPurchaseOrder = (id) => api.get(`/purchase-orders/${id}`);
export const createPurchaseOrder = (data) => api.post("/purchase-orders", data);
export const updatePurchaseOrder = (id, data) => api.put(`/purchase-orders/${id}`, data);
export const deletePurchaseOrder = (id) => api.delete(`/purchase-orders/${id}`);
