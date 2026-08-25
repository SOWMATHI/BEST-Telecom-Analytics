import api from "./axios";
import { mockProducts } from "./mockData";

let localProducts = [...mockProducts];

export const getProducts = async () => {
  try {
    const res = await api.get("/products");
    const list = res.data?.products || res.data;
    if (Array.isArray(list) && list.length > 0) return res;
    return { data: { products: localProducts } };
  } catch (err) {
    return { data: { products: localProducts } };
  }
};

export const createProduct = async (data) => {
  try {
    const res = await api.post("/products", data);
    return res;
  } catch (err) {
    const newProd = { ...data, _id: `P${Date.now().toString().slice(-4)}` };
    localProducts = [newProd, ...localProducts];
    return { data: newProd };
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await api.put(`/products/${id}`, data);
    return res;
  } catch (err) {
    localProducts = localProducts.map((p) => (p._id === id || p.id === id ? { ...p, ...data } : p));
    return { data: { ...data, _id: id } };
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res;
  } catch (err) {
    localProducts = localProducts.filter((p) => p._id !== id && p.id !== id);
    return { data: { success: true } };
  }
};
