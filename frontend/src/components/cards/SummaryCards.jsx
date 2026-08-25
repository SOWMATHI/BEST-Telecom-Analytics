import { Grid, Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { CurrencyRupee, ShoppingCart, People, Inventory2, TrendingUp, Warehouse, AccountBalance, Person } from "@mui/icons-material";

const cardConfig = [
  { key: "totalRevenue", title: "Total Revenue", icon: CurrencyRupee, color: "#00E599", bg: "rgba(0, 229, 153, 0.12)", format: (v) => `₹${Number(v||0).toLocaleString("en-IN")}` },
  { key: "totalProfit", title: "Net Profit", icon: TrendingUp, color: "#00E599", bg: "rgba(0, 229, 153, 0.12)", format: (v) => `₹${Number(v||0).toLocaleString("en-IN")}` },
  { key: "totalSales", title: "Transactions", icon: ShoppingCart, color: "#FFFFFF", bg: "rgba(255, 255, 255, 0.1)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalCustomers", title: "Active Customers", icon: People, color: "#00E599", bg: "rgba(0, 229, 153, 0.12)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalProducts", title: "Catalog Items", icon: Inventory2, color: "#34D399", bg: "rgba(52, 211, 153, 0.12)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalInventory", title: "Warehouse Stock", icon: Warehouse, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.12)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalBranches", title: "Hub Branches", icon: AccountBalance, color: "#00E599", bg: "rgba(0, 229, 153, 0.12)", format: (v) => Number(v||0).toLocaleString("en-IN") },
  { key: "totalEmployees", title: "Sales Force", icon: Person, color: "#FFFFFF", bg: "rgba(255, 255, 255, 0.1)", format: (v) => Number(v||0).toLocaleString("en-IN") },
];

export default function SummaryCards({ summary, loading }) {
  return (
    <Grid container spacing={2.5}>
      {cardConfig.map((card) => {
        const Icon = card.icon;
        const value = summary ? card.format(summary[card.key]) : "—";
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.key}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: "#0D131F",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
                transition: "all .2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 229, 153, 0.1)",
                  borderColor: "rgba(0, 229, 153, 0.35)",
                },
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 2.8, "&:last-child": { pb: 2.8 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="#94A3B8"
                      fontWeight={800}
                      sx={{ textTransform: "uppercase", letterSpacing: 0.6, fontSize: "0.72rem" }}
                    >
                      {card.title}
                    </Typography>
                    {loading ? (
                      <Skeleton width={110} height={36} sx={{ mt: 0.5, bgcolor: "rgba(255,255,255,0.06)" }} />
                    ) : (
                      <Typography
                        variant="h5"
                        fontWeight={900}
                        color="#FFFFFF"
                        sx={{ mt: 0.6, lineHeight: 1.2, letterSpacing: "-0.02em" }}
                      >
                        {value}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: card.bg,
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${card.color}35`,
                      boxShadow: `0 0 14px ${card.color}25`,
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
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
