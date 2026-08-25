import { Card, CardContent, Typography, Box } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#1976D2","#7C3AED","#EA580C","#16A34A","#0891B2","#D97706","#DB2777"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "#0F172A", borderRadius: 2, p: 1.5 }}>
      <Typography variant="body2" sx={{ color: "#fff", fontWeight: 700 }}>{payload[0]?.name}</Typography>
      <Typography variant="caption" sx={{ color: "#94A3B8" }}>₹{Number(payload[0]?.value).toLocaleString("en-IN")}</Typography>
    </Box>
  );
};

export default function TopProductsChart({ data }) {
  const chartData = (data || []).slice(0, 7).map((item) => ({
    name: item.productName || item.name || "Unknown",
    value: item.totalRevenue || item.revenue || 0,
  }));

  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#0F172A" mb={0.5}>Top Products</Typography>
        <Typography variant="caption" color="text.secondary">Revenue by product</Typography>
        <ResponsiveContainer width="100%" height={300} style={{ marginTop: 12 }}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: "#64748B" }}>{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
