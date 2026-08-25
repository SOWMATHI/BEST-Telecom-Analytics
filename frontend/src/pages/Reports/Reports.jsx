import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, Grid, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from "@mui/material";
import { FileDownload, Assessment, TrendingUp, MonetizationOn, Storefront, LocationCity } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axios";
import { mockMonthlyChart } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

export default function Reports() {
  const { selectedBranch, currentBranch } = useBranch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/reports/monthly");
        if (res.data?.length) {
          setData(res.data);
        } else {
          setData(mockMonthlyChart);
        }
      } catch {
        setData(mockMonthlyChart);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const branchMultiplier = selectedBranch === "coimbatore" ? 0.58 : selectedBranch === "tirupur" ? 0.42 : 1;

  const chartData = (data.length ? data : mockMonthlyChart).map((d) => ({
    name: `Month ${d._id?.month || d.month || 1}`,
    revenue: Math.round((d.totalRevenue || 0) * branchMultiplier),
    profit: Math.round((d.totalProfit || 0) * branchMultiplier),
    sales: Math.round((d.totalSales || 0) * branchMultiplier),
  }));

  const totalRev = chartData.reduce((s, d) => s + d.revenue, 0);
  const totalProf = chartData.reduce((s, d) => s + d.profit, 0);
  const totalQty = chartData.reduce((s, d) => s + d.sales, 0);

  const exportCSV = () => {
    const headers = ["Period", "Wholesale Hub", "Revenue (INR)", "Profit (INR)", "Units Dispatched"];
    const rows = chartData.map((d) => [d.name, currentBranch.name, d.revenue, d.profit, d.sales]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wholesale-report-${selectedBranch}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Wholesale Financial Analytics & Audits
            </Typography>
            <Chip
              icon={
                selectedBranch === "coimbatore" ? (
                  <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} />
                ) : selectedBranch === "tirupur" ? (
                  <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />
                ) : undefined
              }
              label={currentBranch.name}
              size="small"
              sx={{
                bgcolor: "rgba(0, 229, 153, 0.15)",
                color: "#00E599",
                border: "1px solid rgba(0, 229, 153, 0.35)",
                fontWeight: 800,
                fontSize: 10.5,
              }}
            />
          </Box>
          <Typography variant="body2" color="#94A3B8">
            Monthly gross profit margins, bulk turnover, and taxation logs
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FileDownload />}
          onClick={exportCSV}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 800,
            background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
            color: "#04130C",
            boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
          }}
        >
          Export Wholesale CSV
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {[
          { label: "Annual Wholesale Billing", value: `₹${totalRev.toLocaleString("en-IN")}`, icon: MonetizationOn, color: "#00E599" },
          { label: "Gross Profit Yield", value: `₹${totalProf.toLocaleString("en-IN")}`, icon: TrendingUp, color: "#34D399" },
          { label: "Total B2B Volume", value: `${totalQty.toLocaleString("en-IN")} units`, icon: Assessment, color: "#FFFFFF" },
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

      {/* Chart */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", p: 3, mb: 3.5, bgcolor: "#0D131F" }}>
        <Typography variant="h6" fontWeight={800} color="#FFFFFF" mb={0.5}>Wholesale Revenue vs. Profit Trend</Typography>
        <Typography variant="caption" color="#94A3B8" display="block" mb={2.5}>Monthly comparison for {currentBranch.name}</Typography>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.3)", borderRadius: 10, color: "#fff" }}
              formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, ""]}
            />
            <Bar dataKey="revenue" name="Revenue" fill="#00E599" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Profit" fill="#34D399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F", overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#090E18" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)", py: 1.5 }}>Billing Month</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Wholesale Hub</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Gross Revenue</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Net Profit Margin</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Units Dispatched</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chartData.map((row) => (
                  <TableRow key={row.name} hover sx={{ "& td": { borderBottom: "1px solid rgba(255, 255, 255, 0.05)", py: 1.4 } }}>
                    <TableCell><Typography variant="body2" fontWeight={800} color="#FFFFFF">{row.name}</Typography></TableCell>
                    <TableCell><Chip label={currentBranch.name} size="small" sx={{ bgcolor: "rgba(0, 229, 153, 0.1)", color: "#00E599", fontWeight: 700, fontSize: 10.5 }} /></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={800} color="#00E599">₹{row.revenue.toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" fontWeight={800} color="#34D399">₹{row.profit.toLocaleString("en-IN")}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" color="#94A3B8">{row.sales.toLocaleString("en-IN")} units</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
