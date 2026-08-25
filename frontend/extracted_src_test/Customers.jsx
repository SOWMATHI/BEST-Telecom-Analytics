import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment,
  Avatar, Chip, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Add, Edit, Delete, Visibility, FileDownload, Refresh, Person } from "@mui/icons-material";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../../api/customers";

const EMPTY = { name: "", email: "", phone: "", address: "", city: "", loyaltyPoints: 0 };

export default function Customers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setRows((res.data?.customers || res.data || []).map((c, i) => ({ ...c, id: c._id || i })));
    } catch { setError("Failed to load customers."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    [r.name, r.email, r.phone, r.city].some((f) => (f || "").toLowerCase().includes(search.toLowerCase()))
  );

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateCustomer(editId, form);
      else await createCustomer(form);
      setDialogOpen(false); load();
    } catch { setError("Save failed."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await deleteCustomer(deleteId); setDeleteId(null); load(); }
    catch { setError("Delete failed."); }
  };

  const exportCSV = () => {
    const headers = ["Name","Email","Phone","City","Loyalty Points","Total Spent"];
    const csvRows = [headers, ...filtered.map((r) => [r.name, r.email, r.phone, r.city, r.loyaltyPoints||0, r.totalSpent||0])];
    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "customers.csv"; a.click();
  };

  const columns = [
    { field: "name", headerName: "Customer", flex: 1.5, minWidth: 180, renderCell: ({ row }) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: "#7C3AED", fontWeight: 700 }}>{(row.name||"C")[0]}</Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.email}</Typography>
        </Box>
      </Box>
    )},
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    { field: "city", headerName: "City", flex: 0.8, minWidth: 110 },
    { field: "loyaltyPoints", headerName: "Loyalty Pts", flex: 0.8, minWidth: 110, renderCell: ({ value }) => (
      <Chip label={`⭐ ${value || 0}`} size="small" sx={{ bgcolor: "#FFF7ED", color: "#EA580C", fontWeight: 700 }} />
    )},
    { field: "totalSpent", headerName: "Total Spent", flex: 1, minWidth: 130, renderCell: ({ value }) => (
      <Typography variant="body2" fontWeight={700} color="#16A34A">₹{Number(value||0).toLocaleString("en-IN")}</Typography>
    )},
    { field: "actions", headerName: "Actions", flex: 0.8, minWidth: 120, sortable: false, renderCell: ({ row }) => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="View"><IconButton size="small" onClick={() => setViewItem(row)} sx={{ color: "#64748B" }}><Visibility fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Edit"><IconButton size="small" onClick={() => { setForm({ name: row.name||"", email: row.email||"", phone: row.phone||"", address: row.address||"", city: row.city||"", loyaltyPoints: row.loyaltyPoints||0 }); setEditId(row._id||row.id); setDialogOpen(true); }} sx={{ color: "#1976D2" }}><Edit fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(row._id||row.id)} sx={{ color: "#DC2626" }}><Delete fontSize="small" /></IconButton></Tooltip>
      </Box>
    )},
  ];

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">Customers</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} customers</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<FileDownload />} onClick={exportCSV} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Export CSV</Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(EMPTY); setEditId(null); setDialogOpen(true); }} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#7C3AED,#6D28D9)", boxShadow: "0 4px 12px rgba(124,58,237,0.35)" }}>Add Customer</Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by name, email, phone, city..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94A3B8" }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#F8FAFC" } }} />
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <DataGrid rows={filtered} columns={columns} loading={loading} autoHeight pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} disableRowSelectionOnClick
          sx={{ border: "none", "& .MuiDataGrid-columnHeaders": { bgcolor: "#F8FAFC", fontWeight: 700, fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }, "& .MuiDataGrid-row:hover": { bgcolor: "#F8FAFC" }, "& .MuiDataGrid-cell": { borderColor: "#F1F5F9" } }} />
      </Card>

      {/* Add/Edit */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{editId ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["name","Full Name"],["email","Email"],["phone","Phone"],["city","City"],["address","Address"]].map(([field, label]) => (
              <Grid item xs={12} sm={field === "address" ? 12 : 6} key={field}>
                <TextField fullWidth size="small" label={label} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Loyalty Points" type="number" value={form.loyaltyPoints} onChange={(e) => setForm((f) => ({ ...f, loyaltyPoints: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#7C3AED,#6D28D9)" }}>
            {saving ? "Saving..." : editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View */}
      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Customer Profile</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                <Avatar sx={{ width: 56, height: 56, fontSize: 22, bgcolor: "#7C3AED", fontWeight: 700 }}>{(viewItem.name||"C")[0]}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{viewItem.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{viewItem.email}</Typography>
                </Box>
              </Box>
              <Grid container spacing={1.5}>
                {[["Phone", viewItem.phone],["City", viewItem.city],["Address", viewItem.address],["Loyalty Points", viewItem.loyaltyPoints||0],["Total Spent", `₹${Number(viewItem.totalSpent||0).toLocaleString("en-IN")}`]].map(([k, v]) => (
                  <Grid item xs={12} key={k}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{k}</Typography>
                    <Typography variant="body2" fontWeight={600}>{v || "—"}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Customer</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this customer?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
