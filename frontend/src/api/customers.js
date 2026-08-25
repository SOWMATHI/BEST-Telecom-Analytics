import api from "./axios";
import { mockCustomers } from "./mockData";

let localCustomers = [...mockCustomers];

export const getCustomers = async () => {
  try {
    const res = await api.get("/customers");
    const list = res.data?.customers || res.data;
    if (Array.isArray(list) && list.length > 0) return res;
    return { data: { customers: localCustomers } };
  } catch (err) {
    return { data: { customers: localCustomers } };
  }
};

export const createCustomer = async (data) => {
  try {
    const res = await api.post("/customers", data);
    return res;
  } catch (err) {
    const newCust = { ...data, _id: `C${Date.now().toString().slice(-4)}` };
    localCustomers = [newCust, ...localCustomers];
    return { data: newCust };
  }
};

export const updateCustomer = async (id, data) => {
  try {
    const res = await api.put(`/customers/${id}`, data);
    return res;
  } catch (err) {
    localCustomers = localCustomers.map((c) => (c._id === id || c.id === id ? { ...c, ...data } : c));
    return { data: { ...data, _id: id } };
  }
};

export const deleteCustomer = async (id) => {
  try {
    const res = await api.delete(`/customers/${id}`);
    return res;
  } catch (err) {
    localCustomers = localCustomers.filter((c) => c._id !== id && c.id !== id);
    return { data: { success: true } };
  }
};
