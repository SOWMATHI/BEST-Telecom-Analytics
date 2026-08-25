import { Card, CardContent, Typography, Box, LinearProgress, Avatar } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const COLORS = ["#1976D2","#7C3AED","#EA580C","#16A34A","#0891B2"];

export default function TopProducts({ data }) {
  const items = (data || []).slice(0, 5);
  const maxVal = Math.max(...items.map((d) => d.totalRevenue || d.revenue || 0), 1);

  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box sx={{ bgcolor: "#EFF6FF", borderRadius: 2, p: 1 }}><Inventory2Icon sx={{ color: "#1976D2", fontSize: 20 }} /></Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="#0F172A" lineHeight={1.2}>Top Products</Typography>
            <Typography variant="caption" color="text.secondary">By revenue</Typography>
          </Box>
        </Box>
        {items.map((item, i) => {
          const rev = item.totalRevenue || item.revenue || 0;
          const pct = (rev / maxVal) * 100;
          return (
            <Box key={i} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: COLORS[i], fontWeight: 700 }}>{i + 1}</Avatar>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
                    {item.productName || item.name || "Product"}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={700} color={COLORS[i]}>
                  ₹{Number(rev).toLocaleString("en-IN")}
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3, bgcolor: "#F1F5F9", "& .MuiLinearProgress-bar": { bgcolor: COLORS[i], borderRadius: 3 } }} />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
