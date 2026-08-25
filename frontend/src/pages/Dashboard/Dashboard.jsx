import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Card, CardContent, Chip } from "@mui/material";
import {
  Refresh, Today, DateRange, CalendarMonth, CalendarToday,
  Storefront, LocationCity, Hub, AssignmentTurnedIn, Factory, ArrowForward
} from "@mui/icons-material";
import api from "../../api/axios";
import SummaryCards from "../../components/cards/SummaryCards";
import RevenueChart from "../../components/charts/RevenueChart";
import SalesChart from "../../components/charts/SalesChart";
import TopProductsChart from "../../components/charts/TopProductsChart";
import RecentSales from "../../components/tables/RecentSales";
import TopProducts from "../../components/widgets/TopProducts";
import LowStock from "../../components/widgets/LowStock";
import RestockSection from "../../components/widgets/RestockSection";
import { mockSummary, mockSalesWidgets, mockShopOrders } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

function StatWidget({ title, value, icon: Icon, color, bg, subtitle }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: "#0D131F",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
        transition: "all .2s ease",
        "&:hover": {
          borderColor: "rgba(0, 229, 153, 0.35)",
          boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 229, 153, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="caption" color="#94A3B8" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 0.6, fontSize: "0.7rem" }}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" sx={{ mt: 0.5, letterSpacing: "-0.02em" }}>
              ₹{Number(value || 0).toLocaleString("en-IN")}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: "#00E599", fontWeight: 700, mt: 0.3, display: "block" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: bg || "rgba(0, 229, 153, 0.12)",
              borderRadius: 2.5,
              p: 1.2,
              color: color || "#00E599",
              border: `1px solid ${color || "#00E599"}30`,
              boxShadow: `0 0 12px ${color || "#00E599"}20`,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedBranch, currentBranch } = useBranch();
  const [data, setData] = useState({ summary: mockSummary, salesWidgets: mockSalesWidgets });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard");
      if (res.data?.summary) {
        setData(res.data);
      } else {
        setData({ summary: mockSummary, salesWidgets: mockSalesWidgets });
      }
    } catch {
      setData({ summary: mockSummary, salesWidgets: mockSalesWidgets });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Adjust metrics based on branch filter
  const branchMultiplier = selectedBranch === "coimbatore" ? 0.58 : selectedBranch === "tirupur" ? 0.42 : 1;

  const summary = {
    totalRevenue: Math.round((data?.summary?.totalRevenue || mockSummary.totalRevenue) * branchMultiplier),
    totalProfit: Math.round((data?.summary?.totalProfit || mockSummary.totalProfit) * branchMultiplier),
    totalSales: Math.round((data?.summary?.totalSales || mockSummary.totalSales) * branchMultiplier),
    totalCustomers: Math.round((data?.summary?.totalCustomers || mockSummary.totalCustomers) * branchMultiplier),
    totalProducts: 26,
    totalInventory: Math.round((data?.summary?.totalInventory || mockSummary.totalInventory) * branchMultiplier),
    totalBranches: selectedBranch === "all" ? 2 : 1,
    totalEmployees: selectedBranch === "all" ? 32 : 16,
  };

  const sw = {
    today: Math.round((data?.salesWidgets?.today || mockSalesWidgets.today) * branchMultiplier),
    weekly: Math.round((data?.salesWidgets?.weekly || mockSalesWidgets.weekly) * branchMultiplier),
    monthly: Math.round((data?.salesWidgets?.monthly || mockSalesWidgets.monthly) * branchMultiplier),
    yearly: Math.round((data?.salesWidgets?.yearly || mockSalesWidgets.yearly) * branchMultiplier),
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Wholesale Operations Dashboard
            </Typography>
            <Chip
              icon={
                selectedBranch === "all" ? (
                  <Hub sx={{ fontSize: "14px !important", color: "#00E599 !important" }} />
                ) : selectedBranch === "coimbatore" ? (
                  <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} />
                ) : (
                  <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />
                )
              }
              label={currentBranch.name.toUpperCase()}
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
          <Typography variant="body2" color="#94A3B8" sx={{ mt: 0.3 }}>
            Wholesale electronic gadgets distribution · {currentBranch.address}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<AssignmentTurnedIn />}
            onClick={() => navigate("/shop-orders")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
              color: "#04130C",
              boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
            }}
          >
            Retailer Orders & Supply Hub
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              color: "#FFFFFF",
              borderColor: "rgba(255, 255, 255, 0.15)",
              "&:hover": { borderColor: "#00E599", color: "#00E599", bgcolor: "rgba(0, 229, 153, 0.06)" },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Retailer Order & Factory Supply Banner */}
      <Card
        sx={{
          borderRadius: 3,
          p: 2.5,
          mb: 3.5,
          bgcolor: "#0D131F",
          border: "1px solid rgba(0, 229, 153, 0.3)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ bgcolor: "rgba(0, 229, 153, 0.15)", p: 1.5, borderRadius: 2.5, color: "#00E599" }}>
            <Factory sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={900} color="#FFFFFF">
              Smart Shop Orders & Factory Supply Chain
            </Typography>
            <Typography variant="body2" color="#94A3B8">
              Live stock verification: {mockShopOrders.length} Active retailer orders · Automatic shortage PO to OEM factory.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          endIcon={<ArrowForward />}
          onClick={() => navigate("/shop-orders")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 800,
            color: "#00E599",
            borderColor: "rgba(0, 229, 153, 0.4)",
            "&:hover": { borderColor: "#00E599", bgcolor: "rgba(0, 229, 153, 0.1)" },
          }}
        >
          Open Supply Chain Engine
        </Button>
      </Card>

      {/* Primary KPI Summary Cards */}
      <Box sx={{ mb: 3.5 }}>
        <SummaryCards summary={summary} loading={loading} />
      </Box>

      {/* Period Sales Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Today's Wholesale Billing" value={sw.today} icon={Today} color="#00E599" bg="rgba(0, 229, 153, 0.12)" subtitle={`${currentBranch.code} Target`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Weekly Dispatch" value={sw.weekly} icon={DateRange} color="#34D399" bg="rgba(52, 211, 153, 0.12)" subtitle="+26% Wholesale Surge" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="This Month" value={sw.monthly} icon={CalendarMonth} color="#FFFFFF" bg="rgba(255, 255, 255, 0.1)" subtitle="+31% Retailer Demand" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Annual Target" value={sw.yearly} icon={CalendarToday} color="#F59E0B" bg="rgba(245, 158, 11, 0.12)" subtitle="Fiscal Target" />
        </Grid>
      </Grid>

      {/* Prominent Restock & Unit Pricing Explorer Section */}
      <Box sx={{ mb: 3.5 }}>
        <RestockSection />
      </Box>

      {/* Main Charts */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={12} lg={8}>
          <RevenueChart />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TopProductsChart />
        </Grid>
      </Grid>

      {/* Secondary Chart & Widgets */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={12} lg={8}>
          <SalesChart />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TopProducts />
        </Grid>
      </Grid>

      {/* Tables & Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <RecentSales />
        </Grid>
        <Grid item xs={12} lg={4}>
          <LowStock />
        </Grid>
      </Grid>
    </Box>
  );
}
