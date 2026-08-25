import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  SignalCellularAlt,
  Security,
  Bolt,
  Storefront,
  Hub,
  CheckCircle,
  HelpOutline,
  ContentCopy,
  Storage,
  Lan,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login-bg.jpg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@besttelecom.in");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState("admin");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("best_auth", "true");
      localStorage.setItem("best_user_role", selectedRole);
      navigate("/dashboard");
    }, 700);
  };

  const handleFillDemo = (role = "admin") => {
    setSelectedRole(role);
    if (role === "admin") {
      setEmail("admin@besttelecom.in");
      setPassword("admin123");
    } else if (role === "manager") {
      setEmail("cbe.store@besttelecom.in");
      setPassword("manager123");
    } else {
      setEmail("inventory@besttelecom.in");
      setPassword("stock123");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${loginBg}), url('/login-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: { xs: 2, md: 4 },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.90) 0%, rgba(10, 14, 22, 0.82) 50%, rgba(0, 0, 0, 0.94) 100%)",
          backdropFilter: "blur(4px)",
          zIndex: 1,
        },
      }}
    >
      {/* Monochrome Grid Overlay & Subtle Neutral Ambient Glow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent 70%)",
          top: "-15%",
          left: "-10%",
          zIndex: 2,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.06), transparent 70%)",
          bottom: "-15%",
          right: "-10%",
          zIndex: 2,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Main Container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1080,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
          gap: { xs: 3, md: 4 },
          alignItems: "center",
        }}
      >
        {/* Left Side: Brand Showcase & Telemetry Highlights (Black & White Theme) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 3,
            color: "#FFFFFF",
            pr: 2,
          }}
        >
          {/* Logo Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3.5,
                background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.35)",
                color: "#000000",
              }}
            >
              <SignalCellularAlt sx={{ fontSize: 34, color: "#000000" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={900} color="#FFFFFF" letterSpacing="-0.03em" lineHeight={1.1}>
                BEST<span style={{ color: "#94A3B8" }}>Telecom</span>
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, letterSpacing: "0.1em" }}>
                ENTERPRISE WHOLESALE ANALYTICS
              </Typography>
            </Box>
          </Box>

          {/* Tagline */}
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: "#FFFFFF", mb: 1, letterSpacing: "-0.01em" }}>
              Smart Telecom & Retail Showroom Intelligence
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", lineHeight: 1.6, maxWidth: 460 }}>
              Real-time multi-branch sync across Coimbatore & Tirupur showrooms. Monitor live IMEI tracking, wholesale cartons, supplier invoices, and inventory analytics in one unified dashboard.
            </Typography>
          </Box>

          {/* Feature Badges Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.8 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(18, 24, 38, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.8 }}>
                <Storefront sx={{ color: "#FFFFFF", fontSize: 22 }} />
                <Typography variant="subtitle2" fontWeight={800} color="#FFFFFF">
                  Multi-Store POS
                </Typography>
              </Box>
              <Typography variant="caption" color="#94A3B8" sx={{ fontSize: 11.5, display: "block" }}>
                Live billing, barcode scanning & instant invoice dispatch
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(18, 24, 38, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.8 }}>
                <Hub sx={{ color: "#FFFFFF", fontSize: 22 }} />
                <Typography variant="subtitle2" fontWeight={800} color="#FFFFFF">
                  Cloud Telemetry
                </Typography>
              </Box>
              <Typography variant="caption" color="#94A3B8" sx={{ fontSize: 11.5, display: "block" }}>
                Seamless real-time inventory and supplier chain tracking
              </Typography>
            </Box>
          </Box>

        </Box>

        {/* Right Side: Ultra Glassmorphism Login Card (Black & White Monochrome) */}
        <Card
          sx={{
            width: "100%",
            borderRadius: 4,
            bgcolor: "rgba(12, 17, 29, 0.92)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow:
              "0 25px 70px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(255, 255, 255, 0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Monochrome Accent Line */}
          <Box
            sx={{
              height: 4,
              background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.4) 50%, #FFFFFF 100%)",
            }}
          />

          <CardContent sx={{ p: { xs: 3.5, sm: 4.5 } }}>
            {/* Header for Mobile / Tablet */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
                  color: "#000000",
                  mb: 1.5,
                }}
              >
                <SignalCellularAlt sx={{ fontSize: 28, color: "#000000" }} />
              </Box>
              <Typography variant="h5" fontWeight={900} color="#FFFFFF">
                BEST<span style={{ color: "#94A3B8" }}>Telecom</span>
              </Typography>
              <Typography variant="caption" color="#94A3B8">
                Enterprise Wholesale Analytics Portal
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
                <Typography variant="h5" fontWeight={800} color="#FFFFFF" letterSpacing="-0.02em">
                  Sign In
                </Typography>
                <Chip
                  label="SECURE ACCESS"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    fontWeight: 800,
                    fontSize: 10,
                    height: 22,
                    letterSpacing: "0.06em",
                  }}
                />
              </Box>
              <Typography variant="body2" color="#94A3B8">
                Enter your credentials to access operations dashboard
              </Typography>
            </Box>

            {/* Role Quick Selector Tabs */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#FFFFFF"
                sx={{ textTransform: "uppercase", letterSpacing: "0.06em", display: "block", mb: 1 }}
              >
                Access Level / Role
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
                {[
                  { id: "admin", label: "Admin", sub: "HQ Lead" },
                  { id: "manager", label: "Manager", sub: "Coimbatore" },
                  { id: "stock", label: "Inventory", sub: "Warehouse" },
                ].map((r) => {
                  const isActive = selectedRole === r.id;
                  return (
                    <Button
                      key={r.id}
                      onClick={() => handleFillDemo(r.id)}
                      size="small"
                      sx={{
                        py: 0.8,
                        borderRadius: 2,
                        flexDirection: "column",
                        textTransform: "none",
                        bgcolor: isActive ? "#FFFFFF !important" : "rgba(255,255,255,0.03) !important",
                        color: isActive ? "#000000 !important" : "#94A3B8 !important",
                        border: "1px solid",
                        borderColor: isActive ? "#FFFFFF !important" : "rgba(255,255,255,0.15) !important",
                        fontWeight: 800,
                        boxShadow: isActive ? "0 0 16px rgba(255, 255, 255, 0.3) !important" : "none",
                        "&:hover": {
                          bgcolor: isActive ? "#FFFFFF !important" : "rgba(255, 255, 255, 0.1) !important",
                          borderColor: "#FFFFFF !important",
                          color: isActive ? "#000000 !important" : "#FFFFFF !important",
                        },
                      }}
                    >
                      <Typography variant="body2" fontWeight={800} fontSize={12} lineHeight={1.2}>
                        {r.label}
                      </Typography>
                      <Typography variant="caption" fontSize={9.5} sx={{ opacity: isActive ? 0.7 : 0.6 }}>
                        {r.sub}
                      </Typography>
                    </Button>
                  );
                })}
              </Box>
            </Box>

            <form onSubmit={handleLogin}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                {/* Email Field */}
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="#FFFFFF"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.06em", display: "block", mb: 0.8 }}
                  >
                    Operator / Admin Email
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    placeholder="admin@besttelecom.in"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "#FFFFFF", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                        bgcolor: "#080C14",
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFFFFF !important",
                          boxShadow: "0 0 14px rgba(255, 255, 255, 0.2) !important",
                        },
                      },
                      "& input": { color: "#FFFFFF", fontWeight: 600, fontSize: 14 },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="#FFFFFF"
                      sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
                    >
                      Master Access Key
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#94A3B8"
                      sx={{ fontSize: 11, cursor: "pointer", "&:hover": { color: "#FFFFFF", textDecoration: "underline" } }}
                      onClick={() => handleFillDemo(selectedRole)}
                    >
                      Reset to demo
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    required
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "#FFFFFF", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "#94A3B8" }}
                          >
                            {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                        bgcolor: "#080C14",
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFFFFF !important",
                          boxShadow: "0 0 14px rgba(255, 255, 255, 0.2) !important",
                        },
                      },
                      "& input": { color: "#FFFFFF", fontWeight: 600, fontSize: 14 },
                    }}
                  />
                </Box>

                {/* Session & Quick Action */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{ color: "#64748B", "&.Mui-checked": { color: "#FFFFFF !important" } }}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="#94A3B8" fontWeight={500} fontSize={13}>
                        Remember credentials
                      </Typography>
                    }
                  />
                  <Button
                    onClick={() => handleFillDemo("admin")}
                    size="small"
                    startIcon={<Bolt sx={{ fontSize: 16, color: "#FFFFFF" }} />}
                    sx={{
                      color: "#FFFFFF !important",
                      fontWeight: 800,
                      fontSize: 12,
                      textTransform: "none",
                      p: 0,
                      "&:hover": { bgcolor: "transparent !important", textDecoration: "underline" },
                    }}
                  >
                    Quick Auto-Fill
                  </Button>
                </Box>

                {/* Submit Button (Monochrome White Button) */}
                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontSize: "1.02rem",
                    fontWeight: 800,
                    background: "#FFFFFF !important",
                    color: "#000000 !important",
                    boxShadow: "none !important",
                    "&:hover": {
                      background: "#E2E8F0 !important",
                      boxShadow: "none !important",
                      transform: "translateY(-1px)",
                    },
                    mt: 1,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#000000" }} />
                  ) : (
                    "Sign In to Wholesale Hub"
                  )}
                </Button>
              </Box>
            </form>

            {/* Security Footer */}
            <Box
              sx={{
                mt: 3.5,
                pt: 2.5,
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Security sx={{ fontSize: 16, color: "#FFFFFF" }} />
              <Typography variant="caption" color="#94A3B8" fontWeight={600}>
                256-Bit Encrypted Session · ISO 27001 Certified
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>


    </Box>
  );
}
