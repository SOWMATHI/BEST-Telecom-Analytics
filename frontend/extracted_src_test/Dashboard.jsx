import { useEffect, useState } from "react";
import { Grid, CircularProgress, Alert, Box, Card, CardContent, Typography } from "@mui/material";
import api from "../../api/axios";
import SummaryCards from "../../components/cards/SummaryCards";
import RevenueChart from "../../components/charts/RevenueChart";
import SalesChart from "../../components/charts/SalesChart";
import TopProductsChart from "../../components/charts/TopProductsChart";
import RecentSales from "../../components/tables/RecentSales";
import TopProducts from "../../components/widgets/TopProducts";
import LowStock from "../../components/widgets/LowStock";
import { ShoppingBag, CalendarToday, DateRange, EventNote } from "@mui/icons-material";

function StatWidget({ label, value, icon: Icon, color }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.8)", height: "100%" }}>
      <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ bgcolor: `${color}15`, borderRadius: 2, p: 1.2 }}>
          <Icon sx={{ color, fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</Typography>
          <Typography variant="h6" fontWeight={800} color="#0F172A">
            ₹{Number(value || 0).toLocaleString("en-IN")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, chartRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/dashboard/monthly-chart"),
        ]);
        setDashboard(dashRes.data);
        setChartData(chartRes.data || []);
      } catch (err) {
        setError("Failed to load dashboard. Ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>;
  }

  const s = dashboard?.summary || {};
  const salesWidgets = dashboard?.salesWidgets || {};
  const topProducts = dashboard?.topProducts || [];
  const lowStock = dashboard?.lowStock || [];
  const recentSales = dashboard?.recentSales || [];

  return (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      <Grid item xs={12}>
        <SummaryCards summary={s} loading={false} />
      </Grid>

      {/* Period Sales Widgets */}
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget label="Today's Sales" value={salesWidgets.today} icon={ShoppingBag} color="#1976D2" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget label="Weekly Sales" value={salesWidgets.weekly} icon={CalendarToday} color="#7C3AED" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget label="Monthly Sales" value={salesWidgets.monthly} icon={DateRange} color="#EA580C" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget label="Yearly Sales" value={salesWidgets.yearly} icon={EventNote} color="#16A34A" />
      </Grid>

      {/* Charts Row 1 */}
      <Grid item xs={12} lg={8}>
        <RevenueChart data={chartData} />
      </Grid>
      <Grid item xs={12} lg={4}>
        <TopProductsChart data={topProducts} />
      </Grid>

      {/* Charts Row 2 */}
      <Grid item xs={12} lg={8}>
        <SalesChart data={chartData} />
      </Grid>
      <Grid item xs={12} lg={4}>
        <TopProducts data={topProducts} />
      </Grid>

      {/* Bottom Row */}
      <Grid item xs={12} lg={8}>
        <RecentSales data={recentSales} loading={false} />
      </Grid>
      <Grid item xs={12} lg={4}>
        <LowStock data={lowStock} />
      </Grid>
    </Grid>
  );
}
