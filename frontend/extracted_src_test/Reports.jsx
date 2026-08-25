import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, Grid, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from "@mui/material";
import { FileDownload, Assessment, TrendingUp, People, Inventory2, Badge } from "@mui/icons-material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area } from "recharts";
import api from "../../api/axios";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function ReportCard({ title, icon: Icon, color, children, onExport }) {
  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ bgcolor: `${color}15`, borderRadius: 2, p: 1 }}><Icon sx={{ color, fontSize: 22 }} /></Box>
            <Typography variant="h6" fontWeight={700} color="#0F172A">{title}</Typography>
          </Box>
          <Button size="small" startIcon={<FileDownload />} onClick={onExport} variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, borderColor: color, color }}>
            Export CSV
          </Button>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function exportToCSV(data, headers, filename) {
  const csvRows = [headers, ...data];
  const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

export default function Reports() {
  const [chartData, setChartData] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [d, c] = await Promise.all([api.get("/dashboard"), api.get("/dashboard/monthly-chart")]);
        setDashboard(d.data);
        setChartData((c.data || []).map((item) => ({
          month: MONTHS[(item._id?.month || 1) - 1],
          Revenue: item.totalRevenue || 0,
          Profit: item.totalProfit || 0,
          Sales: item.totalSales || 0,
        })));
      } catch { setError("Failed to load report data."); }
    };
    load();
  }, []);

  const s = dashboard?.summary || {};

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="#0F172A">Reports</Typography>
        <Typography variant="body2" color="text.secondary">Analytics and downloadable reports</Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total Revenue", value: `₹${Number(s.totalRevenue || 0).toLocaleString("en-IN")}`, color: "#16A34A" },
          { label: "Total Profit", value: `₹${Number(s.totalProfit || 0).toLocaleString("en-IN")}`, color: "#1976D2" },
          { label: "Total Sales", value: Number(s.totalSales || 0).toLocaleString("en-IN"), color: "#7C3AED" },
          { label: "Total Customers", value: Number(s.totalCustomers || 0).toLocaleString("en-IN"), color: "#EA580C" },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>{stat.label}</Typography>
              <Typography variant="h5" fontWeight={800} sx={{ color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Report */}
        <Grid item xs={12} lg={6}>
          <ReportCard title="Revenue Report" icon={Assessment} color="#1976D2"
            onExport={() => exportToCSV(chartData.map((d) => [d.month, d.Revenue, d.Profit]), ["Month","Revenue","Profit"], "revenue-report.csv")}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976D2" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v, n) => [`₹${Number(v).toLocaleString("en-IN")}`, n]} />
                <Area type="monotone" dataKey="Revenue" stroke="#1976D2" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ReportCard>
        </Grid>

        {/* Sales Report */}
        <Grid item xs={12} lg={6}>
          <ReportCard title="Sales Report" icon={TrendingUp} color="#7C3AED"
            onExport={() => exportToCSV(chartData.map((d) => [d.month, d.Sales]), ["Month","Sales"], "sales-report.csv")}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [Number(v).toLocaleString("en-IN"), "Sales"]} />
                <Bar dataKey="Sales" fill="#7C3AED" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>
        </Grid>

        {/* Profit Trend */}
        <Grid item xs={12} lg={6}>
          <ReportCard title="Profit Trend" icon={TrendingUp} color="#16A34A"
            onExport={() => exportToCSV(chartData.map((d) => [d.month, d.Profit]), ["Month","Profit"], "profit-report.csv")}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Profit"]} />
                <Line type="monotone" dataKey="Profit" stroke="#16A34A" strokeWidth={3} dot={{ fill: "#16A34A", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ReportCard>
        </Grid>

        {/* Summary Table Report */}
        <Grid item xs={12} lg={6}>
          <ReportCard title="Monthly Summary" icon={Assessment} color="#EA580C"
            onExport={() => exportToCSV(chartData.map((d) => [d.month, d.Revenue, d.Profit, d.Sales]), ["Month","Revenue","Profit","Sales"], "monthly-summary.csv")}>
            <TableContainer sx={{ maxHeight: 240 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 700, fontSize: 12, color: "#64748B", bgcolor: "#F8FAFC", textTransform: "uppercase", letterSpacing: 0.4 } }}>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Profit</TableCell>
                    <TableCell align="right">Sales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chartData.map((row, i) => (
                    <TableRow key={i} hover sx={{ "& td": { borderBottom: "1px solid #F8FAFC", py: 1 } }}>
                      <TableCell><Typography variant="body2" fontWeight={600}>{row.month}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" fontWeight={700} color="#1976D2">₹{Number(row.Revenue).toLocaleString("en-IN")}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" fontWeight={700} color="#16A34A">₹{Number(row.Profit).toLocaleString("en-IN")}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2">{Number(row.Sales).toLocaleString("en-IN")}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ReportCard>
        </Grid>
      </Grid>
    </Box>
  );
}
