import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, Chip, IconButton, Tooltip,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Alert,
  Divider,
} from "@mui/material";
import {
  Notifications as NotifIcon, DoneAll, CheckCircle,
  WarningAmber, Info, DeleteSweep, Storefront, LocationCity,
} from "@mui/icons-material";
import { getNotifications, markAsRead, markAllRead } from "../../api/notifications";
import { mockNotifications } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

const getIcon = (type) => {
  switch (type) {
    case "low_stock": return <WarningAmber sx={{ color: "#EF4444" }} />;
    case "success": return <CheckCircle sx={{ color: "#00E599" }} />;
    default: return <Info sx={{ color: "#00E599" }} />;
  }
};

export default function Notifications() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [notifs, setNotifs] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      const items = res.data?.notifications || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(items) && items.length > 0) {
        setNotifs(items);
      } else {
        setNotifs(mockNotifications);
      }
    } catch {
      setNotifs(mockNotifications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifs((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const branchFiltered = filterByBranch(notifs);
  const unreadCount = branchFiltered.filter((n) => !n.isRead).length;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Wholesale Operations Telemetry & Alerts
            </Typography>
            <Chip
              label={currentBranch.name}
              size="small"
              sx={{
                bgcolor: "rgba(0, 229, 153, 0.15)",
                color: "#00E599",
                border: "1px solid rgba(0, 229, 153, 0.35)",
                fontWeight: 800,
                fontSize: 10,
              }}
            />
          </Box>
          <Typography variant="body2" color="#94A3B8">
            {unreadCount} unread system notifications across Coimbatore & Tirupur hubs
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<DoneAll />}
            onClick={handleMarkAll}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              color: "#00E599",
              borderColor: "rgba(0, 229, 153, 0.3)",
              "&:hover": { borderColor: "#00E599", bgcolor: "rgba(0, 229, 153, 0.08)" },
            }}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F" }}>
        <List disablePadding>
          {branchFiltered.map((n, i) => (
            <Box key={n._id || i}>
              <ListItem
                sx={{
                  py: 2,
                  px: 3,
                  bgcolor: n.isRead ? "transparent" : "rgba(0, 229, 153, 0.04)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02)" },
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <ListItemAvatar sx={{ minWidth: 44, mt: 0.3 }}>
                  <Avatar sx={{ bgcolor: n.isRead ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 229, 153, 0.15)", border: "1px solid rgba(255, 255, 255, 0.08)", width: 38, height: 38 }}>
                    {getIcon(n.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3, flexWrap: "wrap" }}>
                      <Typography variant="body2" fontWeight={800} color="#FFFFFF">
                        {n.title}
                      </Typography>
                      {!n.isRead && (
                        <Chip label="NEW" size="small" sx={{ bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800, fontSize: 9.5, height: 18 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.3 }}>
                      <Typography variant="body2" color="#94A3B8" sx={{ fontSize: 13 }}>
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="#64748B" sx={{ display: "block", mt: 0.5 }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }) : "Today"}
                      </Typography>
                    </Box>
                  }
                />
                {!n.isRead && (
                  <Tooltip title="Mark as read">
                    <IconButton size="small" onClick={() => handleMarkRead(n._id)} sx={{ color: "#94A3B8", "&:hover": { color: "#00E599" }, mt: 0.5 }}>
                      <CheckCircle fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItem>
              {i < branchFiltered.length - 1 && <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />}
            </Box>
          ))}
          {branchFiltered.length === 0 && (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <NotifIcon sx={{ fontSize: 44, color: "#64748B", mb: 1 }} />
              <Typography variant="body2" color="#94A3B8">No telemetry alerts for {currentBranch.name}</Typography>
            </Box>
          )}
        </List>
      </Card>
    </Box>
  );
}
