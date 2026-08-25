import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Divider, IconButton, Tooltip,
} from "@mui/material";
import {
  Dashboard, Inventory2, ShoppingCart, People, Badge, Store,
  LocalShipping, Description, Assessment, Settings, Notifications,
  ChevronLeft, Menu, SignalCellularAlt, AssignmentTurnedIn,
} from "@mui/icons-material";
import { useBranch } from "../../context/BranchContext";

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard sx={{ fontSize: 20 }} />, path: "/dashboard" },
  { text: "Shop Orders & Supply", icon: <AssignmentTurnedIn sx={{ fontSize: 20 }} />, path: "/shop-orders" },
  { text: "Gadgets Catalog", icon: <Inventory2 sx={{ fontSize: 20 }} />, path: "/products" },
  { text: "Wholesale Sales", icon: <ShoppingCart sx={{ fontSize: 20 }} />, path: "/sales" },
  { text: "Retailers & Dealers", icon: <People sx={{ fontSize: 20 }} />, path: "/customers" },
  { text: "Staff & Leads", icon: <Badge sx={{ fontSize: 20 }} />, path: "/employees" },
  { text: "Warehouse Stock", icon: <Store sx={{ fontSize: 20 }} />, path: "/inventory" },
  { text: "Vendors & OEMs", icon: <LocalShipping sx={{ fontSize: 20 }} />, path: "/suppliers" },
  { text: "Procurement POs", icon: <Description sx={{ fontSize: 20 }} />, path: "/purchase-orders" },
  { text: "Financial Reports", icon: <Assessment sx={{ fontSize: 20 }} />, path: "/reports" },
  { text: "Operations Alerts", icon: <Notifications sx={{ fontSize: 20 }} />, path: "/notifications" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBranch } = useBranch();
  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          bgcolor: "#070A0E",
          color: "#FFFFFF",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width .25s ease",
          boxShadow: "none",
        },
      }}
    >
      {/* Brand Header */}
      <Toolbar
        sx={{
          py: 2,
          px: collapsed ? 1.5 : 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: "74px !important",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                bgcolor: "#00E599",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#04130C",
                boxShadow: "0 0 16px rgba(0, 229, 153, 0.45)",
                flexShrink: 0,
              }}
            >
              <SignalCellularAlt sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={900} color="#FFFFFF" lineHeight={1.2} letterSpacing="-0.02em">
                BEST<span style={{ color: "#00E599" }}>Telecom</span>
              </Typography>
              <Typography variant="caption" sx={{ color: "#00E599", fontWeight: 800, fontSize: 9.5, letterSpacing: "0.08em" }}>
                COIMBATORE · TIRUPUR
              </Typography>
            </Box>
          </Box>
        )}

        {collapsed && (
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              bgcolor: "#00E599",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#04130C",
              boxShadow: "0 0 16px rgba(0, 229, 153, 0.45)",
              cursor: "pointer",
            }}
            onClick={() => setCollapsed(false)}
          >
            <SignalCellularAlt sx={{ fontSize: 22 }} />
          </Box>
        )}

        {!collapsed && (
          <IconButton
            onClick={() => setCollapsed(true)}
            size="small"
            sx={{
              color: "#94A3B8",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 2,
              "&:hover": { color: "#00E599", bgcolor: "rgba(0, 229, 153, 0.08)", borderColor: "rgba(0, 229, 153, 0.3)" },
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
        )}
      </Toolbar>

      {collapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}>
          <IconButton
            onClick={() => setCollapsed(false)}
            size="small"
            sx={{
              color: "#94A3B8",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 2,
              "&:hover": { color: "#00E599", bgcolor: "rgba(0, 229, 153, 0.08)" },
            }}
          >
            <Menu fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Nav Menu */}
      <List sx={{ mt: 1.5, px: collapsed ? 1 : 1.5, flexGrow: 1 }}>
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              display: "block",
              color: "#64748B",
              fontWeight: 800,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Wholesale Operations
          </Typography>
        )}

        {menuItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Tooltip key={item.text} title={collapsed ? item.text : ""} placement="right" arrow>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: collapsed ? 1.5 : 1.8,
                  justifyContent: collapsed ? "center" : "flex-start",
                  minHeight: 44,
                  transition: "all 0.15s ease",
                  "&.Mui-selected": {
                    bgcolor: "rgba(0, 229, 153, 0.12)",
                    color: "#00E599",
                    border: "1px solid rgba(0, 229, 153, 0.25)",
                    "& .MuiListItemIcon-root": { color: "#00E599" },
                    "&:hover": {
                      bgcolor: "rgba(0, 229, 153, 0.18)",
                    },
                  },
                  "&:hover:not(.Mui-selected)": {
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    color: "#FFFFFF",
                    "& .MuiListItemIcon-root": { color: "#FFFFFF" },
                  },
                  "& .MuiListItemIcon-root": {
                    color: active ? "#00E599" : "#94A3B8",
                    transition: "color 0.15s ease",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 34, mr: collapsed ? 0 : 0 }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 13.5,
                      fontWeight: active ? 800 : 500,
                      color: active ? "#00E599" : "#E2E8F0",
                    }}
                  />
                )}
                {!collapsed && active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#00E599",
                      boxShadow: "0 0 8px #00E599",
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

      {/* Hub Location Badge in Footer */}
      <List sx={{ p: collapsed ? 1 : 1.5 }}>
        <Tooltip title={collapsed ? "Settings" : ""} placement="right" arrow>
          <ListItemButton
            onClick={() => navigate("/settings")}
            selected={location.pathname === "/settings"}
            sx={{
              borderRadius: 2,
              px: collapsed ? 1.5 : 1.8,
              justifyContent: collapsed ? "center" : "flex-start",
              minHeight: 44,
              "&.Mui-selected": {
                bgcolor: "rgba(0, 229, 153, 0.12)",
                color: "#00E599",
                border: "1px solid rgba(0, 229, 153, 0.25)",
                "& .MuiListItemIcon-root": { color: "#00E599" },
              },
              "&:hover:not(.Mui-selected)": {
                bgcolor: "rgba(255, 255, 255, 0.04)",
                color: "#FFFFFF",
              },
              "& .MuiListItemIcon-root": {
                color: location.pathname === "/settings" ? "#00E599" : "#94A3B8",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 34 }}>
              <Settings sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600, color: "#E2E8F0" }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {!collapsed && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: "rgba(13, 19, 31, 0.8)",
              border: "1px solid rgba(0, 229, 153, 0.2)",
              display: "flex",
              flexDirection: "column",
              gap: 0.8,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#00E599", boxShadow: "0 0 8px #00E599" }} />
                <Typography variant="caption" fontWeight={800} color="#FFFFFF" sx={{ fontSize: 11 }}>
                  {currentBranch.name}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "#00E599", fontWeight: 800, fontSize: 10 }}>
                WHOLESALE
              </Typography>
            </Box>
            <Typography variant="caption" color="#94A3B8" sx={{ fontSize: 10 }}>
              {currentBranch.city} Hub
            </Typography>
          </Box>
        )}
      </List>
    </Drawer>
  );
}
