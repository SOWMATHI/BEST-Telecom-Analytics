import { Box, Typography, Button, Container } from "@mui/material";
import { ErrorOutline, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 6,
        }}
      >
        <ErrorOutline sx={{ fontSize: 80, color: "#00E599", mb: 2, filter: "drop-shadow(0 0 16px rgba(0, 229, 153, 0.4))" }} />
        
        <Typography variant="h1" fontWeight={900} color="#FFFFFF" sx={{ fontSize: { xs: "4rem", md: "5.5rem" }, letterSpacing: "-0.03em" }}>
          404
        </Typography>
        
        <Typography variant="h5" fontWeight={800} color="#00E599" mb={1} letterSpacing="-0.01em">
          Telemetry Route Not Found
        </Typography>
        
        <Typography variant="body1" color="#94A3B8" mb={4} maxWidth="sm">
          The requested analytics view or dashboard page does not exist or may have been relocated.
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate("/dashboard")}
          sx={{
            px: 3.5,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.9375rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
            color: "#04130C",
            boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
