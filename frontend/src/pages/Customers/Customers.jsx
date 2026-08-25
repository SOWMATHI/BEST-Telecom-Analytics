import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment,
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Alert, Avatar, MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Add, Edit, Delete, Visibility, Refresh, Star, Storefront, LocationCity } from "@mui/icons-material";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../../api/customers";
import { mockCustomers } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

const EMPTY = { name: "", email: "", phone: "", city: "Coimbatore", branch: "Coimbatore", loyaltyPoints: 500, address: "" };

export default function Customers() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [rows, setRows] = useState(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      const items = res.data?.customers || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map((c, idx) => ({
          _id: c._id || `C${idx + 100}`,
          name: c.name || c.fullName || "Retailer Showroom",
          email: c.email || "retailer@b2b.com",
          phone: c.phone || "+91 98422 00000",
          city: c.city || (idx % 2 === 0 ? "Coimbatore" : "Tirupur"),
          branch: typeof c.branch === "object" ? c.branch?.branchName || c.branch?.name : c.branch || (idx % 2 === 0 ? "Coimbatore" : "Tirupur"),
          loyaltyPoints: c.loyaltyPoints || 500,
          address: c.address || "Main Road Wholesale Hub",
        }));
        setRows(normalized);
      } else {
        setRows(mockCustomers);
      }
    } catch {
      setRows(mockCustomers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const branchFiltered = filterByBranch(rows);

  const filtered = branchFiltered.filter((r) =>
    [r.name, r.fullName, r.email, r.phone, r.city, r.branch].some((f) =>
      String(f || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateCustomer(editId, form);
      else await createCustomer(form);
      setDialogOpen(false);
      load();
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomer(deleteId);
      setDeleteId(null);
      load();
    } catch {
      setError("Delete failed.");
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Retailer / Dealer Name",
      flex: 1.4,
      renderCell: (p) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800, border: "1px solid rgba(0, 229, 153, 0.3)" }}>
            {(p.value || p.row.fullName || "R")[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700} color="#FFFFFF">{p.value || p.row.fullName || "—"}</Typography>
            <Typography variant="caption" color="#94A3B8">{p.row.email || "—"}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "branch",
      headerName: "Assigned Hub",
      flex: 0.9,
      renderCell: (p) => {
        const isCBR = String(p.value || "Coimbatore").toLowerCase().includes("coimbatore");
        return (
          <Chip
            icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
            label={p.value || "Coimbatore"}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: 10.5,
              bgcolor: isCBR ? "rgba(52, 211, 153, 0.12)" : "rgba(0, 245, 155, 0.12)",
              color: isCBR ? "#34D399" : "#00F59B",
              border: isCBR ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(0, 245, 155, 0.3)",
            }}
          />
        );
      },
    },
    { field: "phone", headerName: "Phone", flex: 0.9, renderCell: (p) => <Typography variant="body2" color="#94A3B8">{p.value || "—"}</Typography> },
    {
      field: "loyaltyPoints",
      headerName: "B2B Credit Score",
      flex: 0.9,
      renderCell: (p) => (
        <Chip
          icon={<Star sx={{ fontSize: "14px !important", color: "#00E599 !important" }} />}
          label={`${p.value || 500} pts`}
          size="small"
          sx={{ bgcolor: "rgba(0, 229, 153, 0.12)", color: "#00E599", fontWeight: 800, fontSize: 11, border: "1px solid rgba(0, 229, 153, 0.3)" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View Profile"><IconButton size="small" onClick={() => setViewItem(p.row)} sx={{ color: "#94A3B8" }}><Visibility fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => { setForm({ name: p.row.name || p.row.fullName || "", email: p.row.email || "", phone: p.row.phone || "", city: p.row.city || "", branch: p.row.branch || "Coimbatore", loyaltyPoints: p.row.loyaltyPoints || 500, address: p.row.address || "" }); setEditId(p.row._id); setDialogOpen(true); }} sx={{ color: "#00E599" }}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(p.row._id)} sx={{ color: "#EF4444" }}><Delete fontSize="small" /></IconButton></Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Retailer & Dealer Network
            </Typography>
            <Chip
              label={currentBranch.name}
              size="small"
              sx={{
                bgcolor: "rgba(0, 229, 153, 0.15)",
                color: "#00E599",
                border: "1px solid rgba(0, 229, 153, 0.35)",
                fontWeight: 800,
                fontSize: 10,
              }}
            />
          </Box>
          <Typography variant="body2" color="#94A3B8">{filtered.length} registered electronics showroom accounts across Coimbatore & Tirupur</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", "&:hover": { borderColor: "#00E599", color: "#00E599" } }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setForm({ ...EMPTY, branch: selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore", city: selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore" }); setEditId(null); setDialogOpen(true); }} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C", boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)" }}>
            Register Retailer
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", mb: 2.5, bgcolor: "#0D131F" }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by showroom name, email, phone, city, branch..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" }, "&:hover fieldset": { borderColor: "rgba(0, 229, 153, 0.4)" }, "&.Mui-focused fieldset": { borderColor: "#00E599" } } }} />
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F", overflow: "hidden" }}>
        <DataGrid rows={filtered} columns={columns} getRowId={(r) => r._id || r.id || Math.random()} loading={loading} autoHeight pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} disableRowSelectionOnClick
          sx={{ border: "none", color: "#FFFFFF", "& .MuiDataGrid-columnHeaders": { bgcolor: "#090E18", color: "#94A3B8", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }, "& .MuiDataGrid-row:hover": { bgcolor: "#131B2C" }, "& .MuiDataGrid-cell": { borderBottom: "1px solid rgba(255, 255, 255, 0.05)", color: "#94A3B8" }, "& .MuiDataGrid-footerContainer": { borderTop: "1px solid rgba(255, 255, 255, 0.08)", bgcolor: "#090E18" } }} />
      </Card>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>{editId ? "Edit Retailer Profile" : "Register Retailer Showroom"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["name","Retailer / Showroom Name"],["email","Email Address"],["phone","Phone Number"],["city","City Location"],["loyaltyPoints","Credit Score (pts)"]].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth size="small" label={label} type={field === "loyaltyPoints" ? "number" : "text"} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Wholesale Hub"
                value={form.branch}
                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                <MenuItem value="Coimbatore">Coimbatore Hub (CBR-001)</MenuItem>
                <MenuItem value="Tirupur">Tirupur Hub (TPR-001)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Showroom Address & Landmark" multiline rows={2} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>
            {saving ? "Saving..." : editId ? "Update Account" : "Register Retailer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Retailer Showroom Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {[["Showroom Name", viewItem.name || viewItem.fullName], ["Assigned Hub", viewItem.branch || "Coimbatore"], ["Email", viewItem.email], ["Phone", viewItem.phone], ["City", viewItem.city], ["B2B Credit Score", `${viewItem.loyaltyPoints || 500} pts`], ["Showroom Address", viewItem.address]].map(([k, v]) => (
                <Grid item xs={12} key={k}>
                  <Typography variant="caption" color="#00E599" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: 10.5 }}>{k}</Typography>
                  <Typography variant="body2" fontWeight={600} color="#FFFFFF">{v || "—"}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, fontWeight: 800, background: "#00E599", color: "#04130C" }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(239, 68, 68, 0.3)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Delete Retailer Profile</DialogTitle>
        <DialogContent><Typography color="#94A3B8">Are you sure you want to delete this showroom profile?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, fontWeight: 800 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
