import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, Chip, IconButton, Tooltip,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Alert,
  Divider, Badge,
} from "@mui/material";
import {
  Notifications as NotifIcon, DoneAll, Refresh,
  WarningAmber, Info, CheckCircle, Error,
} from "@mui/icons-material";
import { getNotifications, markAsRead, markAllRead } from "../../api/notifications";

const TYPE_CONFIG = {
  warning:  { color: "#D97706", bg: "#FFFBEB", icon: <WarningAmber sx={{ fontSize: 20 }} /> },
  info:     { color: "#1976D2", bg: "#EFF6FF", icon: <Info sx={{ fontSize: 20 }} /> },
  success:  { color: "#16A34A", bg: "#F0FDF4", icon: <CheckCircle sx={{ fontSize: 20 }} /> },
  error:    { color: "#DC2626", bg: "#FEF2F2", icon: <Error sx={{ fontSize: 20 }} /> },
  low_stock:{ color: "#EA580C", bg: "#FFF7ED", icon: <WarningAmber sx={{ fontSize: 20 }} /> },
};

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setItems(res.data?.notifications || res.data || []);
    } catch { setError("Failed to load notifications."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setItems((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch { setError("Failed to mark as read."); }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { setError("Failed to mark all as read."); }
  };

  const unread = items.filter((n) => !n.isRead).length;

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#0F172A">Notifications</Typography>
            <Typography variant="body2" color="text.secondary">{items.length} total · {unread} unread</Typography>
          </Box>
          {unread > 0 && <Chip label={`${unread} New`} color="error" size="small" sx={{ fontWeight: 700 }} />}
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Refresh</Button>
          {unread > 0 && (
            <Button variant="contained" startIcon={<DoneAll />} onClick={handleMarkAll}
              sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#1976D2,#1565C0)", boxShadow: "0 4px 12px rgba(25,118,210,0.35)" }}>
              Mark All Read
            </Button>
          )}
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
        {items.length === 0 && !loading ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <NotifIcon sx={{ fontSize: 56, color: "#CBD5E1", mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">All caught up!</Typography>
            <Typography variant="body2" color="text.secondary">No notifications at the moment.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {items.map((notif, i) => {
              const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
              return (
                <Box key={notif._id || i}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 3, py: 2,
                      bgcolor: notif.isRead ? "transparent" : `${cfg.color}08`,
                      borderLeft: notif.isRead ? "none" : `4px solid ${cfg.color}`,
                      transition: "all .2s ease",
                      "&:hover": { bgcolor: "#F8FAFC" },
                    }}
                    secondaryAction={
                      !notif.isRead && (
                        <Tooltip title="Mark as read">
                          <IconButton size="small" onClick={() => handleMarkRead(notif._id)} sx={{ color: "#94A3B8" }}>
                            <DoneAll fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: cfg.bg, color: cfg.color, width: 40, height: 40 }}>
                        {cfg.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
                          <Typography variant="body2" fontWeight={notif.isRead ? 500 : 700} color="#0F172A">
                            {notif.title || notif.message || "Notification"}
                          </Typography>
                          {!notif.isRead && <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: cfg.color, flexShrink: 0 }} />}
                          <Chip label={notif.type || "info"} size="small" sx={{ fontSize: 10, fontWeight: 700, bgcolor: cfg.bg, color: cfg.color, ml: "auto" }} />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {notif.message || notif.description || ""}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#94A3B8", mt: 0.5, display: "block" }}>
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleString("en-IN") : ""}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {i < items.length - 1 && <Divider sx={{ borderColor: "#F1F5F9" }} />}
                </Box>
              );
            })}
          </List>
        )}
      </Card>
    </Box>
  );
}
