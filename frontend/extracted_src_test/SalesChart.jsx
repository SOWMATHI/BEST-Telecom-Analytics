import { Card, CardContent, Typography, Box } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS = ["#1976D2","#7C3AED","#EA580C","#16A34A","#0891B2","#D97706","#DB2777","#059669","#DC2626","#6366F1","#F59E0B","#10B981"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "#0F172A", borderRadius: 2, p: 1.5 }}>
      <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 0.5 }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: "#60A5FA", fontWeight: 700 }}>
        Sales: {Number(payload[0]?.value).toLocaleString("en-IN")}
      </Typography>
    </Box>
  );
};

export default function SalesChart({ data }) {
  const chartData = (data || []).map((item) => ({
    month: MONTHS[(item._id?.month || 1) - 1],
    Sales: item.totalSales || 0,
  }));

  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#0F172A" mb={0.5}>Monthly Sales Volume</Typography>
        <Typography variant="caption" color="text.secondary">Units sold per month</Typography>
        <ResponsiveContainer width="100%" height={300} style={{ marginTop: 20 }}>
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Bar dataKey="Sales" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
