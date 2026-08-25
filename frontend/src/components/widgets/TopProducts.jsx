import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, LinearProgress, Skeleton } from "@mui/material";
import api from "../../api/axios";
import { mockTopProducts } from "../../api/mockData";

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/top-products");
        if (res.data?.length) {
          setProducts(res.data);
        } else {
          setProducts(mockTopProducts);
        }
      } catch {
        setProducts(mockTopProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const maxVal = Math.max(...products.map((p) => p.totalRevenue || p.revenue || p.totalSold || 1), 1);

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: "#0D131F",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#FFFFFF" letterSpacing="-0.015em">
              Top Selling SKUs
            </Typography>
            <Typography variant="caption" color="#94A3B8">
              Ranked by total gross volume
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.04)" }} />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {products.slice(0, 5).map((prod, index) => {
              const val = prod.totalRevenue || prod.revenue || prod.totalSold || 0;
              const pct = (val / maxVal) * 100;
              return (
                <Box key={prod._id || index}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          bgcolor: index === 0 ? "#00E599" : index === 1 ? "#34D399" : "rgba(255, 255, 255, 0.1)",
                          color: index < 2 ? "#04130C" : "#94A3B8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10.5,
                          fontWeight: 800,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body2" fontWeight={700} color="#FFFFFF" noWrap sx={{ maxWidth: 160 }}>
                        {prod.productName || prod.name || "Product"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={800} color="#00E599">
                      ₹{Number(val).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: "rgba(255, 255, 255, 0.06)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: index === 0 ? "#00E599" : index === 1 ? "#34D399" : "#059669",
                        borderRadius: 3,
                        boxShadow: index === 0 ? "0 0 8px #00E599" : "none",
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
