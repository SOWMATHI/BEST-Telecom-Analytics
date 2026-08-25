import api from "./axios";
import { mockProducts } from "./mockData";

export const getInventory = async () => {
  try {
    const res = await api.get("/inventory");
    const list = res.data?.inventory || res.data;
    if (Array.isArray(list) && list.length > 0) return res;
    return { data: { inventory: mockProducts } };
  } catch (err) {
    return { data: { inventory: mockProducts } };
  }
};
