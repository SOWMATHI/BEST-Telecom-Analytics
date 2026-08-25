import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment, Chip,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, MenuItem, Select, FormControl, InputLabel, Skeleton, Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Search, Add, Edit, Delete, Visibility, FileDownload, Refresh,
} from "@mui/icons-material";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";

const EMPTY_FORM = { name: "", category: "", price: "", stock: "", sku: "", brand: "", description: "" };

const statusChip = (stock) => {
  if (stock <= 0) return <Chip label="Out of Stock" color="error" size="small" sx={{ fontWeight: 700 }} />;
  if (stock <= 10) return <Chip label="Low Stock" color="warning" size="small" sx={{ fontWeight: 700 }} />;
  return <Chip label="In Stock" color="success" size="small" sx={{ fontWeight: 700 }} />;
};

export default function Products() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setRows((res.data?.products || res.data || []).map((p, i) => ({ ...p, id: p._id || i })));
    } catch { setError("Failed to load products."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    [r.name, r.category, r.sku, r.brand].some((f) => (f || "").toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setDialogOpen(true); };
  const openEdit = (row) => { setForm({ name: row.name || "", category: row.category || "", price: row.price || "", stock: row.stock ?? row.quantity ?? "", sku: row.sku || "", brand: row.brand || "", description: row.description || "" }); setEditId(row._id || row.id); setDialogOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateProduct(editId, form);
      else await createProduct(form);
      setDialogOpen(false);
      load();
    } catch { setError("Save failed."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await deleteProduct(deleteId); setDeleteId(null); load(); }
    catch { setError("Delete failed."); }
  };

  const exportCSV = () => {
    const headers = ["Name", "Category", "Price", "Stock", "SKU", "Brand"];
    const csvRows = [headers, ...filtered.map((r) => [r.name, r.category, r.price, r.stock ?? r.quantity, r.sku, r.brand])];
    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "products.csv"; a.click();
  };

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1.5, minWidth: 160, renderCell: ({ row }) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#1976D2", fontSize: 12 }}>
          {(row.name || "P")[0].toUpperCase()}
        </Box>
        <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
      </Box>
    )},
    { field: "category", headerName: "Category", flex: 1, minWidth: 120, renderCell: ({ value }) => (
      <Chip label={value || "—"} size="small" sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 600 }} />
    )},
    { field: "sku", headerName: "SKU", flex: 0.8, minWidth: 100 },
    { field: "brand", headerName: "Brand", flex: 0.8, minWidth: 100 },
    { field: "price", headerName: "Price", flex: 0.8, minWidth: 100, renderCell: ({ value }) => (
      <Typography variant="body2" fontWeight={700} color="#1976D2">₹{Number(value || 0).toLocaleString("en-IN")}</Typography>
    )},
    { field: "stock", headerName: "Stock", flex: 0.7, minWidth: 80, valueGetter: (value, row) => row.stock ?? row.quantity ?? 0 },
    { field: "status", headerName: "Status", flex: 0.9, minWidth: 120, renderCell: ({ row }) => statusChip(row.stock ?? row.quantity ?? 0) },
    { field: "actions", headerName: "Actions", flex: 0.8, minWidth: 120, sortable: false, renderCell: ({ row }) => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="View"><IconButton size="small" onClick={() => setViewItem(row)} sx={{ color: "#64748B" }}><Visibility fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)} sx={{ color: "#1976D2" }}><Edit fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(row._id || row.id)} sx={{ color: "#DC2626" }}><Delete fontSize="small" /></IconButton></Tooltip>
      </Box>
    )},
  ];

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">Products</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} products found</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button variant="outlined" startIcon={<FileDownload />} onClick={exportCSV} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Export CSV</Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={openAdd} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#1976D2,#1565C0)", boxShadow: "0 4px 12px rgba(25,118,210,0.35)" }}>Add Product</Button>
        </Box>
      </Box>

      {/* Search */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth size="small" placeholder="Search by name, category, SKU, brand..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94A3B8" }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#F8FAFC" } }}
          />
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": { bgcolor: "#F8FAFC", fontWeight: 700, fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 },
            "& .MuiDataGrid-row:hover": { bgcolor: "#F8FAFC" },
            "& .MuiDataGrid-cell": { borderColor: "#F1F5F9" },
          }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>{editId ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["name","Product Name"],["category","Category"],["sku","SKU"],["brand","Brand"]].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth size="small" label={label} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Stock Quantity" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#1976D2,#1565C0)" }}>
            {saving ? "Saving..." : editId ? "Update" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Product Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {[["Name", viewItem.name],["Category", viewItem.category],["SKU", viewItem.sku],["Brand", viewItem.brand],["Price", `₹${Number(viewItem.price||0).toLocaleString("en-IN")}`],["Stock", viewItem.stock ?? viewItem.quantity ?? 0],["Description", viewItem.description]].map(([k, v]) => v !== undefined && (
                <Grid item xs={12} key={k}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>{k}</Typography>
                  <Typography variant="body2" fontWeight={600}>{v || "—"}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Product</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
