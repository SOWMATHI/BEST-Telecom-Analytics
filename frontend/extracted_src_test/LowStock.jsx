import { Card, CardContent, Typography, Box, Chip, List, ListItem, ListItemText, Avatar } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function LowStock({ data }) {
  const items = (data || []).slice(0, 6);
  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box sx={{ bgcolor: "#FFF7ED", borderRadius: 2, p: 1 }}><WarningAmberIcon sx={{ color: "#EA580C", fontSize: 20 }} /></Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="#0F172A" lineHeight={1.2}>Low Stock Alert</Typography>
            <Typography variant="caption" color="text.secondary">Needs reorder soon</Typography>
          </Box>
          <Chip label={items.length} size="small" color="error" sx={{ ml: "auto", fontWeight: 700 }} />
        </Box>
        <List disablePadding>
          {items.map((item, i) => {
            const qty = item.quantity ?? item.stock ?? 0;
            const critical = qty <= 5;
            return (
              <ListItem key={i} disablePadding sx={{ mb: 1, p: 1.5, borderRadius: 2, bgcolor: critical ? "#FFF5F5" : "#FFFBF0", border: `1px solid ${critical ? "#FECACA" : "#FDE68A"}` }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: critical ? "#DC2626" : "#D97706", mr: 1.5, fontWeight: 700 }}>
                  {(item.productName || item.name || "P")[0]}
                </Avatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={600} noWrap>{item.productName || item.name || "—"}</Typography>}
                  secondary={<Typography variant="caption" color={critical ? "error" : "warning.main"} fontWeight={600}>Qty: {qty} {critical ? "— Critical" : "— Low"}</Typography>}
                />
              </ListItem>
            );
          })}
          {items.length === 0 && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body2" color="text.secondary">All stocks healthy ✓</Typography>
            </Box>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
