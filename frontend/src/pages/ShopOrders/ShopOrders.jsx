import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment, Chip,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Alert, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Avatar, MenuItem, Paper, LinearProgress, Divider
} from "@mui/material";
import {
  Search, Add, Refresh, CheckCircle, WarningAmber, LocalShipping,
  Factory, Storefront, LocationCity, Inventory2, ArrowForward,
  AssignmentTurnedIn, ReceiptLong, ShoppingCartCheckout, ShoppingBag,
  FlashOn, PrecisionManufacturing, Send
} from "@mui/icons-material";
import { getShopOrders, placeShopOrder, deliverShopOrder } from "../../api/shopOrders";
import { mockProducts, mockCustomers, mockSuppliers, mockPurchaseOrders } from "../../api/mockData";
import { useBranch } from "../../context/BranchContext";

export default function ShopOrders() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mfrDialogOpen, setMfrDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // New Incoming Shop Order Form state
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [selectedVariant, setSelectedVariant] = useState(mockProducts[0].variants[0]);
  const [selectedUnit, setSelectedUnit] = useState(mockProducts[0].variants[0].units[0]);
  const [orderQty, setOrderQty] = useState(10);
  const [orderBranch, setOrderBranch] = useState("Coimbatore");

  // Direct Manufacturer Reorder state
  const [mfrSelectedProduct, setMfrSelectedProduct] = useState(mockProducts[0]);
  const [mfrSelectedSupplier, setMfrSelectedSupplier] = useState(mockSuppliers[0].name);
  const [mfrSelectedVariant, setMfrSelectedVariant] = useState(mockProducts[0].variants[0]);
  const [mfrSelectedUnit, setMfrSelectedUnit] = useState(mockProducts[0].variants[0].units[0]);
  const [mfrOrderQty, setMfrOrderQty] = useState(100);
  const [mfrUnitCost, setMfrUnitCost] = useState(280);
  const [mfrDestinationBranch, setMfrDestinationBranch] = useState("Coimbatore");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getShopOrders();
      setOrders(res.data?.orders || []);
      setProductsList([...mockProducts]);
    } catch {
      setError("Failed to load shop orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Handle Incoming Shop Order Changes
  const handleProductChange = (prodName) => {
    const prod = productsList.find((p) => p.name === prodName) || productsList[0];
    setSelectedProduct(prod);
    setSelectedVariant(prod.variants[0]);
    setSelectedUnit(prod.variants[0].units[0]);
  };

  const handleVariantChange = (varName) => {
    const v = selectedProduct.variants.find((item) => item.typeName === varName) || selectedProduct.variants[0];
    setSelectedVariant(v);
    setSelectedUnit(v.units[0]);
  };

  const handleUnitChange = (uName) => {
    const u = selectedVariant.units.find((item) => item.unitName === uName) || selectedVariant.units[0];
    setSelectedUnit(u);
  };

  // Handle Direct Manufacturer Order Changes
  const handleMfrProductChange = (prodName) => {
    const prod = productsList.find((p) => p.name === prodName) || productsList[0];
    setMfrSelectedProduct(prod);
    setMfrSelectedVariant(prod.variants[0]);
    setMfrSelectedUnit(prod.variants[0].units[0]);
    const estCost = Math.round((prod.variants[0].units[0]?.price || 500) * 0.65);
    setMfrUnitCost(estCost);
  };

  // Open direct manufacturer reorder modal for a specific low stock item
  const openMfrReorderForItem = (prod) => {
    setMfrSelectedProduct(prod);
    setMfrSelectedVariant(prod.variants[0]);
    setMfrSelectedUnit(prod.variants[0].units[0]);
    const shortage = Math.max((prod.minStock || 25) - prod.stock, 50);
    setMfrOrderQty(shortage >= 50 ? shortage : 100);
    const estCost = Math.round((prod.variants[0].units[0]?.price || 500) * 0.65);
    setMfrUnitCost(estCost);
    setMfrDestinationBranch(prod.branch || (selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore"));
    setMfrDialogOpen(true);
  };

  // Real-time stock status check for shop order
  const availableStock = selectedProduct ? selectedProduct.stock : 0;
  const isStockAvailable = availableStock >= Number(orderQty);
  const shortageQty = Math.max(0, Number(orderQty) - availableStock);
  const calculatedTotalAmount = (selectedUnit?.price || 500) * Math.max(1, Math.round(Number(orderQty) / (selectedUnit?.qty || 1)));

  // Place Incoming Shop Order
  const handlePlaceOrder = async () => {
    setSaving(true);
    try {
      await placeShopOrder({
        shopName: selectedShop || "Sri Murugan Mobiles Wholesale",
        productName: selectedProduct.name,
        productId: selectedProduct._id,
        type: selectedVariant.typeName,
        unit: selectedUnit.unitName,
        requestedQty: Number(orderQty),
        branch: orderBranch,
        amount: calculatedTotalAmount,
      });
      setDialogOpen(false);
      setSuccessMsg(`✅ Shop order submitted for ${selectedProduct.name}! ${isStockAvailable ? "Fulfilled & Dispatched immediately." : "Shortage PO sent to OEM factory."}`);
      load();
    } catch {
      setError("Failed to submit shop order.");
    } finally {
      setSaving(false);
    }
  };

  // Dispatch Direct Manufacturer Purchase Order
  const handleDispatchManufacturerPO = () => {
    setSaving(true);
    try {
      const branchCode = mfrDestinationBranch === "Tirupur" ? "TPR" : "CBR";
      const poNo = `PO-${branchCode}-${Math.floor(8600 + Math.random() * 1000)}`;
      const qty = Number(mfrOrderQty || 100);
      const totalAmount = qty * Number(mfrUnitCost || 280);

      // Create new PO
      const newPO = {
        _id: `PO-${Date.now().toString().slice(-4)}`,
        purchaseOrderNo: poNo,
        supplier: { name: mfrSelectedSupplier },
        product: { name: mfrSelectedProduct.name },
        quantity: qty,
        purchasePrice: Number(mfrUnitCost || 280),
        totalAmount,
        branch: mfrDestinationBranch,
        status: "Received", // Immediately restock
        createdAt: new Date().toISOString(),
      };
      mockPurchaseOrders.unshift(newPO);

      // Add stock to product
      const targetProd = mockProducts.find((p) => p.name === mfrSelectedProduct.name);
      if (targetProd) {
        targetProd.stock += qty;
      }

      // Check and unlock any shop orders that were waiting for this product
      orders.forEach((ord) => {
        if (ord.productName === mfrSelectedProduct.name && ord.status.includes("Shortage")) {
          ord.availableStock = targetProd ? targetProd.stock : 100;
          ord.status = "Sufficient Stock - Delivered";
          ord.fulfillmentStatus = `Delivered & Invoiced (Restocked via ${poNo})`;
        }
      });

      setMfrDialogOpen(false);
      setSuccessMsg(`🏭 Manufacturer PO ${poNo} dispatched! Successfully credited ${qty} units of ${mfrSelectedProduct.name} to ${mfrDestinationBranch} Warehouse.`);
      load();
    } catch {
      setError("Failed to dispatch manufacturer PO.");
    } finally {
      setSaving(false);
    }
  };

  const handleFulfillOrder = async (orderId) => {
    try {
      await deliverShopOrder(orderId);
      setSuccessMsg("✅ Order fulfilled and delivered to retailer shop!");
      load();
    } catch {
      setError("Failed to fulfill delivery.");
    }
  };

  const branchFilteredOrders = filterByBranch(orders);
  const filteredOrders = branchFilteredOrders.filter((o) =>
    [o.shopName, o.productName, o.orderNo, o.type, o.branch, o.status].some((f) =>
      String(f || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Filter low stock items for the active branch
  const branchFilteredProducts = filterByBranch(productsList);
  const lowStockItems = branchFilteredProducts.filter((p) => (p.stock || 0) <= (p.minStock || 25));

  const totalOrders = filteredOrders.length;
  const fulfilledOrders = filteredOrders.filter((o) => o.status.includes("Sufficient") || o.status.includes("Delivered")).length;
  const shortageOrders = filteredOrders.filter((o) => o.status.includes("Shortage") || o.status.includes("Manufacturer")).length;
  const totalInvoiced = filteredOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(0, 229, 153, 0.1)", color: "#00E599", border: "1px solid rgba(0, 229, 153, 0.35)", fontWeight: 700 }}>
          {successMsg}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Retailer Orders & Supply Chain Fulfillment
            </Typography>
            <Chip
              label={currentBranch.name}
              size="small"
              sx={{
                bgcolor: "rgba(0, 229, 153, 0.15)",
                color: "#00E599",
                border: "1px solid rgba(0, 229, 153, 0.35)",
                fontWeight: 800,
                fontSize: 10,
              }}
            />
          </Box>
          <Typography variant="body2" color="#94A3B8">
            Automatic stock verification: Deliver immediately if available, or order necessary units directly from OEM manufacturers.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<Factory />}
            onClick={() => {
              setMfrSelectedProduct(lowStockItems[0] || mockProducts[0]);
              setMfrDialogOpen(true);
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              color: "#00E599",
              borderColor: "rgba(0, 229, 153, 0.4)",
              bgcolor: "rgba(0, 229, 153, 0.08)",
              "&:hover": { borderColor: "#00E599", bgcolor: "rgba(0, 229, 153, 0.15)" },
            }}
          >
            Order from Manufacturer
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setOrderBranch(selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore");
              setSelectedShop(mockCustomers[0].name);
              setDialogOpen(true);
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
              color: "#04130C",
              boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
            }}
          >
            Receive Shop Order
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {[
          { label: "Total Shop Orders", value: totalOrders, color: "#FFFFFF", icon: ReceiptLong },
          { label: "Sufficient Stock & Delivered", value: `${fulfilledOrders} Orders`, color: "#00E599", icon: CheckCircle },
          { label: "Low Stock / Shortage Lines", value: `${lowStockItems.length} Gadgets`, color: "#EF4444", icon: WarningAmber },
          { label: "Total Invoiced Revenue", value: `₹${totalInvoiced.toLocaleString("en-IN")}`, color: "#34D399", icon: LocalShipping },
        ].map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", p: 2.5, bgcolor: "#0D131F" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="#94A3B8" fontWeight={800} sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}>{kpi.label}</Typography>
                  <Typography variant="h5" fontWeight={900} color={kpi.color} sx={{ mt: 0.5, letterSpacing: "-0.02em" }}>{kpi.value}</Typography>
                </Box>
                <Box sx={{ bgcolor: `${kpi.color}15`, borderRadius: 2.5, p: 1.2, color: kpi.color, border: `1px solid ${kpi.color}30` }}>
                  <kpi.icon sx={{ fontSize: 22 }} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ========================================================================= */}
      {/* 🚨 DEDICATED SECTION: CRITICAL LOW STOCK & DIRECT MANUFACTURER REORDER HUB */}
      {/* ========================================================================= */}
      <Card
        sx={{
          borderRadius: 3.5,
          border: "1px solid rgba(239, 68, 68, 0.35)",
          bgcolor: "linear-gradient(180deg, #0F1420 0%, #0A0E17 100%)",
          background: "#0D131F",
          p: 3,
          mb: 4,
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8), 0 0 24px rgba(239, 68, 68, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: "rgba(239, 68, 68, 0.15)", color: "#EF4444", p: 1, borderRadius: 2, display: "flex" }}>
                <PrecisionManufacturing sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h6" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
                Low Stock Thresholds & Direct Manufacturer Procurement Hub
              </Typography>
              <Chip
                label={`${lowStockItems.length} DEPLETED LINES`}
                size="small"
                sx={{
                  bgcolor: "rgba(239, 68, 68, 0.18)",
                  color: "#EF4444",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  fontWeight: 800,
                  fontSize: 10,
                }}
              />
            </Box>
            <Typography variant="body2" color="#94A3B8" sx={{ mt: 0.5 }}>
              When warehouse inventory runs low, select any gadget to dispatch an instant Purchase Order to the OEM factory manufacturer.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Factory />}
            onClick={() => {
              setMfrSelectedProduct(lowStockItems[0] || mockProducts[0]);
              setMfrDialogOpen(true);
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
              color: "#04130C",
              boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
            }}
          >
            Order Necessary Units from Manufacturer
          </Button>
        </Box>

        {/* Low Stock Items Grid */}
        <Grid container spacing={2}>
          {lowStockItems.map((prod) => {
            const shortage = Math.max((prod.minStock || 25) - prod.stock, 0);
            const stockPct = Math.min(Math.round((prod.stock / (prod.minStock || 25)) * 100), 100);
            const isCBR = String(prod.branch || "Coimbatore").toLowerCase().includes("coimbatore");

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={prod._id}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "#070A0E",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all .2s ease",
                    "&:hover": {
                      borderColor: "rgba(0, 229, 153, 0.4)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 16px rgba(0, 229, 153, 0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#FFFFFF">
                        {prod.name}
                      </Typography>
                      <Typography variant="caption" color="#94A3B8">
                        {prod.category} · {prod.sku}
                      </Typography>
                    </Box>
                    <Chip
                      icon={isCBR ? <Storefront sx={{ fontSize: "12px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "12px !important", color: "#00F59B !important" }} />}
                      label={prod.branch || "Coimbatore"}
                      size="small"
                      sx={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        height: 20,
                        bgcolor: isCBR ? "rgba(52, 211, 153, 0.12)" : "rgba(0, 245, 155, 0.12)",
                        color: isCBR ? "#34D399" : "#00F59B",
                        border: isCBR ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(0, 245, 155, 0.3)",
                      }}
                    />
                  </Box>

                  {/* Stock Gauge */}
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="caption" color="#EF4444" fontWeight={800}>
                        {prod.stock} units left
                      </Typography>
                      <Typography variant="caption" color="#94A3B8">
                        Min: {prod.minStock || 25} units
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stockPct}
                      sx={{
                        height: 5,
                        borderRadius: 3,
                        bgcolor: "rgba(255, 255, 255, 0.08)",
                        "& .MuiLinearProgress-bar": { bgcolor: "#EF4444", borderRadius: 3 },
                      }}
                    />
                  </Box>

                  {/* Action */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Factory sx={{ fontSize: 14 }} />}
                    onClick={() => openMfrReorderForItem(prod)}
                    sx={{
                      borderRadius: 1.8,
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: 11,
                      color: "#00E599",
                      borderColor: "rgba(0, 229, 153, 0.3)",
                      bgcolor: "rgba(0, 229, 153, 0.05)",
                      "&:hover": { borderColor: "#00E599", bgcolor: "rgba(0, 229, 153, 0.15)" },
                    }}
                  >
                    Order from Manufacturer ({shortage} pcs shortage)
                  </Button>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Card>

      {/* ========================================================================= */}
      {/* INCOMING SHOP ORDERS PIPELINE TABLE */}
      {/* ========================================================================= */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
        <Typography variant="h6" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
          Retailer Orders Pipeline & Delivery Status
        </Typography>
        <Typography variant="caption" color="#94A3B8">
          Showing {filteredOrders.length} incoming orders across {currentBranch.name}
        </Typography>
      </Box>

      {/* Search Filter */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", mb: 2.5, bgcolor: "#0D131F" }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by retailer showroom, order ID, gadget line, status, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#00E599", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#070A0E",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&:hover fieldset": { borderColor: "rgba(0, 229, 153, 0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#00E599" },
              },
            }}
          />
        </Box>
      </Card>

      {/* Orders Table */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#090E18" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, py: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Retailer Shop</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Wholesale Hub</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Gadget Line & Variant</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Ordered Qty</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Warehouse Stock</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Stock & Delivery Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Order Amount</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((ord, i) => {
                const isDelivered = ord.status.includes("Sufficient") || ord.status.includes("Delivered");
                const isCBR = String(ord.branch || "Coimbatore").toLowerCase().includes("coimbatore");
                return (
                  <TableRow key={ord._id || i} hover sx={{ "& td": { py: 1.6, borderBottom: "1px solid rgba(255, 255, 255, 0.05)" } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={800} color="#00E599">
                        {ord.orderNo || `ORD-${(ord._id || "500").slice(-6).toUpperCase()}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800, border: "1px solid rgba(0, 229, 153, 0.3)" }}>
                          {(ord.shopName || "S")[0]}
                        </Avatar>
                        <Typography variant="body2" fontWeight={700} color="#FFFFFF">
                          {ord.shopName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
                        label={ord.branch || "Coimbatore"}
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
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#FFFFFF">{ord.productName}</Typography>
                        <Typography variant="caption" color="#94A3B8">{ord.type} · {ord.unit}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={800} color="#FFFFFF">
                        {ord.requestedQty} pcs
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${ord.availableStock} in warehouse`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: 10.5,
                          bgcolor: isDelivered ? "rgba(0, 229, 153, 0.12)" : "rgba(239, 68, 68, 0.15)",
                          color: isDelivered ? "#00E599" : "#EF4444",
                          border: isDelivered ? "1px solid rgba(0, 229, 153, 0.3)" : "1px solid rgba(239, 68, 68, 0.4)",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          icon={isDelivered ? <CheckCircle sx={{ fontSize: "13px !important", color: "#00E599 !important" }} /> : <Factory sx={{ fontSize: "13px !important", color: "#EF4444 !important" }} />}
                          label={isDelivered ? "Stock Available · Dispatched" : "Shortage · Factory PO Placed"}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: 10.5,
                            bgcolor: isDelivered ? "rgba(0, 229, 153, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: isDelivered ? "#00E599" : "#EF4444",
                            border: isDelivered ? "1px solid rgba(0, 229, 153, 0.35)" : "1px solid rgba(239, 68, 68, 0.4)",
                            mb: 0.4,
                          }}
                        />
                        <Typography variant="caption" color="#94A3B8" display="block">
                          {ord.fulfillmentStatus}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={800} color="#00E599">
                        ₹{Number(ord.amount || 0).toLocaleString("en-IN")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {isDelivered ? (
                        <Chip
                          label="Delivered"
                          size="small"
                          sx={{ bgcolor: "rgba(0, 229, 153, 0.1)", color: "#00E599", fontWeight: 800, fontSize: 10 }}
                        />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<LocalShipping sx={{ fontSize: 14 }} />}
                          onClick={() => handleFulfillOrder(ord._id)}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontSize: 11,
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
                            color: "#04130C",
                            py: 0.4,
                            px: 1.2,
                          }}
                        >
                          Receive PO & Deliver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="#94A3B8">No shop orders found for {currentBranch.name}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", color: "#94A3B8" }}
        />
      </Card>

      {/* ========================================================================= */}
      {/* MODAL 1: RECEIVE INCOMING SHOP ORDER WITH REAL-TIME STOCK VERIFIER */}
      {/* ========================================================================= */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#0D131F",
            border: "1px solid rgba(0, 229, 153, 0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Receive New Shop Order & Verify Stock</span>
          <Chip
            label={orderBranch}
            size="small"
            sx={{ bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800 }}
          />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Ordering Retailer Shop"
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {mockCustomers.map((c) => (
                  <MenuItem key={c._id} value={c.name}>{c.name} ({c.city})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Fulfillment Warehouse Hub"
                value={orderBranch}
                onChange={(e) => setOrderBranch(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                <MenuItem value="Coimbatore">Coimbatore Hub (CBR-001)</MenuItem>
                <MenuItem value="Tirupur">Tirupur Hub (TPR-001)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                select
                label="Electronic Gadget Line"
                value={selectedProduct.name}
                onChange={(e) => handleProductChange(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {productsList.map((p) => (
                  <MenuItem key={p._id} value={p.name}>
                    {p.name} (Stock: {p.stock})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                select
                label="Gadget Specification / Type"
                value={selectedVariant.typeName}
                onChange={(e) => handleVariantChange(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {selectedProduct.variants.map((v) => (
                  <MenuItem key={v.typeName} value={v.typeName}>{v.typeName}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                select
                label="Wholesale Packaging Unit"
                value={selectedUnit.unitName}
                onChange={(e) => handleUnitChange(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {selectedVariant.units.map((u) => (
                  <MenuItem key={u.unitName} value={u.unitName}>{u.unitName} - ₹{u.price}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Order Quantity (Units / Pieces)"
                type="number"
                value={orderQty}
                onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 1.5, bgcolor: "#070A0E", border: "1px solid rgba(0, 229, 153, 0.3)", borderRadius: 2 }}>
                <Typography variant="caption" color="#94A3B8">Total Invoiced Amount</Typography>
                <Typography variant="h6" fontWeight={900} color="#00E599">₹{calculatedTotalAmount.toLocaleString("en-IN")}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: isStockAvailable ? "rgba(0, 229, 153, 0.08)" : "rgba(239, 68, 68, 0.08)",
                  border: isStockAvailable ? "1px solid rgba(0, 229, 153, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  {isStockAvailable ? (
                    <CheckCircle sx={{ color: "#00E599", fontSize: 24 }} />
                  ) : (
                    <WarningAmber sx={{ color: "#EF4444", fontSize: 24 }} />
                  )}
                  <Typography variant="subtitle1" fontWeight={900} color={isStockAvailable ? "#00E599" : "#EF4444"}>
                    {isStockAvailable
                      ? "✅ Stock Available in Warehouse!"
                      : `🚨 Insufficient Stock! Shortage: ${shortageQty} Units`}
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="#94A3B8">Live Warehouse Stock</Typography>
                    <Typography variant="body1" fontWeight={800} color="#FFFFFF">{availableStock} units</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="#94A3B8">Requested by Shop</Typography>
                    <Typography variant="body1" fontWeight={800} color="#FFFFFF">{orderQty} units</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="#94A3B8">Automated Action</Typography>
                    <Typography variant="body2" fontWeight={800} color={isStockAvailable ? "#00E599" : "#EF4444"}>
                      {isStockAvailable
                        ? "Instant Dispatch & Invoicing"
                        : "Trigger OEM Manufacturer PO"}
                    </Typography>
                  </Grid>
                </Grid>

                {!isStockAvailable && (
                  <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <Typography variant="caption" color="#FFA4A4">
                      🏭 An automatic Purchase Order for <strong>{Math.max(shortageQty * 2, 100)} units</strong> will be dispatched to the factory manufacturer to fulfill this order.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, color: "#94A3B8" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
            disabled={saving}
            sx={{
              borderRadius: 2,
              fontWeight: 800,
              background: isStockAvailable
                ? "linear-gradient(135deg, #00E599 0%, #059669 100%)"
                : "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
              color: isStockAvailable ? "#04130C" : "#FFFFFF",
              boxShadow: isStockAvailable
                ? "0 4px 16px rgba(0, 229, 153, 0.35)"
                : "0 4px 16px rgba(239, 68, 68, 0.35)",
            }}
          >
            {saving
              ? "Submitting..."
              : isStockAvailable
              ? "Fulfill & Deliver to Shop"
              : "Order from Manufacturer & Hold"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: DIRECT MANUFACTURER PROCUREMENT REORDER MODAL */}
      {/* ========================================================================= */}
      <Dialog
        open={mfrDialogOpen}
        onClose={() => setMfrDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#0D131F",
            border: "1px solid rgba(0, 229, 153, 0.4)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Factory sx={{ color: "#00E599" }} />
            <span>Order Necessary Units from Manufacturer</span>
          </Box>
          <Chip
            label={mfrDestinationBranch}
            size="small"
            sx={{ bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 800 }}
          />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            {/* Manufacturer & Receiving Hub */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="OEM Factory Manufacturer / Vendor"
                value={mfrSelectedSupplier}
                onChange={(e) => setMfrSelectedSupplier(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {mockSuppliers.map((s) => (
                  <MenuItem key={s._id} value={s.name}>{s.name} ({s.city})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Receiving Warehouse Hub"
                value={mfrDestinationBranch}
                onChange={(e) => setMfrDestinationBranch(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                <MenuItem value="Coimbatore">Coimbatore Hub (CBR-001)</MenuItem>
                <MenuItem value="Tirupur">Tirupur Hub (TPR-001)</MenuItem>
              </TextField>
            </Grid>

            {/* Product & Variant */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                select
                label="Depleted Gadget Line"
                value={mfrSelectedProduct.name}
                onChange={(e) => handleMfrProductChange(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {productsList.map((p) => (
                  <MenuItem key={p._id} value={p.name}>
                    {p.name} (In Stock: {p.stock})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                select
                label="Specification / Variant Type"
                value={mfrSelectedVariant.typeName}
                onChange={(e) => {
                  const v = mfrSelectedProduct.variants.find((item) => item.typeName === e.target.value) || mfrSelectedProduct.variants[0];
                  setMfrSelectedVariant(v);
                  setMfrSelectedUnit(v.units[0]);
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {mfrSelectedProduct.variants.map((v) => (
                  <MenuItem key={v.typeName} value={v.typeName}>{v.typeName}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                select
                label="Factory Packaging Unit"
                value={mfrSelectedUnit.unitName}
                onChange={(e) => {
                  const u = mfrSelectedVariant.units.find((item) => item.unitName === e.target.value) || mfrSelectedVariant.units[0];
                  setMfrSelectedUnit(u);
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                {mfrSelectedVariant.units.map((u) => (
                  <MenuItem key={u.unitName} value={u.unitName}>{u.unitName}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Order Quantity & Cost */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Units / Pieces to Reorder from Manufacturer"
                type="number"
                value={mfrOrderQty}
                onChange={(e) => setMfrOrderQty(Math.max(10, parseInt(e.target.value) || 10))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Factory Wholesale Cost Price Per Unit (₹)"
                type="number"
                value={mfrUnitCost}
                onChange={(e) => setMfrUnitCost(Math.max(1, parseInt(e.target.value) || 1))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              />
            </Grid>

            {/* Summary & Impact Banner */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: "rgba(0, 229, 153, 0.08)",
                  border: "1px solid rgba(0, 229, 153, 0.35)",
                }}
              >
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="#94A3B8">Current Warehouse Stock</Typography>
                    <Typography variant="body1" fontWeight={800} color="#FFFFFF">{mfrSelectedProduct.stock} units</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="#94A3B8">Restocked New Total</Typography>
                    <Typography variant="body1" fontWeight={800} color="#00E599">{Number(mfrSelectedProduct.stock) + Number(mfrOrderQty)} units</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="#94A3B8">Total Procurement PO Value</Typography>
                    <Typography variant="h6" fontWeight={900} color="#00E599">₹{(Number(mfrOrderQty) * Number(mfrUnitCost)).toLocaleString("en-IN")}</Typography>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="#94A3B8" sx={{ mt: 1.5, display: "block" }}>
                  🏭 Upon dispatch, this Purchase Order will immediately credit {mfrOrderQty} units into the {mfrDestinationBranch} Warehouse and automatically fulfill any pending shop orders waiting for this item!
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setMfrDialogOpen(false)} sx={{ borderRadius: 2, color: "#94A3B8" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleDispatchManufacturerPO}
            disabled={saving}
            sx={{
              borderRadius: 2,
              fontWeight: 800,
              background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
              color: "#04130C",
              boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
            }}
          >
            {saving ? "Dispatching..." : "Dispatch Manufacturer PO & Restock"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
