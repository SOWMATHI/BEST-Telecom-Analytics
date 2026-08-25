import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment,
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Alert, Avatar,
} from "@mui/material";
import { Search, Add, Edit, Delete, Visibility, FileDownload, Refresh, LocalShipping } from "@mui/icons-material";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../api/suppliers";

const EMPTY = { name: "", email: "", phone: "", city: "", category: "", gstin: "", address: "" };
const COLORS = ["#1976D2","#7C3AED","#EA580C","#16A34A","#0891B2","#D97706","#DB2777"];

export default function Suppliers() {
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
      const res = await getSuppliers();
      setRows(res.data?.suppliers || res.data || []);
    } catch { setError("Failed to load suppliers."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    [r.name, r.email, r.city, r.category].some((f) => (f || "").toLowerCase().includes(search.toLowerCase()))
  );

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateSupplier(editId, form);
      else await createSupplier(form);
      setDialogOpen(false); load();
    } catch { setError("Save failed."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await deleteSupplier(deleteId); setDeleteId(null); load(); }
    catch { setError("Delete failed."); }
  };

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">Suppliers</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} suppliers</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(EMPTY); setEditId(null); setDialogOpen(true); }}
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#0891B2,#0E7490)", boxShadow: "0 4px 12px rgba(8,145,178,0.35)" }}>
            Add Supplier
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by name, email, city, category..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94A3B8" }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#F8FAFC" } }} />
        </Box>
      </Card>

      {/* Supplier Cards Grid */}
      <Grid container spacing={2.5}>
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ borderRadius: 3, p: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", height: 180 }} />
          </Grid>
        )) : filtered.map((supplier, i) => (
          <Grid item xs={12} sm={6} md={4} key={supplier._id || i}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", transition: "all .2s ease", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }, overflow: "hidden", position: "relative" }}>
              <Box sx={{ height: 4, background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})` }} />
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 44, height: 44, bgcolor: COLORS[i % COLORS.length], fontWeight: 700, fontSize: 16 }}>{(supplier.name || "S")[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{supplier.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{supplier.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="View"><IconButton size="small" onClick={() => setViewItem(supplier)} sx={{ color: "#64748B" }}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => { setForm({ name: supplier.name || "", email: supplier.email || "", phone: supplier.phone || "", city: supplier.city || "", category: supplier.category || "", gstin: supplier.gstin || "", address: supplier.address || "" }); setEditId(supplier._id); setDialogOpen(true); }} sx={{ color: "#1976D2" }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(supplier._id)} sx={{ color: "#DC2626" }}><Delete fontSize="small" /></IconButton></Tooltip>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  {supplier.category && <Chip label={supplier.category} size="small" sx={{ bgcolor: `${COLORS[i % COLORS.length]}15`, color: COLORS[i % COLORS.length], fontWeight: 700 }} />}
                  {supplier.city && <Chip label={supplier.city} size="small" sx={{ bgcolor: "#F1F5F9", color: "#64748B", fontWeight: 600 }} icon={<LocalShipping sx={{ fontSize: "14px !important" }} />} />}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>{supplier.phone || "—"}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{editId ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["name","Company Name"],["email","Email"],["phone","Phone"],["city","City"],["category","Category"],["gstin","GSTIN"]].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth size="small" label={label} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Address" multiline rows={2} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#0891B2,#0E7490)" }}>
            {saving ? "Saving..." : editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Supplier Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {[["Name", viewItem.name], ["Email", viewItem.email], ["Phone", viewItem.phone], ["City", viewItem.city], ["Category", viewItem.category], ["GSTIN", viewItem.gstin], ["Address", viewItem.address]].map(([k, v]) => v && (
                <Grid item xs={12} key={k}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>{k}</Typography>
                  <Typography variant="body2" fontWeight={600}>{v}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Supplier</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this supplier?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
