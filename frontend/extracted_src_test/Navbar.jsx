import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Box, Avatar, IconButton, Badge,
  TextField, InputAdornment, Menu, MenuItem, Divider, Chip,
} from "@mui/material";
import { NotificationsNone, Search, LightMode, DarkMode, AccountCircle, Logout, Settings } from "@mui/icons-material";

const DRAWER_WIDTH = 270;

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/sales": "Sales",
  "/customers": "Customers",
  "/employees": "Employees",
  "/inventory": "Inventory",
  "/suppliers": "Suppliers",
  "/purchase-orders": "Purchase Orders",
  "/reports": "Reports",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export default function Navbar({ onThemeToggle, isDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const pageTitle = PAGE_TITLES[location.pathname] || "Dashboard";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        color: "#111827",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar sx={{ height: 80, display: "flex", justifyContent: "space-between", alignItems: "center", px: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">{pageTitle}</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>{today}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search anything..."
            sx={{
              width: 240,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#F8FAFC",
                "& fieldset": { borderColor: "#E2E8F0" },
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: "#94A3B8" }} /></InputAdornment>,
            }}
          />

          <IconButton onClick={onThemeToggle} sx={{ color: "#64748B", "&:hover": { bgcolor: "#F1F5F9" } }}>
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>

          <IconButton onClick={() => navigate("/notifications")} sx={{ color: "#64748B", "&:hover": { bgcolor: "#F1F5F9" } }}>
            <Badge badgeContent={4} color="error">
              <NotificationsNone />
            </Badge>
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: "#1976D2", width: 38, height: 38, fontWeight: 700, fontSize: 15 }}>AD</Avatar>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography variant="body2" fontWeight={700} lineHeight={1.2}>Admin</Typography>
              <Typography variant="caption" color="text.secondary">admin@besttelecom.in</Typography>
            </Box>
          </Box>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{ sx: { mt: 1, borderRadius: 3, minWidth: 180, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" } }}>
            <MenuItem onClick={() => { navigate("/settings"); setAnchorEl(null); }}>
              <AccountCircle sx={{ mr: 1.5, fontSize: 20, color: "#64748B" }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate("/settings"); setAnchorEl(null); }}>
              <Settings sx={{ mr: 1.5, fontSize: 20, color: "#64748B" }} /> Settings
            </MenuItem>
            <Divider />
            <MenuItem sx={{ color: "#DC2626" }}>
              <Logout sx={{ mr: 1.5, fontSize: 20 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
