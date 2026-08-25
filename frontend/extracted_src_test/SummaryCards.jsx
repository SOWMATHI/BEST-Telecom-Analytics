import { Grid, Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { CurrencyRupee, ShoppingCart, People, Inventory2, TrendingUp, Warehouse, AccountBalance, Person } from "@mui/icons-material";

const cardConfig = [
  { key: "totalRevenue", title: "Revenue", icon: CurrencyRupee, color: "#16A34A", bg: "linear-gradient(135deg,#16A34A,#15803D)", format: (v) => `₹${Number(v||0).toLocaleString("en-IN")}` },
  { key: "totalProfit", title: "Profit", icon: TrendingUp, color: "#1976D2", bg: "linear-gradient(135deg,#1976D2,#1565C0)", format: (v) => `₹${Number(v||0).toLocaleString("en-IN")}` },
  { key: "totalSales", title: "Sales", icon: ShoppingCart, color: "#7C3AED", bg: "linear-gradient(135deg,#7C3AED,#6D28D9)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalCustomers", title: "Customers", icon: People, color: "#EA580C", bg: "linear-gradient(135deg,#EA580C,#C2410C)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalProducts", title: "Products", icon: Inventory2, color: "#0891B2", bg: "linear-gradient(135deg,#0891B2,#0E7490)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalInventory", title: "Inventory", icon: Warehouse, color: "#D97706", bg: "linear-gradient(135deg,#D97706,#B45309)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalBranches", title: "Branches", icon: AccountBalance, color: "#DB2777", bg: "linear-gradient(135deg,#DB2777,#BE185D)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalEmployees", title: "Employees", icon: Person, color: "#059669", bg: "linear-gradient(135deg,#059669,#047857)", format: (v) => Number(v||0).toLocaleString("en-IN") },
];

export default function SummaryCards({ summary, loading }) {
  return (
    <Grid container spacing={2.5}>
      {cardConfig.map((card) => {
        const Icon = card.icon;
        const value = summary ? card.format(summary[card.key]) : "—";
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.key}>
            <Card sx={{
              borderRadius: 3.5,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              transition: "all .25s ease",
              border: "1px solid rgba(255,255,255,0.8)",
              "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 28px rgba(0,0,0,0.13)" },
              overflow: "hidden",
              position: "relative",
            }}>
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: card.bg }} />
              <CardContent sx={{ p: 3, pt: 3.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
                      {card.title}
                    </Typography>
                    {loading ? (
                      <Skeleton width={100} height={40} sx={{ mt: 0.5 }} />
                    ) : (
                      <Typography variant="h5" fontWeight={800} color="#0F172A" sx={{ mt: 0.5, lineHeight: 1.2 }}>
                        {value}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{
                    width: 52, height: 52, borderRadius: 2.5,
                    background: card.bg, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 6px 16px ${card.color}40`,
                    flexShrink: 0,
                  }}>
                    <Icon sx={{ fontSize: 26 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
