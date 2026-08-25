import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment, Chip,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Alert, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Avatar,
} from "@mui/material";
import { Search, FileDownload, Refresh, Visibility, FilterList, TrendingUp, ShoppingCart, CurrencyRupee, Receipt } from "@mui/icons-material";
import { getSales } from "../../api/sales";

const statusColor = { completed: "success", pending: "warning", cancelled: "error", refunded: "default" };
const paymentColors = { Cash: "#16A34A", Card: "#1976D2", UPI: "#7C3AED", "Net Banking": "#EA580C" };

export default function Sales() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSales();
      setRows(res.data?.sales || res.data || []);
    } catch { setError("Failed to load sales."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) => {
    const matchSearch = [r.customerName, r.customer, r.productName, r.product, r.paymentMethod].some((f) => (f || "").toLowerCase().includes(search.toLowerCase()));
    const matchFrom = !dateFrom || new Date(r.createdAt) >= new Date(dateFrom);
    const matchTo = !dateTo || new Date(r.createdAt) <= new Date(dateTo);
    return matchSearch && matchFrom && matchTo;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalRevenue = filtered.reduce((s, r) => s + (r.totalAmount || r.amount || 0), 0);
  const totalSales = filtered.length;
  const avgOrderValue = totalSales ? (totalRevenue / totalSales) : 0;

  const exportCSV = () => {
    const headers = ["Customer", "Product", "Amount", "Payment", "Status", "Date"];
    const csvRows = [headers, ...filtered.map((r) => [r.customerName || r.customer, r.productName || r.product, r.totalAmount || r.amount || 0, r.paymentMethod, r.status, r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : ""])];
    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sales.csv"; a.click();
  };

  const statCards = [
    { label: "Total Revenue", value: `₹${Number(totalRevenue).toLocaleString("en-IN")}`, icon: CurrencyRupee, color: "#16A34A", bg: "#F0FDF4" },
    { label: "Total Sales", value: totalSales, icon: ShoppingCart, color: "#1976D2", bg: "#EFF6FF" },
    { label: "Avg Order Value", value: `₹${Number(avgOrderValue).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, icon: TrendingUp, color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Invoices", value: totalSales, icon: Receipt, color: "#EA580C", bg: "#FFF7ED" },
  ];

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">Sales</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} transactions</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<FileDownload />} onClick={exportCSV} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Export CSV</Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Refresh</Button>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={s.label}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>{s.label}</Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: s.color, mt: 0.5 }}>{s.value}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: s.bg, borderRadius: 2, p: 1.2 }}><Icon sx={{ color: s.color, fontSize: 24 }} /></Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", mb: 2 }}>
        <Box sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94A3B8", fontSize: 18 }} /></InputAdornment> }}
            sx={{ flex: 1, minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#F8FAFC" } }} />
          <TextField size="small" type="date" label="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          <TextField size="small" type="date" label="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          <Button variant="outlined" startIcon={<FilterList />} onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Clear</Button>
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#F8FAFC", borderBottom: "2px solid #F1F5F9" } }}>
                <TableCell>#</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((sale, i) => (
                <TableRow key={sale._id || i} hover sx={{ "& td": { borderBottom: "1px solid #F8FAFC", py: 1.5 } }}>
                  <TableCell><Typography variant="caption" color="text.secondary" fontWeight={600}>#{page * rowsPerPage + i + 1}</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 30, height: 30, fontSize: 11, bgcolor: "#7C3AED", fontWeight: 700 }}>
                        {(sale.customerName || sale.customer || "C")[0]}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>
                        {sale.customerName || sale.customer || "—"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" noWrap sx={{ maxWidth: 130 }}>{sale.productName || sale.product || "—"}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" fontWeight={700} color="#16A34A">₹{Number(sale.totalAmount || sale.amount || 0).toLocaleString("en-IN")}</Typography></TableCell>
                  <TableCell>
                    <Chip label={sale.paymentMethod || "Cash"} size="small"
                      sx={{ bgcolor: `${paymentColors[sale.paymentMethod] || "#64748B"}15`, color: paymentColors[sale.paymentMethod] || "#64748B", fontWeight: 700, fontSize: 11 }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={sale.status || "completed"} size="small" color={statusColor[sale.status] || "success"} sx={{ fontWeight: 700, fontSize: 11, textTransform: "capitalize" }} />
                  </TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString("en-IN") : "—"}</Typography></TableCell>
                  <TableCell>
                    <Tooltip title="View Invoice">
                      <IconButton size="small" onClick={() => setViewItem(sale)} sx={{ color: "#64748B" }}><Visibility fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={filtered.length} page={page} rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ borderTop: "1px solid #F1F5F9" }}
        />
      </Card>

      {/* Invoice Dialog */}
      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Invoice Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {[["Customer", viewItem.customerName || viewItem.customer], ["Product", viewItem.productName || viewItem.product], ["Quantity", viewItem.quantity || 1], ["Unit Price", `₹${Number(viewItem.unitPrice || viewItem.price || 0).toLocaleString("en-IN")}`], ["Total Amount", `₹${Number(viewItem.totalAmount || viewItem.amount || 0).toLocaleString("en-IN")}`], ["Payment", viewItem.paymentMethod || "Cash"], ["Status", viewItem.status || "completed"], ["Date", viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleDateString("en-IN") : "—"]].map(([k, v]) => (
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
    </Box>
  );
}
