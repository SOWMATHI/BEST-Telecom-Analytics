import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment,
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Alert, Avatar, MenuItem,
} from "@mui/material";
import { Search, Add, Edit, Delete, Visibility, Refresh, LocalShipping, Storefront, LocationCity } from "@mui/icons-material";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../api/suppliers";
import { mockSuppliers } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

const EMPTY = { name: "", email: "", phone: "", city: "", category: "Electronic Hardware", gstin: "", branch: "Coimbatore", address: "" };

export default function Suppliers() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [rows, setRows] = useState(mockSuppliers);
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
      const res = await getSuppliers();
      const items = res.data?.suppliers || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map((s, idx) => ({
          _id: s._id || `SUP${idx + 100}`,
          name: s.name || s.supplierName || "OEM Manufacturer",
          email: s.email || "vendor@oem.com",
          phone: s.phone || "+91 80 0000 0000",
          city: s.city || (idx % 2 === 0 ? "Coimbatore" : "Tirupur"),
          category: s.category || "Electronic Gadgets",
          gstin: s.gstin || "33AAACF1234F1Z1",
          branch: typeof s.branch === "object" ? s.branch?.branchName || s.branch?.name : s.branch || (idx % 2 === 0 ? "Coimbatore" : "Tirupur"),
          address: s.address || "Industrial Area",
        }));
        setRows(normalized);
      } else {
        setRows(mockSuppliers);
      }
    } catch { 
      setRows(mockSuppliers);
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const branchFiltered = filterByBranch(rows);

  const filtered = branchFiltered.filter((r) =>
    [r.name, r.email, r.city, r.category, r.branch].some((f) => String(f || "").toLowerCase().includes(search.toLowerCase()))
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
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Gadget Manufacturers & Supply Chain
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
          <Typography variant="body2" color="#94A3B8">{filtered.length} active wholesale supply chain and OEM manufacturers</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", "&:hover": { borderColor: "#00E599", color: "#00E599" } }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setForm({ ...EMPTY, branch: selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore" }); setEditId(null); setDialogOpen(true); }} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C", boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)" }}>
            Add Vendor
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", mb: 2.5, bgcolor: "#0D131F" }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by manufacturer, category, city, hub..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" }, "&:hover fieldset": { borderColor: "rgba(0, 229, 153, 0.4)" }, "&.Mui-focused fieldset": { borderColor: "#00E599" } } }} />
        </Box>
      </Card>

      {/* Supplier Cards Grid */}
      <Grid container spacing={2.5}>
        {filtered.map((supplier, i) => {
          const isCBR = String(supplier.branch || "Coimbatore").toLowerCase().includes("coimbatore");
          return (
            <Grid item xs={12} sm={6} md={4} key={supplier._id || i}>
              <Card sx={{
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
                transition: "all .2s ease",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 229, 153, 0.1)", borderColor: "rgba(0, 229, 153, 0.35)" },
                overflow: "hidden",
                bgcolor: "#0D131F",
              }}>
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 42, height: 42, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800, fontSize: 16, border: "1px solid rgba(0, 229, 153, 0.3)" }}>
                        {(supplier.name || "S")[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#FFFFFF">{supplier.name}</Typography>
                        <Typography variant="caption" color="#94A3B8">{supplier.email}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View"><IconButton size="small" onClick={() => setViewItem(supplier)} sx={{ color: "#94A3B8" }}><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => { setForm({ name: supplier.name || "", email: supplier.email || "", phone: supplier.phone || "", city: supplier.city || "", category: supplier.category || "", gstin: supplier.gstin || "", branch: supplier.branch || "Coimbatore", address: supplier.address || "" }); setEditId(supplier._id); setDialogOpen(true); }} sx={{ color: "#00E599" }}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(supplier._id)} sx={{ color: "#EF4444" }}><Delete fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                    {supplier.category && <Chip label={supplier.category} size="small" sx={{ bgcolor: "rgba(0, 229, 153, 0.12)", color: "#00E599", fontWeight: 800, fontSize: 11, border: "1px solid rgba(0, 229, 153, 0.25)" }} />}
                    <Chip
                      icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
                      label={supplier.branch || "Coimbatore"}
                      size="small"
                      sx={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        bgcolor: isCBR ? "rgba(52, 211, 153, 0.12)" : "rgba(0, 245, 155, 0.12)",
                        color: isCBR ? "#34D399" : "#00F59B",
                        border: isCBR ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(0, 245, 155, 0.3)",
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="#94A3B8" sx={{ mt: 1.5, display: "block", fontWeight: 500 }}>{supplier.phone || "—"}</Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {filtered.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="#94A3B8">No manufacturer partners found for {currentBranch.name}</Typography>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>{editId ? "Edit Vendor" : "Add Manufacturer / Vendor"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["name","Manufacturer / Company Name"],["email","Contact Email"],["phone","Phone Number"],["city","HQ City"],["category","Gadget Line Category"],["gstin","GSTIN"]].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth size="small" label={label} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
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
              <TextField fullWidth size="small" label="Factory / Corporate Address" multiline rows={2} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>
            {saving ? "Saving..." : editId ? "Update Vendor" : "Add Vendor"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Manufacturer Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {[["Company Name", viewItem.name], ["Wholesale Hub", viewItem.branch || "Coimbatore"], ["Email", viewItem.email], ["Phone", viewItem.phone], ["City", viewItem.city], ["Category", viewItem.category], ["GSTIN", viewItem.gstin], ["Address", viewItem.address]].map(([k, v]) => (
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
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Delete Vendor</DialogTitle>
        <DialogContent><Typography color="#94A3B8">Are you sure you want to delete this manufacturer partner?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, fontWeight: 800 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
