import api from "./axios";
import { mockEmployees } from "./mockData";

let localEmployees = [...mockEmployees];

export const getEmployees = async () => {
  try {
    const res = await api.get("/employees");
    const list = res.data?.employees || res.data;
    if (Array.isArray(list) && list.length > 0) return res;
    return { data: { employees: localEmployees } };
  } catch (err) {
    return { data: { employees: localEmployees } };
  }
};

export const createEmployee = async (data) => {
  try {
    const res = await api.post("/employees", data);
    return res;
  } catch (err) {
    const newEmp = { ...data, _id: `E${Date.now().toString().slice(-4)}`, monthlySales: 0 };
    localEmployees = [newEmp, ...localEmployees];
    return { data: newEmp };
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const res = await api.put(`/employees/${id}`, data);
    return res;
  } catch (err) {
    localEmployees = localEmployees.map((e) => (e._id === id || e.id === id ? { ...e, ...data } : e));
    return { data: { ...data, _id: id } };
  }
};

export const deleteEmployee = async (id) => {
  try {
    const res = await api.delete(`/employees/${id}`);
    return res;
  } catch (err) {
    localEmployees = localEmployees.filter((e) => e._id !== id && e.id !== id);
    return { data: { success: true } };
  }
};
