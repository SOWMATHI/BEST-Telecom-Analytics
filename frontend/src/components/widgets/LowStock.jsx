import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Chip, List, ListItem, ListItemText, Skeleton } from "@mui/material";
import { WarningAmber, CheckCircleOutline, Storefront, LocationCity } from "@mui/icons-material";
import api from "../../api/axios";
import { mockLowStock } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

export default function LowStock() {
  const { filterByBranch, currentBranch } = useBranch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/low-stock");
        if (res.data?.length) {
          setItems(res.data);
        } else {
          setItems(mockLowStock);
        }
      } catch {
        setItems(mockLowStock);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const branchItems = filterByBranch(items);

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
              Stock Reorder Warnings
            </Typography>
            <Typography variant="caption" color="#94A3B8">
              Depleted inventory ({currentBranch.name})
            </Typography>
          </Box>
          <Box sx={{ px: 1.2, py: 0.3, borderRadius: 1.5, bgcolor: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <Typography variant="caption" fontWeight={800} color="#EF4444" fontSize={11}>
              {branchItems.length} Alerts
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.04)" }} />
        ) : (
          <List disablePadding>
            {branchItems.map((item, index) => {
              const qty = item.quantity ?? item.stock ?? 0;
              const isCBR = (item.branch || "Coimbatore").toLowerCase().includes("coimbatore");
              return (
                <ListItem
                  key={item._id || index}
                  disableGutters
                  sx={{
                    py: 1.2,
                    borderBottom: index < branchItems.length - 1 ? "1px solid rgba(255, 255, 255, 0.06)" : "none",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      bgcolor: "rgba(239, 68, 68, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                      color: "#EF4444",
                      flexShrink: 0,
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                    }}
                  >
                    <WarningAmber sx={{ fontSize: 18 }} />
                  </Box>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={700} color="#FFFFFF">
                        {item.productName || item.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3 }}>
                        <Typography variant="caption" color="#94A3B8">
                          SKU: {item.sku || "N/A"}
                        </Typography>
                        <Chip
                          icon={isCBR ? <Storefront sx={{ fontSize: "12px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "12px !important", color: "#00F59B !important" }} />}
                          label={item.branch || "Coimbatore"}
                          size="small"
                          sx={{
                            fontSize: 9.5,
                            fontWeight: 800,
                            height: 18,
                            bgcolor: isCBR ? "rgba(52, 211, 153, 0.12)" : "rgba(0, 245, 155, 0.12)",
                            color: isCBR ? "#34D399" : "#00F59B",
                            border: isCBR ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(0, 245, 155, 0.3)",
                          }}
                        />
                      </Box>
                    }
                  />
                  <Chip
                    label={`${qty} left`}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: 11,
                      bgcolor: "rgba(239, 68, 68, 0.15)",
                      color: "#EF4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                  />
                </ListItem>
              );
            })}
            {branchItems.length === 0 && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CheckCircleOutline sx={{ fontSize: 36, color: "#00E599", mb: 1 }} />
                <Typography variant="body2" color="#FFFFFF" fontWeight={700}>
                  Stock Healthy
                </Typography>
                <Typography variant="caption" color="#94A3B8">
                  All gadget lines optimal for {currentBranch.name}
                </Typography>
              </Box>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
