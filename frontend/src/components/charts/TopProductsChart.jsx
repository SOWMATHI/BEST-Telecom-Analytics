import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../../api/axios";
import { mockTopProducts } from "../../api/mockData";

const COLORS = ["#00E599", "#34D399", "#10B981", "#059669", "#FFFFFF", "#F59E0B", "#6EE7B7"];

export default function TopProductsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/top-products");
        if (res.data?.length) {
          setData(res.data.map((item) => ({
            name: item.productName || item.name || "Item",
            value: item.totalRevenue || item.revenue || item.totalSold || 0,
          })));
        } else {
          setData(mockTopProducts.map((item) => ({
            name: item.productName,
            value: item.totalRevenue,
          })));
        }
      } catch {
        setData(mockTopProducts.map((item) => ({
          name: item.productName,
          value: item.totalRevenue,
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "#0D131F",
            p: 1.5,
            borderRadius: 2.5,
            border: "1px solid rgba(0, 229, 153, 0.4)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}
        >
          <Typography variant="body2" fontWeight={800} color="#FFFFFF">
            {payload[0].name}
          </Typography>
          <Typography variant="body2" fontWeight={700} color="#00E599" sx={{ mt: 0.3 }}>
            ₹{Number(payload[0].value).toLocaleString("en-IN")}
          </Typography>
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 3 } }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={800} color="#FFFFFF" letterSpacing="-0.015em">
            Product Revenue Share
          </Typography>
          <Typography variant="caption" color="#94A3B8">
            Top performing revenue drivers
          </Typography>
        </Box>

        {loading ? (
          <Skeleton variant="circular" width={180} height={180} sx={{ m: "auto", bgcolor: "rgba(255,255,255,0.04)" }} />
        ) : (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", minHeight: 250 }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#070A0E" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#94A3B8", paddingTop: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
