import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment, Chip,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Alert, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Avatar, Stepper, Step, StepLabel,
} from "@mui/material";
import { Search, Add, Edit, Delete, Visibility, Refresh, Assignment } from "@mui/icons-material";
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from "../../api/purchaseOrders";

const EMPTY = { supplierName: "", productName: "", quantity: "", unitPrice: "", status: "pending", expectedDelivery: "" };

const STATUS_CONFIG = {
  pending:   { color: "warning",  label: "Pending",   step: 0 },
  approved:  { color: "info",     label: "Approved",  step: 1 },
  shipped:   { color: "primary",  label: "Shipped",   step: 2 },
  delivered: { color: "success",  label: "Delivered", step: 3 },
  cancelled: { color: "error",    label: "Cancelled", step: -1 },
};

const STEPS = ["Pending", "Approved", "Shipped", "Delivered"];

export default function PurchaseOrders() {
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPurchaseOrders();
      setRows(res.data?.purchaseOrders || res.data || []);
    } catch { setError("Failed to load purchase orders."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    [r.supplierName, r.productName, r.status].some((f) => (f || "").toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updatePurchaseOrder(editId, form);
      else await createPurchaseOrder(form);
      setDialogOpen(false); load();
    } catch { setError("Save failed."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await deletePurchaseOrder(deleteId); setDeleteId(null); load(); }
    catch { setError("Delete failed."); }
  };

  const totalValue = filtered.reduce((s, r) => s + ((r.quantity || 0) * (r.unitPrice || 0)), 0);
  const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, k) => {
    acc[k] = filtered.filter((r) => r.status === k).length;
    return acc;
  }, {});

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">Purchase Orders</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} orders · Total value ₹{Number(totalValue).toLocaleString("en-IN")}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(EMPTY); setEditId(null); setDialogOpen(true); }}
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#D97706,#B45309)", boxShadow: "0 4px 12px rgba(217,119,6,0.35)" }}>
            New Order
          </Button>
        </Box>
      </Box>

      {/* Status Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <Grid item xs key={key}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", p: 2, textAlign: "center" }}>
              <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700, mb: 1 }} />
              <Typography variant="h5" fontWeight={800} color="#0F172A">{statusCounts[key] || 0}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by supplier, product, status..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94A3B8" }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#F8FAFC" } }} />
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#F8FAFC", borderBottom: "2px solid #F1F5F9" } }}>
                <TableCell>#</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Expected Delivery</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((order, i) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const total = (order.quantity || 0) * (order.unitPrice || 0);
                return (
                  <TableRow key={order._id || i} hover sx={{ "& td": { borderBottom: "1px solid #F8FAFC", py: 1.5 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ bgcolor: "#EFF6FF", borderRadius: 1.5, p: 0.6 }}><Assignment sx={{ fontSize: 16, color: "#1976D2" }} /></Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">#{page * rowsPerPage + i + 1}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 11, bgcolor: "#D97706", fontWeight: 700 }}>{(order.supplierName || "S")[0]}</Avatar>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>{order.supplierName || "—"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" noWrap sx={{ maxWidth: 130 }}>{order.productName || "—"}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" fontWeight={700}>{order.quantity || 0}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2">₹{Number(order.unitPrice || 0).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={700} color="#1976D2">₹{Number(total).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString("en-IN") : "—"}</Typography></TableCell>
                    <TableCell><Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700 }} /></TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View Timeline"><IconButton size="small" onClick={() => setViewItem(order)} sx={{ color: "#64748B" }}><Visibility fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => { setForm({ supplierName: order.supplierName || "", productName: order.productName || "", quantity: order.quantity || "", unitPrice: order.unitPrice || "", status: order.status || "pending", expectedDelivery: order.expectedDelivery?.split("T")[0] || "" }); setEditId(order._id); setDialogOpen(true); }} sx={{ color: "#1976D2" }}><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(order._id)} sx={{ color: "#DC2626" }}><Delete fontSize="small" /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]} sx={{ borderTop: "1px solid #F1F5F9" }} />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{editId ? "Edit Purchase Order" : "New Purchase Order"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["supplierName","Supplier Name"],["productName","Product Name"]].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth size="small" label={label} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Unit Price (₹)" type="number" value={form.unitPrice} onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                SelectProps={{ native: true }}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Expected Delivery" type="date" value={form.expectedDelivery} onChange={(e) => setForm((f) => ({ ...f, expectedDelivery: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#D97706,#B45309)" }}>
            {saving ? "Saving..." : editId ? "Update" : "Create Order"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Timeline View Dialog */}
      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Order Timeline</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Box>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {[["Supplier", viewItem.supplierName], ["Product", viewItem.productName], ["Quantity", viewItem.quantity], ["Unit Price", `₹${Number(viewItem.unitPrice || 0).toLocaleString("en-IN")}`], ["Total Value", `₹${Number((viewItem.quantity || 0) * (viewItem.unitPrice || 0)).toLocaleString("en-IN")}`], ["Expected Delivery", viewItem.expectedDelivery ? new Date(viewItem.expectedDelivery).toLocaleDateString("en-IN") : "—"]].map(([k, v]) => (
                  <Grid item xs={6} key={k}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{k}</Typography>
                    <Typography variant="body2" fontWeight={600}>{v || "—"}</Typography>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>Order Progress</Typography>
              {viewItem.status !== "cancelled" ? (
                <Stepper activeStep={STATUS_CONFIG[viewItem.status]?.step ?? 0} alternativeLabel>
                  {STEPS.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                  ))}
                </Stepper>
              ) : (
                <Chip label="Order Cancelled" color="error" sx={{ fontWeight: 700 }} />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Order</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this purchase order?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
