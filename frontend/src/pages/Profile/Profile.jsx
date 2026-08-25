import { useState } from "react";
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  Avatar, Divider, Alert, IconButton, InputAdornment,
} from "@mui/material";
import { PhotoCamera, Lock, Person, Email, Phone, Business } from "@mui/icons-material";

export default function Profile() {
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: "Rohan",
    lastName: "Sharma",
    email: "admin@besttelecom.in",
    phone: "+91 98765 43210",
    role: "Senior Analytics Superuser",
    department: "Executive Operations",
    location: "Chennai, India",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSavePassword = () => {
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
          Administrator Profile
        </Typography>
        <Typography variant="body2" color="#94A3B8">Superuser credentials and administrative security</Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", border: "1px solid rgba(0, 229, 153, 0.3)" }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
              textAlign: "center",
              bgcolor: "#0D131F",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 100,
                background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
                boxShadow: "0 0 20px rgba(0, 229, 153, 0.4)",
              }}
            />
            <CardContent sx={{ pt: 0, px: 3, pb: 4 }}>
              <Box sx={{ position: "relative", display: "inline-block", mt: -5, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 88,
                    height: 88,
                    border: "4px solid #0D131F",
                    boxShadow: "0 0 24px rgba(0, 229, 153, 0.4)",
                    fontSize: 34,
                    fontWeight: 900,
                    bgcolor: "#00E599",
                    color: "#04130C",
                  }}
                >
                  {form.firstName[0]}
                </Avatar>
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: -6,
                    bgcolor: "#0D131F",
                    border: "1px solid rgba(0, 229, 153, 0.3)",
                    "&:hover": { bgcolor: "#131B2C" },
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" sx={{ color: "#00E599", fontSize: 16 }} />
                </IconButton>
              </Box>
              <Typography variant="h6" fontWeight={900} color="#FFFFFF" letterSpacing="-0.01em">
                {form.firstName} {form.lastName}
              </Typography>
              <Typography variant="body2" color="#00E599" fontWeight={700} mb={2}>
                {form.role}
              </Typography>
              <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.08)" }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" color="#94A3B8" fontWeight={800} sx={{ fontSize: 10.5, letterSpacing: 0.4 }}>
                  DEPARTMENT
                </Typography>
                <Typography variant="body2" fontWeight={700} color="#FFFFFF" mb={1.5}>
                  {form.department}
                </Typography>
                <Typography variant="caption" color="#94A3B8" fontWeight={800} sx={{ fontSize: 10.5, letterSpacing: 0.4 }}>
                  LOCATION
                </Typography>
                <Typography variant="body2" fontWeight={700} color="#FFFFFF">
                  {form.location}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
              mb: 3,
              bgcolor: "#0D131F",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" fontWeight={900} color="#FFFFFF" mb={2.5} letterSpacing="-0.01em">
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size="small"
                    label="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size="small"
                    label="Last Name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size="small"
                    label="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size="small"
                    label="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth size="small"
                    label="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Business sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  sx={{ borderRadius: 2, fontWeight: 800, px: 3.5, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}
                >
                  Save Profile
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
              bgcolor: "#0D131F",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" fontWeight={900} color="#FFFFFF" mb={2.5} letterSpacing="-0.01em">
                Master Security Key
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth size="small"
                    type="password"
                    label="Current Key"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size="small"
                    type="password"
                    label="New Master Key"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size="small"
                    type="password"
                    label="Confirm Master Key"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={handleSavePassword}
                  sx={{ borderRadius: 2, fontWeight: 700, px: 3, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", "&:hover": { borderColor: "#00E599", color: "#00E599" } }}
                  disabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                >
                  Update Master Key
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
