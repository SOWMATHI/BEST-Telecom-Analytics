import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, TextField, InputAdornment, Chip,
  Grid, Alert, LinearProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar,
} from "@mui/material";
import { Search, WarningAmber, CheckCircle, Cancel, Storefront, LocationCity } from "@mui/icons-material";
import { getInventory } from "../../api/inventory";
import { mockProducts } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

const getStockStatus = (qty) => {
  if (qty <= 0) return { label: "Out of Stock", color: "error", icon: <Cancel sx={{ fontSize: 14 }} /> };
  if (qty <= 10) return { label: "Critical Low", color: "error", icon: <WarningAmber sx={{ fontSize: 14 }} /> };
  if (qty <= 25) return { label: "Low Stock", color: "warning", icon: <WarningAmber sx={{ fontSize: 14 }} /> };
  return { label: "Optimal Stock", color: "success", icon: <CheckCircle sx={{ fontSize: 14 }} /> };
};

export default function Inventory() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [rows, setRows] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      const items = res.data?.inventory || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map((r, idx) => ({
          _id: r._id || `I${idx + 100}`,
          name: r.productName || r.name || "Electronic Gadget",
          category: r.category || "Gadgets",
          sku: r.sku || `SKU-${idx + 100}`,
          branch: typeof r.branch === "object" ? r.branch?.branchName || r.branch?.name : r.branch || (idx % 2 === 0 ? "Coimbatore" : "Tirupur"),
          quantity: r.currentStock ?? r.quantity ?? r.stock ?? 50,
          stock: r.currentStock ?? r.quantity ?? r.stock ?? 50,
          price: r.sellingPrice ?? r.price ?? 500,
        }));
        setRows(normalized);
      } else {
        setRows(mockProducts);
      }
    } catch {
      setRows(mockProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const branchFiltered = filterByBranch(rows);

  const filtered = branchFiltered.filter((r) =>
    [r.productName, r.name, r.category, r.sku, r.branch].some((f) => String(f || "").toLowerCase().includes(search.toLowerCase()))
  );

  const outOfStock = filtered.filter((r) => (r.quantity ?? r.stock ?? 0) <= 0).length;
  const lowStock = filtered.filter((r) => { const q = r.quantity ?? r.stock ?? 0; return q > 0 && q <= 25; }).length;
  const inStock = filtered.filter((r) => (r.quantity ?? r.stock ?? 0) > 25).length;
  const totalValue = filtered.reduce((sum, r) => sum + ((r.quantity ?? r.stock ?? 0) * (r.price ?? 0)), 0);

  const statCards = [
    { label: "Total Gadget Lines", value: filtered.length, color: "#00E599" },
    { label: "Optimal Stock Items", value: inStock, color: "#34D399" },
    { label: "Low Threshold Reorders", value: lowStock, color: "#F59E0B" },
    { label: "Depleted Items", value: outOfStock, color: "#EF4444" },
    { label: "Warehouse Asset Valuation", value: `₹${Number(totalValue).toLocaleString("en-IN")}`, color: "#FFFFFF" },
  ];

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
            Warehouse Inventory & Stock Health
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
        <Typography variant="body2" color="#94A3B8">Real-time carton quantities, minimum stock alerts, and wholesale valuation</Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((s) => (
          <Grid item xs={12} sm={6} md={4} lg key={s.label}>
            <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", p: 2.5, bgcolor: "#0D131F" }}>
              <Typography variant="caption" color="#94A3B8" fontWeight={800} sx={{ textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: 0.5 }}>{s.label}</Typography>
              <Typography variant="h6" fontWeight={900} sx={{ color: s.color, mt: 0.5, letterSpacing: "-0.01em" }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && <LinearProgress sx={{ borderRadius: 2, mb: 2, bgcolor: "rgba(255,255,255,0.06)", "& .MuiLinearProgress-bar": { bgcolor: "#00E599" } }} />}

      {/* Search */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", mb: 2.5, bgcolor: "#0D131F" }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by gadget name, category, SKU, branch..." value={search} onChange={(e) => setSearch(e.target.value)}
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
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, py: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Gadget Line</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Wholesale Hub</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>SKU</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Quantity</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Wholesale Unit</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Total Valuation</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Stock Level</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, i) => {
                const qty = item.quantity ?? item.stock ?? 0;
                const price = item.price ?? 0;
                const status = getStockStatus(qty);
                const maxQty = Math.max(...filtered.map((r) => r.quantity ?? r.stock ?? 0), 1);
                const isCBR = String(item.branch || "Coimbatore").toLowerCase().includes("coimbatore");
                return (
                  <TableRow key={item._id || i} hover sx={{ "& td": { borderBottom: "1px solid rgba(255, 255, 255, 0.05)", py: 1.4 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 11, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800, border: "1px solid rgba(0, 229, 153, 0.3)" }}>
                          {(item.productName || item.name || "G")[0]}
                        </Avatar>
                        <Typography variant="body2" fontWeight={700} color="#FFFFFF">{item.productName || item.name || "—"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
                        label={item.branch || "Coimbatore"}
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
                    <TableCell><Chip label={item.category || "—"} size="small" sx={{ bgcolor: "rgba(255, 255, 255, 0.06)", color: "#FFFFFF", fontWeight: 700, fontSize: 11, border: "1px solid rgba(255, 255, 255, 0.1)" }} /></TableCell>
                    <TableCell><Typography variant="caption" color="#94A3B8" fontWeight={500}>{item.sku || "—"}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" fontWeight={800} color="#FFFFFF">{qty}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" color="#94A3B8">₹{Number(price).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={800} color="#00E599">₹{Number(qty * price).toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 80 }}>
                        <LinearProgress variant="determinate" value={Math.min((qty / maxQty) * 100, 100)}
                          sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.06)", "& .MuiLinearProgress-bar": { bgcolor: qty <= 0 ? "#EF4444" : qty <= 10 ? "#EF4444" : qty <= 25 ? "#F59E0B" : "#00E599", borderRadius: 3 } }} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" icon={status.icon} sx={{ fontWeight: 800, fontSize: 10.5, height: 22 }} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="#94A3B8">No inventory items found for {currentBranch.name}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
