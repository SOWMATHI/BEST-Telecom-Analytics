import { useState } from "react";
import {
  Card, CardContent, Typography, Box, Grid, Chip, Button,
  LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert,
} from "@mui/material";
import { WarningAmber, Reorder, CheckCircle, ShoppingCart, Storefront, LocationCity } from "@mui/icons-material";
import { mockProducts } from "../../api/mockData";
import { createPurchaseOrder } from "../../api/purchaseOrders";
import { useBranch } from "../../context/BranchContext";

export default function RestockSection() {
  const { filterByBranch, currentBranch } = useBranch();
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [selectedTypeIdx, setSelectedTypeIdx] = useState(0);
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [restockQty, setRestockQty] = useState(100);
  const [success, setSuccess] = useState(null);

  const branchProducts = filterByBranch(mockProducts);
  const restockItems = branchProducts.filter((p) => (p.stock ?? 0) <= (p.minStock || 20));

  const activeProduct = selectedProduct || restockItems[0] || branchProducts[0];
  const variants = activeProduct?.variants || [
    {
      typeName: "Standard Specification",
      units: [
        { unitName: "Single Piece (1 Pc)", qty: 1, price: activeProduct?.price || 500 },
        { unitName: "Wholesale Box (10 Pcs)", qty: 10, price: Math.round((activeProduct?.price || 500) * 9.5) },
        { unitName: "Master Carton (50 Pcs)", qty: 50, price: Math.round((activeProduct?.price || 500) * 45) },
      ],
    },
  ];

  const activeType = variants[selectedTypeIdx] || variants[0];
  const activeUnit = activeType?.units?.[selectedUnitIdx] || activeType?.units?.[0];

  const handleRestock = async () => {
    try {
      const branchCode = (activeProduct.branch || "Coimbatore") === "Tirupur" ? "TPR" : "CBR";
      const poNo = `PO-${branchCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      const costPrice = Math.round((activeUnit?.price || 500) * 0.75);
      await createPurchaseOrder({
        purchaseOrderNo: poNo,
        supplier: { name: "VoltPro GaN Semiconductor Tech" },
        product: { name: activeProduct.name },
        quantity: Number(restockQty),
        purchasePrice: costPrice,
        totalAmount: Number(restockQty) * costPrice,
        branch: activeProduct.branch || "Coimbatore",
        status: "Ordered",
      });
      setRestockDialogOpen(false);
      setSuccess(`Restock PO placed: ${poNo} for ${activeProduct.name} (${restockQty} units)`);
    } catch {
      setRestockDialogOpen(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: "#0D131F",
        border: "1px solid rgba(0, 229, 153, 0.25)",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2, bgcolor: "rgba(0, 229, 153, 0.1)", color: "#00E599" }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Typography variant="h6" fontWeight={800} color="#FFFFFF" letterSpacing="-0.015em">
                🚨 Wholesale Restock & Product Unit Pricing Explorer
              </Typography>
              <Chip
                label={`${restockItems.length} Products To Restock`}
                size="small"
                sx={{
                  bgcolor: "rgba(239, 68, 68, 0.15)",
                  color: "#EF4444",
                  fontWeight: 900,
                  fontSize: 10.5,
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                }}
              />
            </Box>
            <Typography variant="caption" color="#94A3B8">
              Click any depleted electronic gadget to view its variants, packaging units, and exact wholesale amount ({currentBranch.name})
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Depleted Products List */}
          <Grid item xs={12} md={5}>
            <Typography variant="caption" fontWeight={800} color="#94A3B8" sx={{ textTransform: "uppercase", display: "block", mb: 1.5 }}>
              Select Depleted Gadget Line:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 340, overflowY: "auto", pr: 0.5 }}>
              {restockItems.map((prod) => {
                const isSelected = activeProduct?._id === prod._id;
                const isCBR = (prod.branch || "Coimbatore").toLowerCase().includes("coimbatore");
                return (
                  <Box
                    key={prod._id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setSelectedTypeIdx(0);
                      setSelectedUnitIdx(0);
                    }}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      cursor: "pointer",
                      bgcolor: isSelected ? "rgba(0, 229, 153, 0.12)" : "#070A0E",
                      border: isSelected ? "1.5px solid #00E599" : "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: isSelected ? "0 0 12px rgba(0, 229, 153, 0.2)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease",
                      "&:hover": { borderColor: "#00E599", bgcolor: "rgba(0, 229, 153, 0.06)" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <WarningAmber sx={{ color: "#EF4444", fontSize: 18 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={800} color="#FFFFFF">
                          {prod.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.2 }}>
                          <Typography variant="caption" color="#94A3B8">
                            {prod.category}
                          </Typography>
                          <Chip
                            icon={isCBR ? <Storefront sx={{ fontSize: "10px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "10px !important", color: "#00F59B !important" }} />}
                            label={prod.branch || "Coimbatore"}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: 9,
                              fontWeight: 800,
                              bgcolor: isCBR ? "rgba(52, 211, 153, 0.12)" : "rgba(0, 245, 155, 0.12)",
                              color: isCBR ? "#34D399" : "#00F59B",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      label={`${prod.stock} left`}
                      size="small"
                      sx={{
                        fontWeight: 900,
                        fontSize: 10.5,
                        bgcolor: "rgba(239, 68, 68, 0.18)",
                        color: "#EF4444",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Grid>

          {/* Right Column: Selected Product Types, Packaging Units & Exact Amount Display */}
          <Grid item xs={12} md={7}>
            {activeProduct && (
              <Box sx={{ bgcolor: "#070A0E", p: 2.5, borderRadius: 2.5, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={900} color="#FFFFFF">
                      {activeProduct.name}
                    </Typography>
                    <Typography variant="caption" color="#94A3B8">
                      SKU: {activeProduct.sku} · Brand: {activeProduct.brand}
                    </Typography>
                  </Box>
                  <Chip
                    label={`Stock: ${activeProduct.stock} / ${activeProduct.minStock || 25} (Restock Threshold)`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(239, 68, 68, 0.15)",
                      color: "#EF4444",
                      fontWeight: 800,
                      fontSize: 10.5,
                    }}
                  />
                </Box>

                {/* Step 1: Type / Variant Selector */}
                <Typography variant="caption" fontWeight={800} color="#94A3B8" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                  1. Choose Variant / Type:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  {variants.map((v, idx) => {
                    const isSelected = selectedTypeIdx === idx;
                    return (
                      <Button
                        key={v.typeName}
                        size="small"
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={() => {
                          setSelectedTypeIdx(idx);
                          setSelectedUnitIdx(0);
                        }}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: 11.5,
                          bgcolor: isSelected ? "#00E599" : "rgba(255, 255, 255, 0.04)",
                          color: isSelected ? "#04130C" : "#E2E8F0",
                          borderColor: isSelected ? "#00E599" : "rgba(255, 255, 255, 0.15)",
                          "&:hover": { bgcolor: isSelected ? "#00F59B" : "rgba(0, 229, 153, 0.1)" },
                        }}
                      >
                        {v.typeName}
                      </Button>
                    );
                  })}
                </Box>

                {/* Step 2: Packaging Units Selector */}
                <Typography variant="caption" fontWeight={800} color="#94A3B8" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                  2. Choose Packaging Unit:
                </Typography>
                <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                  {activeType?.units?.map((u, idx) => {
                    const isSelected = selectedUnitIdx === idx;
                    return (
                      <Grid item xs={12} sm={4} key={u.unitName}>
                        <Box
                          onClick={() => setSelectedUnitIdx(idx)}
                          sx={{
                            cursor: "pointer",
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isSelected ? "rgba(0, 229, 153, 0.12)" : "#0D131F",
                            border: isSelected ? "2px solid #00E599" : "1px solid rgba(255, 255, 255, 0.08)",
                            boxShadow: isSelected ? "0 0 10px rgba(0, 229, 153, 0.25)" : "none",
                            transition: "all 0.15s ease",
                            "&:hover": { borderColor: "#00E599" },
                          }}
                        >
                          <Typography variant="caption" fontWeight={800} color={isSelected ? "#00E599" : "#94A3B8"} sx={{ textTransform: "uppercase", fontSize: 10 }}>
                            {u.unitName}
                          </Typography>
                          <Typography variant="h6" fontWeight={900} color="#FFFFFF" sx={{ mt: 0.3 }}>
                            ₹{Number(u.price).toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Amount Display & Restock Button */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(0, 229, 153, 0.08)",
                    border: "1px solid rgba(0, 229, 153, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="#94A3B8" fontWeight={700}>
                      Total Unit Amount:
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color="#00E599">
                      ₹{Number(activeUnit?.price || 0).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Reorder />}
                    onClick={() => {
                      setRestockQty(activeUnit?.qty || 50);
                      setRestockDialogOpen(true);
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
                      color: "#04130C",
                    }}
                  >
                    1-Click Restock PO
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>

      {/* Restock Dialog */}
      <Dialog open={restockDialogOpen} onClose={() => setRestockDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.3)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Confirm Wholesale Restock</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="#FFFFFF" fontWeight={700} mb={1}>
              Product: <span style={{ color: "#00E599" }}>{activeProduct?.name} ({activeType?.typeName})</span>
            </Typography>
            <Typography variant="caption" color="#94A3B8" display="block" mb={2}>
              Unit: {activeUnit?.unitName} · Hub: {activeProduct?.branch || "Coimbatore"}
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Quantity to Restock"
              type="number"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setRestockDialogOpen(false)} sx={{ color: "#94A3B8" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRestock}
            sx={{ borderRadius: 2, fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}
          >
            Confirm PO
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
