import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "dark") => {
  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#00E599", // Alive Green
        light: "#34D399",
        dark: "#059669",
        contrastText: "#04130C",
      },
      secondary: {
        main: "#FFFFFF",
        light: "#F8FAFC",
        dark: "#94A3B8",
        contrastText: "#070A0E",
      },
      success: {
        main: "#00E599",
        light: "#34D399",
        dark: "#059669",
      },
      warning: {
        main: "#F59E0B",
        light: "#FBBF24",
        dark: "#D97706",
      },
      error: {
        main: "#EF4444",
        light: "#F87171",
        dark: "#DC2626",
      },
      info: {
        main: "#00E599",
        light: "#34D399",
        dark: "#059669",
      },
      background: {
        default: "#070A0E", // Deep Obsidian Black
        paper: "#0D131F",   // Premium Obsidian Glass Card
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#94A3B8",
        disabled: "#64748B",
      },
      divider: "rgba(255, 255, 255, 0.08)",
      action: {
        hover: "rgba(255, 255, 255, 0.04)",
        selected: "rgba(0, 229, 153, 0.12)",
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.03em", color: "#FFFFFF" },
      h2: { fontWeight: 800, letterSpacing: "-0.025em", color: "#FFFFFF" },
      h3: { fontWeight: 800, letterSpacing: "-0.02em", color: "#FFFFFF" },
      h4: { fontWeight: 800, letterSpacing: "-0.015em", color: "#FFFFFF" },
      h5: { fontWeight: 800, letterSpacing: "-0.01em", color: "#FFFFFF" },
      h6: { fontWeight: 700, letterSpacing: "-0.01em", color: "#FFFFFF" },
      subtitle1: { fontWeight: 600, color: "#F8FAFC" },
      subtitle2: { fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem", color: "#94A3B8" },
      body1: { fontWeight: 400, color: "#F1F5F9" },
      body2: { fontWeight: 400, color: "#94A3B8" },
      button: { fontWeight: 700, textTransform: "none", letterSpacing: "0.01em" },
      caption: { fontWeight: 600, fontSize: "0.75rem", color: "#94A3B8" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#070A0E",
            color: "#FFFFFF",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#070A0E",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#1E293B",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#00E599",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "#0D131F",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              borderColor: "rgba(0, 229, 153, 0.3)",
              boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 229, 153, 0.06)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "9px 20px",
            fontWeight: 700,
            fontSize: "0.875rem",
            boxShadow: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "none",
            },
          },
          containedPrimary: {
            background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
            color: "#04130C",
            boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #34D399 0%, #00E599 100%)",
              boxShadow: "0 6px 24px rgba(0, 229, 153, 0.5)",
              transform: "translateY(-1px)",
            },
          },
          outlined: {
            borderColor: "rgba(255, 255, 255, 0.15)",
            color: "#FFFFFF",
            "&:hover": {
              borderColor: "#00E599",
              color: "#00E599",
              backgroundColor: "rgba(0, 229, 153, 0.06)",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            color: "#94A3B8",
            fontSize: "0.875rem",
          },
          head: {
            fontWeight: 700,
            color: "#94A3B8",
            backgroundColor: "#090E18",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontSize: "0.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "rgba(7, 10, 14, 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "none",
            color: "#FFFFFF",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "#070A0E",
            boxShadow: "none",
            color: "#FFFFFF",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: "#0A0E17",
            color: "#FFFFFF",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.12)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 229, 153, 0.4)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00E599",
              borderWidth: "1.5px",
              boxShadow: "0 0 12px rgba(0, 229, 153, 0.2)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.75rem",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            backgroundColor: "#0D131F",
            border: "1px solid rgba(0, 229, 153, 0.2)",
            boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 229, 153, 0.08)",
          },
        },
      },
    },
  });
};
