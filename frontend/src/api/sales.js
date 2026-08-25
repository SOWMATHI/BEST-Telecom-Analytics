import api from "./axios";
import { mockRecentSales } from "./mockData";

let localSales = [...mockRecentSales];

export const getSales = async () => {
  try {
    const res = await api.get("/sales");
    const list = Array.isArray(res.data?.sales)
      ? res.data.sales
      : Array.isArray(res.data)
      ? res.data
      : [];
    if (list.length > 0) return { data: { sales: list } };
    return { data: { sales: localSales } };
  } catch (err) {
    return { data: { sales: localSales } };
  }
};

export const createSale = async (data) => {
  try {
    const res = await api.post("/sales", data);
    return res;
  } catch (err) {
    const newSale = {
      ...data,
      _id: `S${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      invoiceNumber: `INV-B2B-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    localSales = [newSale, ...localSales];
    return { data: newSale };
  }
};
