import api from "./axios";
import { mockSuppliers } from "./mockData";

let localSuppliers = [...mockSuppliers];

export const getSuppliers = async () => {
  try {
    const res = await api.get("/suppliers");
    const list = res.data?.suppliers || res.data;
    if (Array.isArray(list) && list.length > 0) return res;
    return { data: { suppliers: localSuppliers } };
  } catch (err) {
    return { data: { suppliers: localSuppliers } };
  }
};

export const createSupplier = async (data) => {
  try {
    const res = await api.post("/suppliers", data);
    return res;
  } catch (err) {
    const newSup = { ...data, _id: `SUP${Date.now().toString().slice(-4)}` };
    localSuppliers = [newSup, ...localSuppliers];
    return { data: newSup };
  }
};

export const updateSupplier = async (id, data) => {
  try {
    const res = await api.put(`/suppliers/${id}`, data);
    return res;
  } catch (err) {
    localSuppliers = localSuppliers.map((s) => (s._id === id || s.id === id ? { ...s, ...data } : s));
    return { data: { ...data, _id: id } };
  }
};

export const deleteSupplier = async (id) => {
  try {
    const res = await api.delete(`/suppliers/${id}`);
    return res;
  } catch (err) {
    localSuppliers = localSuppliers.filter((s) => s._id !== id && s.id !== id);
    return { data: { success: true } };
  }
};
