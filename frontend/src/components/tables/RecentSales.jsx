import { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, Skeleton,
} from "@mui/material";
import { Storefront, LocationCity } from "@mui/icons-material";
import api from "../../api/axios";
import { mockRecentSales } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

export default function RecentSales() {
  const { filterByBranch, currentBranch } = useBranch();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/recent-sales");
        if (res.data?.length) {
          setSales(res.data);
        } else {
          setSales(mockRecentSales);
        }
      } catch {
        setSales(mockRecentSales);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const branchSales = filterByBranch(sales);

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
              Recent Wholesale Transactions
            </Typography>
            <Typography variant="caption" color="#94A3B8">
              Live B2B retailer dispatches ({currentBranch.name})
            </Typography>
          </Box>
          <Box sx={{ px: 1.2, py: 0.3, borderRadius: 1.5, bgcolor: "rgba(0, 229, 153, 0.1)", border: "1px solid rgba(0, 229, 153, 0.25)" }}>
            <Typography variant="caption" fontWeight={700} color="#00E599">
              {branchSales.length} Transactions
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.04)" }} />
        ) : (
          <TableContainer sx={{ border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 2, bgcolor: "#070A0E" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#090E18" }}>
                  <TableCell sx={{ color: "#94A3B8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Wholesale Client</TableCell>
                  <TableCell sx={{ color: "#94A3B8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Hub Location</TableCell>
                  <TableCell sx={{ color: "#94A3B8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Gadget Items</TableCell>
                  <TableCell align="right" sx={{ color: "#94A3B8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Amount</TableCell>
                  <TableCell align="center" sx={{ color: "#94A3B8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchSales.slice(0, 6).map((sale, i) => {
                  const isCBR = (sale.branch || "Coimbatore").toLowerCase().includes("coimbatore");
                  return (
                    <TableRow key={sale._id || i} hover sx={{ "& td": { borderBottom: "1px solid rgba(255, 255, 255, 0.05)", py: 1.3 } }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800, border: "1px solid rgba(0, 229, 153, 0.3)" }}>
                            {(sale.customerName || sale.customer?.fullName || "C")[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={700} color="#FFFFFF">
                            {sale.customerName || sale.customer?.fullName || "Retailer Showroom"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
                          label={sale.branch || "Coimbatore"}
                          size="small"
                          sx={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            bgcolor: isCBR ? "rgba(52, 211, 153, 0.12)" : "rgba(0, 245, 155, 0.12)",
                            color: isCBR ? "#34D399" : "#00F59B",
                            border: isCBR ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(0, 245, 155, 0.3)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#94A3B8">
                          {sale.productName || sale.product?.productName || "Gadget Line"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={800} color="#00E599">
                          ₹{Number(sale.totalAmount || 0).toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={sale.status || "Completed"}
                          size="small"
                          sx={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            bgcolor: "rgba(0, 229, 153, 0.15)",
                            color: "#00E599",
                            border: "1px solid rgba(0, 229, 153, 0.35)",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
