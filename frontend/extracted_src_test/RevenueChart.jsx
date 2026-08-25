import { Card, CardContent, Typography, Box } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "#0F172A", borderRadius: 2, p: 1.5, minWidth: 140 }}>
      <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 0.5 }}>Month {label}</Typography>
      {payload.map((p) => (
        <Typography key={p.dataKey} variant="body2" sx={{ color: p.color, fontWeight: 700 }}>
          {p.name}: ₹{Number(p.value).toLocaleString("en-IN")}
        </Typography>
      ))}
    </Box>
  );
};

export default function RevenueChart({ data }) {
  const chartData = (data || []).map((item) => ({
    month: MONTHS[(item._id?.month || 1) - 1],
    Revenue: item.totalRevenue || 0,
    Profit: item.totalProfit || 0,
  }));

  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#0F172A" mb={0.5}>Monthly Revenue & Profit</Typography>
        <Typography variant="caption" color="text.secondary">Full-year performance overview</Typography>
        <ResponsiveContainer width="100%" height={300} style={{ marginTop: 20 }}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} />
            <Line type="monotone" dataKey="Revenue" stroke="#1976D2" strokeWidth={3} dot={{ fill: "#1976D2", r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Profit" stroke="#16A34A" strokeWidth={3} dot={{ fill: "#16A34A", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
