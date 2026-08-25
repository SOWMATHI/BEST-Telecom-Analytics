import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axios";
import { mockMonthlyChart } from "../../api/mockData";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SalesChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/monthly-chart");
        if (res.data?.length) {
          setData(res.data.map((item) => ({
            month: MONTHS[(item._id?.month || 1) - 1],
            Sales: item.totalSales,
          })));
        } else {
          setData(mockMonthlyChart.map((item) => ({
            month: MONTHS[(item._id?.month || 1) - 1],
            Sales: item.totalSales,
          })));
        }
      } catch {
        setData(mockMonthlyChart.map((item) => ({
          month: MONTHS[(item._id?.month || 1) - 1],
          Sales: item.totalSales,
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <Typography variant="caption" fontWeight={800} color="#00E599" sx={{ textTransform: "uppercase" }}>
            {label} Transactions
          </Typography>
          <Typography variant="body2" fontWeight={800} color="#FFFFFF" sx={{ mt: 0.5 }}>
            {Number(payload[0].value).toLocaleString("en-IN")} units sold
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
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#FFFFFF" letterSpacing="-0.015em">
              Transaction Volume
            </Typography>
            <Typography variant="caption" color="#94A3B8">
              Monthly sales volume completed across all branches
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.04)" }} />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} barSize={26} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Sales" fill="#00E599" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
