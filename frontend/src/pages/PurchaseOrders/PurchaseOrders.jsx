import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment, Chip,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Alert, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Avatar, Stepper, Step, StepLabel, MenuItem
} from "@mui/material";
import { Search, Add, Delete, Refresh, Assignment, Visibility, Storefront, LocationCity } from "@mui/icons-material";
import { getPurchaseOrders, createPurchaseOrder, deletePurchaseOrder } from "../../api/purchaseOrders";
import { getSuppliers } from "../../api/suppliers";
import { getProducts } from "../../api/products";
import { mockPurchaseOrders, mockSuppliers, mockProducts } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

const STATUS_CONFIG = {
  Ordered:   { color: "warning",  label: "Ordered",   step: 0 },
  Received:  { color: "success",  label: "Received",  step: 1 },
  Cancelled: { color: "error",    label: "Cancelled", step: -1 },
};

const STEPS = ["Ordered", "Received"];
const EMPTY = { supplier: "", product: "", branch: "Coimbatore", quantity: 100, purchasePrice: 850, status: "Ordered" };

export default function PurchaseOrders() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [rows, setRows] = useState(mockPurchaseOrders);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [products, setProducts] = useState(mockProducts);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPurchaseOrders();
      const items = res.data?.purchaseOrders || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map((o, idx) => ({
          _id: o._id || `PO${idx + 100}`,
          purchaseOrderNo: o.purchaseOrderNo || `PO-CBR-${8490 + idx}`,
          supplier: typeof o.supplier === "object" ? o.supplier : { name: o.supplier || "VoltPro GaN Semiconductor" },
          product: typeof o.product === "object" ? o.product : { name: o.product || "Fast Charger" },
          quantity: o.quantity || 100,
          purchasePrice: o.purchasePrice || 850,
          totalAmount: o.totalAmount || (o.quantity || 100) * (o.purchasePrice || 850),
          branch: typeof o.branch === "object" ? o.branch?.branchName || o.branch?.name : o.branch || (idx % 2 === 0 ? "Coimbatore" : "Tirupur"),
          status: o.status || (idx % 2 === 0 ? "Received" : "Ordered"),
          createdAt: o.createdAt || new Date().toISOString(),
        }));
        setRows(normalized);
      } else {
        setRows(mockPurchaseOrders);
      }
    } catch { 
      setRows(mockPurchaseOrders); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { 
    load();
    getSuppliers().then((res) => {
      const list = res.data?.suppliers || (Array.isArray(res.data) ? res.data : []);
      if (list.length > 0) setSuppliers(list);
    });
    getProducts().then((res) => {
      const list = res.data?.products || (Array.isArray(res.data) ? res.data : []);
      if (list.length > 0) setProducts(list);
    });
  }, [load]);

  const branchFiltered = filterByBranch(rows);

  const filtered = branchFiltered.filter((r) => {
    const supName = r.supplier?.name || "";
    const prodName = r.product?.name || "";
    const poNo = r.purchaseOrderNo || "";
    const br = r.branch || "";
    return [supName, prodName, poNo, br].some((f) => 
      String(f || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const save = async () => {
    setSaving(true);
    try {
      const branchCode = form.branch === "Tirupur" ? "TPR" : "CBR";
      const purchaseOrderNo = `PO-${branchCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalAmount = Number(form.quantity || 100) * Number(form.purchasePrice || 850);
      await createPurchaseOrder({
        ...form,
        purchaseOrderNo,
        totalAmount,
      });
      setDialogOpen(false);
      load();
    } catch {
      setError("Failed to create order.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePurchaseOrder(deleteId);
      setDeleteId(null);
      load();
    } catch {
      setError("Delete failed.");
    }
  };

  const totalValue = filtered.reduce((s, r) => s + (r.totalAmount || (r.quantity || 0) * (r.purchasePrice || 0)), 0);

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Wholesale Purchase Orders & Procurement
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
          <Typography variant="body2" color="#94A3B8">{filtered.length} bulk procurement orders · Total Valuation ₹{Number(totalValue).toLocaleString("en-IN")}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", "&:hover": { borderColor: "#00E599", color: "#00E599" } }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setForm({ ...EMPTY, branch: selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore" }); setDialogOpen(true); }} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C", boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)" }}>
            New Bulk PO
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", mb: 2.5, bgcolor: "#0D131F" }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by manufacturer, gadget line, PO number, branch..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#00E599", fontSize: 18 }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" }, "&:hover fieldset": { borderColor: "rgba(0, 229, 153, 0.4)" }, "&.Mui-focused fieldset": { borderColor: "#00E599" } } }} />
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#090E18" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, py: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>PO Number</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Manufacturer</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Wholesale Hub</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Gadget Line</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Quantity</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Total Value (₹)</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((order, i) => {
                const total = order.totalAmount || (order.quantity || 0) * (order.purchasePrice || 0);
                const isReceived = order.status === "Received";
                const isCBR = String(order.branch || "Coimbatore").toLowerCase().includes("coimbatore");
                return (
                  <TableRow key={order._id || i} hover sx={{ "& td": { py: 1.4, borderBottom: "1px solid rgba(255, 255, 255, 0.05)" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Assignment sx={{ fontSize: 16, color: "#00E599" }} />
                        <Typography variant="body2" fontWeight={800} color="#FFFFFF">{order.purchaseOrderNo || `PO-${order._id?.slice(-6).toUpperCase()}`}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" color="#FFFFFF">{order.supplier?.name || "VoltPro Semiconductor"}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
                        label={order.branch || "Coimbatore"}
                        size="small"
                        sx={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          bgcolor: isCBR ? "rgba(52, 211, 153, 0.12)" : "rgba(0, 245, 155, 0.12)",
                          color: isCBR ? "#34D399" : "#00F59B",
                          border: isCBR ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(0, 245, 155, 0.3)",
                        }}
                      />
                    </TableCell>
                    <TableCell><Typography variant="body2" color="#94A3B8">{order.product?.name || "Electronic Gadgets"}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" fontWeight={800} color="#FFFFFF">{order.quantity || 100}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={800} color="#00E599">₹{Number(total).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="#94A3B8">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "Recent"}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={order.status || "Ordered"}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: 11,
                          bgcolor: isReceived ? "rgba(0, 229, 153, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: isReceived ? "#00E599" : "#F59E0B",
                          border: isReceived ? "1px solid rgba(0, 229, 153, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View"><IconButton size="small" onClick={() => setViewItem(order)} sx={{ color: "#94A3B8" }}><Visibility fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(order._id)} sx={{ color: "#EF4444" }}><Delete fontSize="small" /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="#94A3B8">No purchase orders found for {currentBranch.name}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]} sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", color: "#94A3B8" }} />
      </Card>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>New Bulk Purchase Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" select label="Manufacturer" value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}>
                {suppliers.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                {suppliers.length === 0 && <MenuItem disabled>Select Manufacturer</MenuItem>}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" select label="Gadget Product Line" value={form.product} onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}>
                {products.map((p) => <MenuItem key={p._id} value={p._id}>{p.name || p.productName}</MenuItem>)}
                {products.length === 0 && <MenuItem disabled>Select Product</MenuItem>}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Receiving Wholesale Hub"
                value={form.branch}
                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                <MenuItem value="Coimbatore">Coimbatore Hub (CBR-001)</MenuItem>
                <MenuItem value="Tirupur">Tirupur Hub (TPR-001)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Carton Quantity" type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Wholesale Cost Price (₹)" type="number" value={form.purchasePrice} onChange={(e) => setForm((f) => ({ ...f, purchasePrice: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>
            {saving ? "Creating..." : "Create Bulk PO"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Procurement Stepper & Logistics</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Box>
              <Grid container spacing={1.5} sx={{ mb: 3, mt: 0.5 }}>
                {[
                  ["Manufacturer", viewItem.supplier?.name || "VoltPro Semiconductor"], 
                  ["Receiving Hub", viewItem.branch || "Coimbatore"], 
                  ["Gadget Item", viewItem.product?.name || "Fast Chargers"], 
                  ["Carton Quantity", viewItem.quantity || 100], 
                  ["Total Procurement Cost", `₹${Number(viewItem.totalAmount || (viewItem.quantity || 0) * (viewItem.purchasePrice || 0)).toLocaleString("en-IN")}`], 
                ].map(([k, v]) => (
                  <Grid item xs={6} key={k}>
                    <Typography variant="caption" color="#00E599" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: 10.5 }}>{k}</Typography>
                    <Typography variant="body2" fontWeight={600} color="#FFFFFF">{v || "—"}</Typography>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="subtitle2" fontWeight={700} color="#FFFFFF" mb={2}>Order Status Progress</Typography>
              <Stepper activeStep={STATUS_CONFIG[viewItem.status]?.step ?? 0} alternativeLabel>
                {STEPS.map((label) => (
                  <Step key={label}><StepLabel sx={{ "& .MuiStepLabel-label": { color: "#94A3B8" } }}>{label}</StepLabel></Step>
                ))}
              </Stepper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, fontWeight: 800, background: "#00E599", color: "#04130C" }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(239, 68, 68, 0.3)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Delete PO</DialogTitle>
        <DialogContent><Typography color="#94A3B8">Are you sure you want to cancel this procurement order?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, fontWeight: 800 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
