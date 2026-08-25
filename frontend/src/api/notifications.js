import api from "./axios";
import { mockNotifications } from "./mockData";

let localNotifs = [...mockNotifications];

export const getNotifications = async () => {
  try {
    const res = await api.get("/notifications");
    const list = res.data?.notifications || res.data;
    if (Array.isArray(list) && list.length > 0) return res;
    return { data: { notifications: localNotifs } };
  } catch (err) {
    return { data: { notifications: localNotifs } };
  }
};

export const markAsRead = async (id) => {
  try {
    const res = await api.put(`/notifications/${id}/read`);
    return res;
  } catch (err) {
    localNotifs = localNotifs.map((n) => (n._id === id ? { ...n, isRead: true } : n));
    return { data: { success: true } };
  }
};

export const markAllRead = async () => {
  try {
    const res = await api.put("/notifications/read-all");
    return res;
  } catch (err) {
    localNotifs = localNotifs.map((n) => ({ ...n, isRead: true }));
    return { data: { success: true } };
  }
};
