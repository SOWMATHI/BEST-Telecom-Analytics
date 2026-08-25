import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ onThemeToggle, isDark }) {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
        transition: "background-color 0.2s ease",
      }}
    >
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Navbar onThemeToggle={onThemeToggle} isDark={isDark} />
        <Toolbar sx={{ minHeight: "74px !important" }} />
        <Box sx={{ p: { xs: 2.5, sm: 3.5, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
