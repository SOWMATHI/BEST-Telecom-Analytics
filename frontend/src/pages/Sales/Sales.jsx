import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment,
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Avatar, MenuItem,
} from "@mui/material";
import { Search, Add, Visibility, Refresh, Print, CurrencyRupee, ShoppingCart, TrendingUp, Storefront, LocationCity } from "@mui/icons-material";
import { getSales, createSale } from "../../api/sales";
import { mockRecentSales } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

const EMPTY = { customerName: "", productName: "", quantity: 10, sellingPrice: 1200, paymentMethod: "UPI", branch: "Coimbatore" };

export default function Sales() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [rows, setRows] = useState(mockRecentSales);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoiceItem, setInvoiceItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSales();
      const items = res.data?.sales || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(items) && items.length > 0) {
        // Normalize populated or flat items
        const normalized = items.map((s, idx) => ({
          _id: s._id || `S${idx + 100}`,
          invoiceNumber: s.invoiceNumber || `INV-B2B-${(s._id || `${idx + 100}`).slice(-6).toUpperCase()}`,
          customerName: s.customerName || s.customer?.fullName || s.customer?.name || "Retailer Showroom",
          productName: s.productName || s.product?.productName || s.product?.name || "Fast Charger Pack",
          branch: typeof s.branch === "object" ? s.branch?.branchName || s.branch?.name : s.branch || (idx % 2 === 0 ? "Coimbatore" : "Tirupur"),
          quantity: s.quantity || 10,
          totalAmount: s.totalAmount || (s.quantity || 1) * (s.sellingPrice || 1200),
          paymentMethod: s.paymentMethod || "UPI",
          status: s.status || "completed",
          createdAt: s.createdAt || s.saleDate || new Date().toISOString(),
        }));
        setRows(normalized);
      } else {
        setRows(mockRecentSales);
      }
    } catch {
      setRows(mockRecentSales);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const branchFiltered = filterByBranch(rows);

  const filtered = branchFiltered.filter((r) =>
    [r.customerName, r.productName, r.invoiceNumber, r.paymentMethod, r.branch].some((f) =>
      String(f || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const save = async () => {
    setSaving(true);
    try {
      const totalAmount = Number(form.quantity) * Number(form.sellingPrice);
      await createSale({ ...form, totalAmount, status: "completed" });
      setDialogOpen(false);
      load();
    } catch {
      setError("Failed to record invoice.");
    } finally {
      setSaving(false);
    }
  };

  const totalRevenue = filtered.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const totalUnits = filtered.reduce((s, r) => s + (r.quantity || 1), 0);

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              B2B Wholesale Sales & Billing
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
          <Typography variant="body2" color="#94A3B8">
            {filtered.length} wholesale transaction invoices for electronics retailers
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", "&:hover": { borderColor: "#00E599", color: "#00E599" } }}>
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setForm({ ...EMPTY, branch: selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore" }); setDialogOpen(true); }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
              color: "#04130C",
              boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
            }}
          >
            Create Wholesale Invoice
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: "Gross Invoiced Value", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: CurrencyRupee, color: "#00E599" },
          { label: "Total B2B Transactions", value: filtered.length, icon: ShoppingCart, color: "#FFFFFF" },
          { label: "Total Gadgets Dispatched", value: `${totalUnits.toLocaleString("en-IN")} units`, icon: TrendingUp, color: "#34D399" },
        ].map((kpi) => (
          <Grid item xs={12} sm={4} key={kpi.label}>
            <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", p: 2.5, bgcolor: "#0D131F" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="#94A3B8" fontWeight={800} sx={{ textTransform: "uppercase", fontSize: "0.72rem" }}>{kpi.label}</Typography>
                  <Typography variant="h5" fontWeight={900} color="#FFFFFF" sx={{ mt: 0.5, letterSpacing: "-0.02em" }}>{kpi.value}</Typography>
                </Box>
                <Box sx={{ bgcolor: `${kpi.color}15`, borderRadius: 2.5, p: 1.2, color: kpi.color, border: `1px solid ${kpi.color}30` }}>
                  <kpi.icon sx={{ fontSize: 22 }} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Filter */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", mb: 2.5, bgcolor: "#0D131F" }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by retailer showroom, gadget, invoice number, payment method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#00E599", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#070A0E",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&:hover fieldset": { borderColor: "rgba(0, 229, 153, 0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#00E599" },
              },
            }}
          />
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#090E18" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, py: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Invoice ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Wholesale Client</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Hub Location</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Gadget Items</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Total Value</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((sale, i) => {
                const isCBR = (sale.branch || "Coimbatore").toLowerCase().includes("coimbatore");
                return (
                  <TableRow key={sale._id || i} hover sx={{ "& td": { py: 1.4, borderBottom: "1px solid rgba(255, 255, 255, 0.05)" } }}>
                    <TableCell><Typography variant="body2" fontWeight={800} color="#00E599">{sale.invoiceNumber || `INV-B2B-${(sale._id || "100").slice(-6).toUpperCase()}`}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800, border: "1px solid rgba(0, 229, 153, 0.3)" }}>{(sale.customerName || "C")[0]}</Avatar>
                        <Typography variant="body2" fontWeight={700} color="#FFFFFF">{sale.customerName || "Retailer Showroom"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
                        label={sale.branch || "Coimbatore"}
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
                    <TableCell><Typography variant="body2" color="#94A3B8">{sale.productName || "Gadget Pack"}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" fontWeight={700} color="#FFFFFF">{sale.quantity || 10}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={800} color="#00E599">₹{Number(sale.totalAmount || 0).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell><Chip label={sale.paymentMethod || "UPI"} size="small" sx={{ bgcolor: "rgba(255, 255, 255, 0.06)", color: "#E2E8F0", fontWeight: 700, fontSize: 11, border: "1px solid rgba(255, 255, 255, 0.1)" }} /></TableCell>
                    <TableCell><Typography variant="caption" color="#94A3B8">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString("en-IN") : "Today"}</Typography></TableCell>
                    <TableCell>
                      <Tooltip title="View Receipt">
                        <IconButton size="small" onClick={() => setInvoiceItem(sale)} sx={{ color: "#00E599", "&:hover": { bgcolor: "rgba(0, 229, 153, 0.1)" } }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="#94A3B8">No transaction records match search for {currentBranch.name}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", color: "#94A3B8" }}
        />
      </Card>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>New Wholesale B2B Invoice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["customerName","Retailer Showroom / Client Name"],["productName","Gadget Product Line"],["quantity","Wholesale Quantity"],["sellingPrice","Unit Wholesale Price (₹)"],["paymentMethod","Payment Method (UPI, Net Banking, Card, Cash)"]].map(([field, label]) => (
              <Grid item xs={12} sm={field === "customerName" || field === "productName" ? 12 : 6} key={field}>
                <TextField
                  fullWidth
                  size="small"
                  label={label}
                  type={field === "quantity" || field === "sellingPrice" ? "number" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                />
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
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}>
            {saving ? "Processing..." : "Generate B2B Invoice"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Receipt Dialog */}
      <Dialog open={Boolean(invoiceItem)} onClose={() => setInvoiceItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Wholesale B2B Tax Invoice</DialogTitle>
        <DialogContent>
          {invoiceItem && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {[["Invoice ID", invoiceItem.invoiceNumber || "INV-B2B-WHOLESALE"], ["Wholesale Hub", invoiceItem.branch || "Coimbatore"], ["Retailer Client", invoiceItem.customerName], ["Product", invoiceItem.productName], ["Dispatched Units", `${invoiceItem.quantity || 10} units`], ["Payment Method", invoiceItem.paymentMethod], ["Total Invoice Value", `₹${Number(invoiceItem.totalAmount || 0).toLocaleString("en-IN")}`], ["Status", invoiceItem.status || "Completed"]].map(([k, v]) => (
                <Grid item xs={12} key={k}>
                  <Typography variant="caption" color="#00E599" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: 10.5 }}>{k}</Typography>
                  <Typography variant="body2" fontWeight={600} color="#FFFFFF">{v || "—"}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
          <Button startIcon={<Print />} onClick={() => window.print()} sx={{ color: "#94A3B8" }}>Print Tax Invoice</Button>
          <Button onClick={() => setInvoiceItem(null)} variant="contained" sx={{ borderRadius: 2, fontWeight: 800, background: "#00E599", color: "#04130C" }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
