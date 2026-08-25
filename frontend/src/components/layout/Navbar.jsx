import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Box, Avatar, IconButton, Badge,
  TextField, InputAdornment, Menu, MenuItem, Divider, Chip, Button,
} from "@mui/material";
import {
  NotificationsNone, Search, AccountCircle, Logout, Settings,
  Storefront, LocationCity, Hub, ArrowDropDown, Check,
} from "@mui/icons-material";
import { useBranch, BRANCHES } from "../../context/BranchContext";

const DRAWER_WIDTH = 260;

const PAGE_TITLES = {
  "/dashboard": "Wholesale Operations Dashboard",
  "/shop-orders": "Retailer Shop Orders & Supply Chain",
  "/products": "Electronic Gadgets & Catalog",
  "/sales": "B2B Wholesale Invoices",
  "/customers": "Retailer & Dealer Accounts",
  "/employees": "Branch Workforce & Leads",
  "/inventory": "Warehouse Stock & Cartons",
  "/suppliers": "Gadget Manufacturers & Vendors",
  "/purchase-orders": "Bulk Procurement Orders",
  "/reports": "Wholesale Financial Analytics",
  "/notifications": "Operations Telemetry",
  "/settings": "Settings & Hub Config",
  "/profile": "Admin Profile",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBranch, setSelectedBranch, currentBranch } = useBranch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [branchAnchorEl, setBranchAnchorEl] = useState(null);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  const pageTitle = PAGE_TITLES[location.pathname] || "Wholesale Hub";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        bgcolor: "rgba(7, 10, 14, 0.88)",
        backdropFilter: "blur(16px)",
        color: "#FFFFFF",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.2s ease",
      }}
    >
      <Toolbar sx={{ height: 74, display: "flex", justifyContent: "space-between", alignItems: "center", px: 3.5 }}>
        {/* Left: Page Title & Subtitle */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h6" fontWeight={900} color="#FFFFFF" letterSpacing="-0.015em">
              {pageTitle}
            </Typography>
            <Chip
              label="WHOLESALE HUB"
              size="small"
              sx={{
                bgcolor: "rgba(0, 229, 153, 0.12)",
                color: "#00E599",
                border: "1px solid rgba(0, 229, 153, 0.3)",
                fontWeight: 800,
                fontSize: 9.5,
                height: 20,
              }}
            />
          </Box>
          <Typography variant="caption" color="#94A3B8" fontWeight={500}>
            {today} · Coimbatore & Tirupur Wholesale Operations
          </Typography>
        </Box>

        {/* Right Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Quick Search */}
          <TextField
            size="small"
            placeholder="Search gadgets, IMEI, SKU..."
            sx={{
              width: { xs: 150, md: 220 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#0A0E17",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                "&:hover fieldset": { borderColor: "rgba(0, 229, 153, 0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#00E599" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: "#00E599" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Branch Switcher Button */}
          <Button
            onClick={(e) => setBranchAnchorEl(e.currentTarget)}
            variant="outlined"
            size="small"
            startIcon={
              selectedBranch === "all" ? (
                <Hub sx={{ color: "#00E599 !important" }} />
              ) : selectedBranch === "coimbatore" ? (
                <Storefront sx={{ color: "#34D399 !important" }} />
              ) : (
                <LocationCity sx={{ color: "#00F59B !important" }} />
              )
            }
            endIcon={<ArrowDropDown sx={{ color: "#94A3B8" }} />}
            sx={{
              borderRadius: 2.5,
              borderColor: "rgba(0, 229, 153, 0.35)",
              bgcolor: "rgba(0, 229, 153, 0.08)",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: 12.5,
              px: 1.8,
              py: 0.7,
              textTransform: "none",
              boxShadow: "0 0 14px rgba(0, 229, 153, 0.15)",
              "&:hover": {
                borderColor: "#00E599",
                bgcolor: "rgba(0, 229, 153, 0.15)",
              },
            }}
          >
            {currentBranch.name}
          </Button>

          {/* Branch Dropdown Menu */}
          <Menu
            anchorEl={branchAnchorEl}
            open={Boolean(branchAnchorEl)}
            onClose={() => setBranchAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2.5,
                minWidth: 260,
                bgcolor: "#0D131F",
                border: "1px solid rgba(0, 229, 153, 0.3)",
                boxShadow: "0 15px 40px rgba(0,0,0,0.85)",
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.2, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <Typography variant="caption" fontWeight={800} color="#00E599" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Select Wholesale Location
              </Typography>
            </Box>

            {BRANCHES.map((b) => {
              const isSelected = selectedBranch === b.id;
              return (
                <MenuItem
                  key={b.id}
                  onClick={() => {
                    setSelectedBranch(b.id);
                    setBranchAnchorEl(null);
                  }}
                  sx={{
                    py: 1.2,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: isSelected ? "rgba(0, 229, 153, 0.12)" : "transparent",
                    "&:hover": { bgcolor: "rgba(0, 229, 153, 0.18)" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {b.id === "all" ? (
                      <Hub sx={{ color: "#00E599", fontSize: 20 }} />
                    ) : b.id === "coimbatore" ? (
                      <Storefront sx={{ color: "#34D399", fontSize: 20 }} />
                    ) : (
                      <LocationCity sx={{ color: "#00F59B", fontSize: 20 }} />
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight={800} color={isSelected ? "#00E599" : "#FFFFFF"}>
                        {b.name}
                      </Typography>
                      <Typography variant="caption" color="#94A3B8" sx={{ fontSize: 11 }}>
                        {b.city} ({b.code})
                      </Typography>
                    </Box>
                  </Box>
                  {isSelected && <Check sx={{ color: "#00E599", fontSize: 18 }} />}
                </MenuItem>
              );
            })}
          </Menu>

          {/* Notifications */}
          <IconButton
            onClick={() => navigate("/notifications")}
            sx={{
              color: "#94A3B8",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 2,
              p: 1,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.06)", color: "#00E599", borderColor: "rgba(0, 229, 153, 0.3)" },
            }}
          >
            <Badge badgeContent={4} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16, bgcolor: "#EF4444" } }}>
              <NotificationsNone sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>

          {/* User Profile Pill */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              pl: 1,
              py: 0.5,
              pr: 1.5,
              borderRadius: 2.5,
              border: "1px solid rgba(0, 229, 153, 0.3)",
              bgcolor: "#0D131F",
              transition: "all 0.15s ease",
              "&:hover": { bgcolor: "#131B2C", borderColor: "#00E599", boxShadow: "0 0 16px rgba(0, 229, 153, 0.15)" },
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar sx={{ bgcolor: "#00E599", width: 32, height: 32, fontWeight: 900, fontSize: 13, color: "#04130C" }}>
              AD
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
              <Typography variant="body2" fontWeight={800} color="#FFFFFF" lineHeight={1.2} fontSize={13}>
                Admin
              </Typography>
              <Typography variant="caption" color="#00E599" fontWeight={700} fontSize={10.5}>
                Wholesale Lead
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2.5,
                minWidth: 190,
                bgcolor: "#0D131F",
                border: "1px solid rgba(0, 229, 153, 0.25)",
                boxShadow: "0 15px 40px rgba(0,0,0,0.8)",
              },
            }}
          >
            <MenuItem onClick={() => { navigate("/profile"); setAnchorEl(null); }} sx={{ py: 1, fontSize: 13.5, fontWeight: 600, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(0, 229, 153, 0.08)", color: "#00E599" } }}>
              <AccountCircle sx={{ mr: 1.5, fontSize: 19, color: "#94A3B8" }} /> My Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate("/settings"); setAnchorEl(null); }} sx={{ py: 1, fontSize: 13.5, fontWeight: 600, color: "#FFFFFF", "&:hover": { bgcolor: "rgba(0, 229, 153, 0.08)", color: "#00E599" } }}>
              <Settings sx={{ mr: 1.5, fontSize: 19, color: "#94A3B8" }} /> Settings
            </MenuItem>
            <Divider sx={{ my: 0.5, borderColor: "rgba(255, 255, 255, 0.08)" }} />
            <MenuItem onClick={() => { navigate("/login"); setAnchorEl(null); }} sx={{ color: "#EF4444", py: 1, fontSize: 13.5, fontWeight: 700, "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}>
              <Logout sx={{ mr: 1.5, fontSize: 19 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
