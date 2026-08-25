import { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  Avatar, Divider, Alert, Snackbar, Tabs, Tab, Switch,
  FormControlLabel, List, ListItem, ListItemText, ListItemSecondaryAction,
} from "@mui/material";
import { Person, Business, Lock, Palette, Notifications } from "@mui/icons-material";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function Settings() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@besttelecom.in", phone: "+91 98765 43210", role: "Super Admin" });
  const [company, setCompany] = useState({ name: "BEST Telecom", address: "Chennai, Tamil Nadu", gstin: "33AAAAA0000A1Z5", website: "www.besttelecom.in", email: "info@besttelecom.in" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [prefs, setPrefs] = useState({ emailNotifications: true, lowStockAlerts: true, salesAlerts: false, weeklyReport: true, darkMode: false });

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
        <Typography variant="h5" fontWeight={800} color="#0F172A">Settings</Typography>
        <Typography variant="body2" color="text.secondary">Manage your profile, company, and preferences</Typography>
      </Box>

      <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <Box sx={{ borderBottom: "1px solid #F1F5F9" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: 14 }, "& .Mui-selected": { color: "#1976D2" }, "& .MuiTabs-indicator": { bgcolor: "#1976D2" } }}>
            <Tab icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" label="Profile" />
            <Tab icon={<Business sx={{ fontSize: 18 }} />} iconPosition="start" label="Company" />
            <Tab icon={<Lock sx={{ fontSize: 18 }} />} iconPosition="start" label="Password" />
            <Tab icon={<Notifications sx={{ fontSize: 18 }} />} iconPosition="start" label="Preferences" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Profile Tab */}
          <TabPanel value={tab} index={0}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Avatar sx={{ width: 72, height: 72, fontSize: 28, bgcolor: "#1976D2", fontWeight: 700 }}>AD</Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                <Typography variant="caption" sx={{ bgcolor: "#EFF6FF", color: "#1976D2", px: 1.5, py: 0.4, borderRadius: 1.5, fontWeight: 700, display: "inline-block", mt: 0.5 }}>{profile.role}</Typography>
              </Box>
            </Box>
            <Grid container spacing={2.5}>
              {[["name","Full Name"],["email","Email Address"],["phone","Phone Number"]].map(([field, label]) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField fullWidth size="small" label={label} value={profile[field]} onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={saveProfile} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#1976D2,#1565C0)", px: 3 }}>Save Profile</Button>
            </Box>
          </TabPanel>

          {/* Company Tab */}
          <TabPanel value={tab} index={1}>
            <Typography variant="subtitle1" fontWeight={700} mb={2.5}>Company Information</Typography>
            <Grid container spacing={2.5}>
              {[["name","Company Name"],["email","Company Email"],["phone","Phone"],["gstin","GSTIN"],["website","Website"],["address","Address"]].map(([field, label]) => (
                <Grid item xs={12} sm={field === "address" ? 12 : 6} key={field}>
                  <TextField fullWidth size="small" label={label} value={company[field] || ""} onChange={(e) => setCompany((c) => ({ ...c, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={saveCompany} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#1976D2,#1565C0)", px: 3 }}>Save Company Details</Button>
            </Box>
          </TabPanel>

          {/* Password Tab */}
          <TabPanel value={tab} index={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={2.5}>Change Password</Typography>
            <Grid container spacing={2.5} sx={{ maxWidth: 480 }}>
              {[["current","Current Password"],["newPass","New Password"],["confirm","Confirm New Password"]].map(([field, label]) => (
                <Grid item xs={12} key={field}>
                  <TextField fullWidth size="small" type="password" label={label} value={passwords[field]} onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={savePassword} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#1976D2,#1565C0)", px: 3 }}>Update Password</Button>
            </Box>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={tab} index={3}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Notification Preferences</Typography>
            <List disablePadding sx={{ maxWidth: 500 }}>
              {[
                ["emailNotifications", "Email Notifications", "Receive important updates via email"],
                ["lowStockAlerts", "Low Stock Alerts", "Get notified when products are running low"],
                ["salesAlerts", "Sales Alerts", "Notifications for each new sale"],
                ["weeklyReport", "Weekly Reports", "Receive weekly analytics summary"],
              ].map(([key, label, desc]) => (
                <ListItem key={key} disablePadding sx={{ py: 1.5, borderBottom: "1px solid #F1F5F9" }}>
                  <ListItemText primary={<Typography variant="body2" fontWeight={600}>{label}</Typography>} secondary={<Typography variant="caption" color="text.secondary">{desc}</Typography>} />
                  <ListItemSecondaryAction>
                    <Switch checked={prefs[key]} onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))} color="primary" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={savePrefs} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#1976D2,#1565C0)", px: 3 }}>Save Preferences</Button>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ borderRadius: 2.5, fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
