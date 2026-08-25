import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Avatar, Divider, IconButton, Tooltip,
} from "@mui/material";
import {
  Dashboard, Inventory2, ShoppingCart, People, Badge, Store,
  LocalShipping, Description, Assessment, Settings, Notifications,
  ChevronLeft, ChevronRight, Menu,
} from "@mui/icons-material";

const DRAWER_WIDTH = 270;
const COLLAPSED_WIDTH = 72;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Products", icon: <Inventory2 />, path: "/products" },
  { text: "Sales", icon: <ShoppingCart />, path: "/sales" },
  { text: "Customers", icon: <People />, path: "/customers" },
  { text: "Employees", icon: <Badge />, path: "/employees" },
  { text: "Inventory", icon: <Store />, path: "/inventory" },
  { text: "Suppliers", icon: <LocalShipping />, path: "/suppliers" },
  { text: "Purchase Orders", icon: <Description />, path: "/purchase-orders" },
  { text: "Reports", icon: <Assessment />, path: "/reports" },
  { text: "Notifications", icon: <Notifications />, path: "/notifications" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          bgcolor: "#0F172A",
          color: "#fff",
          border: "none",
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width .25s ease",
        },
      }}
    >
      {/* Logo */}
      <Toolbar sx={{ py: 2.5, px: 2, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", minHeight: "80px !important" }}>
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "#1976D2", width: 40, height: 40, fontWeight: 700, fontSize: 14 }}>BT</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>BEST Telecom</Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>Sales Analytics</Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Avatar sx={{ bgcolor: "#1976D2", width: 38, height: 38, fontWeight: 700, fontSize: 13 }}>BT</Avatar>
        )}
        {!collapsed && (
          <IconButton onClick={() => setCollapsed(true)} size="small" sx={{ color: "#64748B", "&:hover": { color: "#fff", bgcolor: "#1E293B" } }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Toolbar>

      {collapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", pb: 1 }}>
          <IconButton onClick={() => setCollapsed(false)} size="small" sx={{ color: "#64748B", "&:hover": { color: "#fff", bgcolor: "#1E293B" } }}>
            <Menu />
          </IconButton>
        </Box>
      )}

      <Divider sx={{ borderColor: "#1E293B" }} />

      {/* Menu */}
      <List sx={{ mt: 1.5, px: collapsed ? 0.5 : 1, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Tooltip key={item.text} title={collapsed ? item.text : ""} placement="right" arrow>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2.5,
                  mb: 0.5,
                  px: collapsed ? 1.5 : 2,
                  justifyContent: collapsed ? "center" : "flex-start",
                  minHeight: 46,
                  "&.Mui-selected": {
                    background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(25,118,210,0.35)",
                    "& .MuiListItemIcon-root": { color: "#fff" },
                  },
                  "&:hover:not(.Mui-selected)": { bgcolor: "#1E293B" },
                  "& .MuiListItemIcon-root": { color: active ? "#fff" : "#64748B" },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, mr: collapsed ? 0 : 0 }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
                  />
                )}
                {!collapsed && !active && (
                  <ChevronRight sx={{ fontSize: 16, color: "#334155" }} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "#1E293B" }} />

      {/* Footer */}
      <List sx={{ p: collapsed ? 0.5 : 1 }}>
        <Tooltip title={collapsed ? "Settings" : ""} placement="right" arrow>
          <ListItemButton
            onClick={() => navigate("/settings")}
            selected={location.pathname === "/settings"}
            sx={{
              borderRadius: 2.5,
              px: collapsed ? 1.5 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              minHeight: 46,
              "&.Mui-selected": {
                background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                "& .MuiListItemIcon-root": { color: "#fff" },
              },
              "&:hover:not(.Mui-selected)": { bgcolor: "#1E293B" },
              "& .MuiListItemIcon-root": { color: "#64748B" },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
              <Settings />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />}
          </ListItemButton>
        </Tooltip>

        {!collapsed && (
          <Box sx={{ mt: 1.5, p: 2, borderRadius: 2.5, bgcolor: "#111827", textAlign: "center" }}>
            <Typography variant="caption" fontWeight={700} display="block">BEST Telecom Analytics</Typography>
            <Typography variant="caption" sx={{ color: "#475569" }}>v1.0.0</Typography>
          </Box>
        )}
      </List>
    </Drawer>
  );
}
