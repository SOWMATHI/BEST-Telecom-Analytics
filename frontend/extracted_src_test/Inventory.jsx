import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, TextField, InputAdornment, Chip,
  Grid, Alert, LinearProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar,
} from "@mui/material";
import { Search, Warehouse, WarningAmber, CheckCircle, Cancel } from "@mui/icons-material";
import { getInventory } from "../../api/inventory";

const getStockStatus = (qty) => {
  if (qty <= 0) return { label: "Out of Stock", color: "error", icon: <Cancel sx={{ fontSize: 16 }} /> };
  if (qty <= 10) return { label: "Critical", color: "error", icon: <WarningAmber sx={{ fontSize: 16 }} /> };
  if (qty <= 30) return { label: "Low Stock", color: "warning", icon: <WarningAmber sx={{ fontSize: 16 }} /> };
  return { label: "In Stock", color: "success", icon: <CheckCircle sx={{ fontSize: 16 }} /> };
};

export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      setRows(res.data?.inventory || res.data || []);
    } catch { setError("Failed to load inventory."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    [r.productName, r.name, r.category, r.sku].some((f) => (f || "").toLowerCase().includes(search.toLowerCase()))
  );

  const outOfStock = filtered.filter((r) => (r.quantity ?? r.stock ?? 0) <= 0).length;
  const lowStock = filtered.filter((r) => { const q = r.quantity ?? r.stock ?? 0; return q > 0 && q <= 30; }).length;
  const inStock = filtered.filter((r) => (r.quantity ?? r.stock ?? 0) > 30).length;
  const totalValue = filtered.reduce((sum, r) => sum + ((r.quantity ?? r.stock ?? 0) * (r.price ?? 0)), 0);

  const statCards = [
    { label: "Total Products", value: filtered.length, color: "#1976D2", bg: "#EFF6FF" },
    { label: "In Stock", value: inStock, color: "#16A34A", bg: "#F0FDF4" },
    { label: "Low Stock", value: lowStock, color: "#D97706", bg: "#FFFBEB" },
    { label: "Out of Stock", value: outOfStock, color: "#DC2626", bg: "#FEF2F2" },
    { label: "Inventory Value", value: `₹${Number(totalValue).toLocaleString("en-IN")}`, color: "#7C3AED", bg: "#F5F3FF" },
  ];

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="#0F172A">Inventory</Typography>
        <Typography variant="body2" color="text.secondary">Stock levels and inventory management</Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((s) => (
          <Grid item xs={12} sm={6} md={4} lg key={s.label}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>{s.label}</Typography>
              <Typography variant="h5" fontWeight={800} sx={{ color: s.color, mt: 0.5 }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && <LinearProgress sx={{ borderRadius: 2, mb: 2 }} />}

      {/* Search */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by product, category, SKU..." value={search} onChange={(e) => setSearch(e.target.value)}
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
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell align="center">Stock Level</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, i) => {
                const qty = item.quantity ?? item.stock ?? 0;
                const price = item.price ?? 0;
                const status = getStockStatus(qty);
                const maxQty = Math.max(...filtered.map((r) => r.quantity ?? r.stock ?? 0), 1);
                return (
                  <TableRow key={item._id || i} hover sx={{ "& td": { borderBottom: "1px solid #F8FAFC", py: 1.5 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "#EFF6FF", color: "#1976D2", fontWeight: 700 }}>
                          {(item.productName || item.name || "P")[0]}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{item.productName || item.name || "—"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={item.category || "—"} size="small" sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 600 }} /></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{item.sku || "—"}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" fontWeight={700}>{qty}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={600}>₹{Number(price).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={700} color="#1976D2">₹{Number(qty * price).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 80 }}>
                        <LinearProgress variant="determinate" value={Math.min((qty / maxQty) * 100, 100)}
                          sx={{ height: 6, borderRadius: 3, bgcolor: "#F1F5F9", "& .MuiLinearProgress-bar": { bgcolor: qty <= 0 ? "#DC2626" : qty <= 10 ? "#DC2626" : qty <= 30 ? "#D97706" : "#16A34A", borderRadius: 3 } }} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" icon={status.icon} sx={{ fontWeight: 700 }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
