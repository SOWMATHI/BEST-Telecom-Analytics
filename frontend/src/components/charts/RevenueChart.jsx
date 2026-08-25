import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Skeleton, Chip } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../../api/axios";
import { mockMonthlyChart } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function RevenueChart() {
  const { selectedBranch, currentBranch } = useBranch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/monthly-chart");
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

  const chartData = (data.length ? data : mockMonthlyChart).map((item) => ({
    month: MONTHS[(item._id?.month || item.month || 1) - 1],
    Revenue: Math.round((item.totalRevenue || 0) * branchMultiplier),
    Profit: Math.round((item.totalProfit || 0) * branchMultiplier),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "#0D131F",
            p: 1.8,
            borderRadius: 2.5,
            border: "1px solid rgba(0, 229, 153, 0.4)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(0, 229, 153, 0.15)",
          }}
        >
          <Typography variant="caption" fontWeight={800} color="#00E599" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            {label} Performance ({currentBranch.name})
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`item-${index}`} sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.6 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: entry.color, boxShadow: `0 0 8px ${entry.color}` }} />
              <Typography variant="body2" color="#94A3B8" fontSize={12}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" fontWeight={800} color="#FFFFFF" fontSize={12}>
                ₹{Number(entry.value).toLocaleString("en-IN")}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: "#0D131F",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#FFFFFF" letterSpacing="-0.015em">
              Wholesale Revenue & Profit Growth
            </Typography>
            <Typography variant="caption" color="#94A3B8">
              Monthly billing telemetry ({currentBranch.name})
            </Typography>
          </Box>
          <Box sx={{ px: 1.2, py: 0.4, borderRadius: 1.5, bgcolor: "rgba(0, 229, 153, 0.1)", border: "1px solid rgba(0, 229, 153, 0.25)" }}>
            <Typography variant="caption" fontWeight={800} color="#00E599" fontSize={11}>
              +18.4% YOY
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" height={270} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.04)" }} />
        ) : (
          <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E599" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00E599" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12, fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="Revenue" stroke="#00E599" strokeWidth={2.5} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="Profit" stroke="#FFFFFF" strokeWidth={2} fill="url(#colorProf)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
