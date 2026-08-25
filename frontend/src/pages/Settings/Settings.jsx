import { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  Avatar, Divider, Alert, Snackbar, Tabs, Tab, Switch,
  List, ListItem, ListItemText, ListItemSecondaryAction,
} from "@mui/material";
import { Person, Business, Lock, Notifications } from "@mui/icons-material";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function Settings() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [profile, setProfile] = useState({ name: "Admin Superuser", email: "admin@besttelecom.in", phone: "+91 98765 43210", role: "Super Administrator" });
  const [company, setCompany] = useState({ name: "BestTelecom Wholesale Operations", address: "Coimbatore & Tirupur Hubs, Tamil Nadu", gstin: "33AAAAA0000A1Z5", website: "www.besttelecom.in", email: "support@besttelecom.in" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [prefs, setPrefs] = useState({ emailNotifications: true, lowStockAlerts: true, salesAlerts: true, weeklyReport: true });

  const showSnack = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const saveProfile = () => showSnack("Profile updated successfully!");
  const saveCompany = () => showSnack("Company details updated!");
  const savePassword = () => {
    if (!passwords.current || !passwords.newPass) return showSnack("Please fill all fields", "error");
    if (passwords.newPass !== passwords.confirm) return showSnack("Passwords do not match", "error");
    setPasswords({ current: "", newPass: "", confirm: "" });
    showSnack("Password changed successfully!");
  };
  const savePrefs = () => showSnack("Preferences saved!");

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
          Platform Settings
        </Typography>
        <Typography variant="body2" color="#94A3B8">Configure master preferences, administrative profile, and security</Typography>
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F" }}>
        <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2.5, "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: 13.5, color: "#94A3B8" }, "& .Mui-selected": { color: "#00E599 !important" }, "& .MuiTabs-indicator": { bgcolor: "#00E599" } }}>
            <Tab icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" label="Administrator Profile" />
            <Tab icon={<Business sx={{ fontSize: 18 }} />} iconPosition="start" label="Company Info" />
            <Tab icon={<Lock sx={{ fontSize: 18 }} />} iconPosition="start" label="Security" />
            <Tab icon={<Notifications sx={{ fontSize: 18 }} />} iconPosition="start" label="Telemetry Alerts" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3.5 }}>
          {/* Profile Tab */}
          <TabPanel value={tab} index={0}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Avatar sx={{ width: 68, height: 68, fontSize: 24, bgcolor: "#00E599", fontWeight: 900, color: "#04130C", border: "2px solid rgba(0, 229, 153, 0.4)", boxShadow: "0 0 20px rgba(0, 229, 153, 0.3)" }}>AD</Avatar>
              <Box>
                <Typography variant="h6" fontWeight={900} color="#FFFFFF">{profile.name}</Typography>
                <Typography variant="body2" color="#94A3B8">{profile.email}</Typography>
                <Typography variant="caption" sx={{ bgcolor: "rgba(0, 229, 153, 0.12)", color: "#00E599", px: 1.5, py: 0.3, borderRadius: 1.5, fontWeight: 800, display: "inline-block", mt: 0.5, border: "1px solid rgba(0, 229, 153, 0.3)" }}>{profile.role}</Typography>
              </Box>
            </Box>
            <Grid container spacing={2.5}>
              {[["name","Full Name"],["email","Email Address"],["phone","Phone Number"]].map(([field, label]) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField fullWidth size="small" label={label} value={profile[field]} onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3.5 }}>
              <Button variant="contained" onClick={saveProfile} sx={{ borderRadius: 2, fontWeight: 800, px: 3, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>Save Profile</Button>
            </Box>
          </TabPanel>

          {/* Company Tab */}
          <TabPanel value={tab} index={1}>
            <Typography variant="subtitle1" fontWeight={900} color="#FFFFFF" mb={2.5}>Enterprise Company Information</Typography>
            <Grid container spacing={2.5}>
              {[["name","Company Name"],["email","Company Email"],["phone","Phone"],["gstin","GSTIN"],["website","Website"],["address","Address"]].map(([field, label]) => (
                <Grid item xs={12} sm={field === "address" ? 12 : 6} key={field}>
                  <TextField fullWidth size="small" label={label} value={company[field] || ""} onChange={(e) => setCompany((c) => ({ ...c, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3.5 }}>
              <Button variant="contained" onClick={saveCompany} sx={{ borderRadius: 2, fontWeight: 800, px: 3, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>Save Company Details</Button>
            </Box>
          </TabPanel>

          {/* Password Tab */}
          <TabPanel value={tab} index={2}>
            <Typography variant="subtitle1" fontWeight={900} color="#FFFFFF" mb={2.5}>Master Access Key</Typography>
            <Grid container spacing={2.5} sx={{ maxWidth: 480 }}>
              {[["current","Current Password"],["newPass","New Password"],["confirm","Confirm New Password"]].map(([field, label]) => (
                <Grid item xs={12} key={field}>
                  <TextField fullWidth size="small" type="password" label={label} value={passwords[field]} onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3.5 }}>
              <Button variant="contained" onClick={savePassword} sx={{ borderRadius: 2, fontWeight: 800, px: 3, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>Update Key</Button>
            </Box>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={tab} index={3}>
            <Typography variant="subtitle1" fontWeight={900} color="#FFFFFF" mb={2}>Telemetry Notifications & Triggers</Typography>
            <List disablePadding sx={{ maxWidth: 520 }}>
              {[
                ["emailNotifications", "Email Telemetry Summaries", "Receive transactional summaries via email"],
                ["lowStockAlerts", "Low Inventory Triggers", "Get notified when items drop below threshold"],
                ["salesAlerts", "Real-time Sale Triggers", "Receive notifications on each completed invoice"],
                ["weeklyReport", "Weekly Financial Digest", "Receive analytics performance review weekly"],
              ].map(([key, label, desc]) => (
                <ListItem key={key} disablePadding sx={{ py: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <ListItemText primary={<Typography variant="body2" fontWeight={700} color="#FFFFFF">{label}</Typography>} secondary={<Typography variant="caption" color="#94A3B8">{desc}</Typography>} />
                  <ListItemSecondaryAction>
                    <Switch checked={prefs[key]} onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))} sx={{ "& .Mui-checked": { color: "#00E599 !important" }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: "#00E599 !important" } }} size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 3.5 }}>
              <Button variant="contained" onClick={savePrefs} sx={{ borderRadius: 2, fontWeight: 800, px: 3, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>Save Preferences</Button>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ borderRadius: 2, fontWeight: 700, border: "1px solid rgba(0, 229, 153, 0.3)", bgcolor: "#0D131F", color: "#FFFFFF" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
