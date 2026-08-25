import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment,
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Alert, Avatar, MenuItem, Tabs, Tab,
  Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
} from "@mui/material";
import {
  Search, Add, Edit, Delete, Visibility, Refresh, Storefront,
  LocationCity, WarningAmber, CheckCircle, KeyboardArrowDown,
  KeyboardArrowUp, ShoppingCart, LocalOffer, Reorder,
} from "@mui/icons-material";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";
import { createPurchaseOrder } from "../../api/purchaseOrders";
import { useBranch } from "../../context/BranchContext";

const EMPTY = { name: "", category: "Chargers", sku: "", brand: "BEST", price: 350, stock: 50, minStock: 25, branch: "Coimbatore", description: "" };

export default function Products() {
  const { selectedBranch, currentBranch, filterByBranch } = useBranch();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "restock"
  const [expandedId, setExpandedId] = useState(null);
  
  // Selected variant/unit state for interactive pricing
  // Map of productId -> { selectedTypeIndex, selectedUnitIndex }
  const [selectionMap, setSelectionMap] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [restockDialog, setRestockDialog] = useState(null); // Item to restock
  const [restockQty, setRestockQty] = useState(100);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setRows(res.data?.products || res.data || []);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const branchFiltered = filterByBranch(rows);

  const filtered = branchFiltered.filter((r) => {
    const isRestock = activeTab === "restock" ? (r.stock ?? 0) <= (r.minStock || 20) : true;
    const matchesSearch = [r.name, r.category, r.sku, r.brand, r.branch].some((f) =>
      (f || "").toLowerCase().includes(search.toLowerCase())
    );
    return isRestock && matchesSearch;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const restockCount = branchFiltered.filter((r) => (r.stock ?? 0) <= (r.minStock || 20)).length;
  const optimalCount = branchFiltered.filter((r) => (r.stock ?? 0) > (r.minStock || 20)).length;

  const handleToggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (!selectionMap[id]) {
      setSelectionMap((prev) => ({
        ...prev,
        [id]: { selectedTypeIndex: 0, selectedUnitIndex: 0 },
      }));
    }
  };

  const handleSelectType = (productId, typeIndex) => {
    setSelectionMap((prev) => ({
      ...prev,
      [productId]: { selectedTypeIndex: typeIndex, selectedUnitIndex: 0 },
    }));
  };

  const handleSelectUnit = (productId, unitIndex) => {
    setSelectionMap((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selectedUnitIndex: unitIndex,
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateProduct(editId, form);
      else await createProduct(form);
      setDialogOpen(false);
      load();
      setSuccess("Product saved successfully.");
    } catch {
      setError("Save operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
      load();
      setSuccess("Product deleted.");
    } catch {
      setError("Delete failed.");
    }
  };

  const triggerRestock = async () => {
    if (!restockDialog) return;
    setSaving(true);
    try {
      const branchCode = (restockDialog.branch || "Coimbatore") === "Tirupur" ? "TPR" : "CBR";
      const poNo = `PO-${branchCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      const costPrice = Math.round((restockDialog.price || 500) * 0.75);
      await createPurchaseOrder({
        purchaseOrderNo: poNo,
        supplier: { name: "VoltPro GaN Semiconductor Tech" },
        product: { name: restockDialog.name },
        quantity: Number(restockQty),
        purchasePrice: costPrice,
        totalAmount: Number(restockQty) * costPrice,
        branch: restockDialog.branch || "Coimbatore",
        status: "Ordered",
      });
      setRestockDialog(null);
      setSuccess(`Restock PO created: ${poNo} (${restockQty} units ordered)`);
    } catch {
      setError("Failed to create restock order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2, borderRadius: 2.5, bgcolor: "rgba(0, 229, 153, 0.1)", color: "#00E599", border: "1px solid rgba(0, 229, 153, 0.3)" }}>{success}</Alert>}

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} color="#FFFFFF" letterSpacing="-0.02em">
              Electronic Gadgets Catalog & Stock Health
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
            {branchFiltered.length} electronic products · Click any item to explore Types, Packaging Units & Dynamic Wholesale Amounts
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", "&:hover": { borderColor: "#00E599", color: "#00E599" } }}>
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setForm({ ...EMPTY, branch: selectedBranch === "tirupur" ? "Tirupur" : "Coimbatore" }); setEditId(null); setDialogOpen(true); }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
              color: "#04130C",
              boxShadow: "0 4px 16px rgba(0, 229, 153, 0.35)",
            }}
          >
            Add Gadget
          </Button>
        </Box>
      </Box>

      {/* Stock Health KPI Banners & Tabs */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => setActiveTab("all")}
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              border: activeTab === "all" ? "2px solid #00E599" : "1px solid rgba(255, 255, 255, 0.08)",
              bgcolor: activeTab === "all" ? "rgba(0, 229, 153, 0.08)" : "#0D131F",
              p: 2.5,
              transition: "all 0.2s ease",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" color="#94A3B8" fontWeight={800} sx={{ textTransform: "uppercase" }}>
                  All Electronic Lines
                </Typography>
                <Typography variant="h4" fontWeight={900} color="#FFFFFF" sx={{ mt: 0.5 }}>
                  {branchFiltered.length}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: "rgba(0, 229, 153, 0.15)", borderRadius: 2.5, p: 1.2, color: "#00E599" }}>
                <CheckCircle sx={{ fontSize: 24 }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => setActiveTab("restock")}
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              border: activeTab === "restock" ? "2px solid #EF4444" : "1px solid rgba(239, 68, 68, 0.3)",
              bgcolor: activeTab === "restock" ? "rgba(239, 68, 68, 0.12)" : "#0D131F",
              p: 2.5,
              transition: "all 0.2s ease",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" color="#EF4444" fontWeight={800} sx={{ textTransform: "uppercase" }}>
                  🚨 Needs Restocking
                </Typography>
                <Typography variant="h4" fontWeight={900} color="#EF4444" sx={{ mt: 0.5 }}>
                  {restockCount} <span style={{ fontSize: 13, color: "#94A3B8" }}>Items Low</span>
                </Typography>
              </Box>
              <Box sx={{ bgcolor: "rgba(239, 68, 68, 0.18)", borderRadius: 2.5, p: 1.2, color: "#EF4444" }}>
                <WarningAmber sx={{ fontSize: 24 }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", bgcolor: "#0D131F", p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" color="#34D399" fontWeight={800} sx={{ textTransform: "uppercase" }}>
                  Optimal Stock Level
                </Typography>
                <Typography variant="h4" fontWeight={900} color="#34D399" sx={{ mt: 0.5 }}>
                  {optimalCount}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: "rgba(52, 211, 153, 0.15)", borderRadius: 2.5, p: 1.2, color: "#34D399" }}>
                <LocalOffer sx={{ fontSize: 24 }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Tabs Filter Bar */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", mb: 2.5, bgcolor: "#0D131F" }}>
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search by simple gadget name, category, SKU, brand..."
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
              flexGrow: 1,
              maxWidth: { xs: "100%", sm: 400 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#070A0E",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&:hover fieldset": { borderColor: "rgba(0, 229, 153, 0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#00E599" },
              },
            }}
          />

          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 800,
                fontSize: 13,
                color: "#94A3B8",
                "&.Mui-selected": { color: "#00E599" },
              },
              "& .MuiTabs-indicator": { bgcolor: "#00E599", height: 3 },
            }}
          >
            <Tab label={`All Products (${branchFiltered.length})`} value="all" />
            <Tab label={`🚨 Restock Required (${restockCount})`} value="restock" />
          </Tabs>
        </Box>
      </Card>

      {/* Main Interactive Table with Dropdowns */}
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.7)", bgcolor: "#0D131F", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#090E18" }}>
                <TableCell sx={{ width: 40, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }} />
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, py: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  Gadget Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  Wholesale Hub
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  Stock Quantity
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  Base Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  Restock Status
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 11.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  Quick Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((prod) => {
                const isExpanded = expandedId === prod._id;
                const qty = prod.stock ?? 0;
                const minStock = prod.minStock || 20;
                const needsRestock = qty <= minStock;
                const isCBR = (prod.branch || "Coimbatore").toLowerCase().includes("coimbatore");

                // Get selected type and unit for this product
                const currentSelection = selectionMap[prod._id] || { selectedTypeIndex: 0, selectedUnitIndex: 0 };
                const variants = prod.variants || [
                  {
                    typeName: "Standard Unit",
                    units: [
                      { unitName: "Single Piece (1 Pc)", qty: 1, price: prod.price },
                      { unitName: "Wholesale Box (10 Pcs)", qty: 10, price: Math.round(prod.price * 9.5) },
                      { unitName: "Master Carton (50 Pcs)", qty: 50, price: Math.round(prod.price * 45) },
                    ],
                  },
                ];
                const activeType = variants[currentSelection.selectedTypeIndex] || variants[0];
                const activeUnit = activeType?.units?.[currentSelection.selectedUnitIndex] || activeType?.units?.[0];

                return (
                  <>
                    {/* Master Product Row */}
                    <TableRow
                      key={prod._id}
                      hover
                      sx={{
                        cursor: "pointer",
                        bgcolor: isExpanded ? "rgba(0, 229, 153, 0.04)" : "transparent",
                        "& td": { py: 1.4, borderBottom: isExpanded ? "none" : "1px solid rgba(255, 255, 255, 0.05)" },
                      }}
                      onClick={() => handleToggleExpand(prod._id)}
                    >
                      <TableCell sx={{ pl: 2, pr: 0 }}>
                        <IconButton
                          size="small"
                          sx={{
                            color: isExpanded ? "#00E599" : "#94A3B8",
                            bgcolor: isExpanded ? "rgba(0, 229, 153, 0.15)" : "rgba(255, 255, 255, 0.04)",
                          }}
                        >
                          {isExpanded ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                        </IconButton>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: "rgba(0, 229, 153, 0.15)", color: "#00E599", fontWeight: 900, border: "1px solid rgba(0, 229, 153, 0.3)" }}>
                            {(prod.name || "G")[0]}
                          </Avatar>
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body2" fontWeight={800} color="#FFFFFF">
                                {prod.name}
                              </Typography>
                              <Chip
                                label="Click for Types & Units ▼"
                                size="small"
                                sx={{
                                  fontSize: 9.5,
                                  height: 18,
                                  bgcolor: "rgba(0, 229, 153, 0.1)",
                                  color: "#00E599",
                                  border: "1px solid rgba(0, 229, 153, 0.25)",
                                  fontWeight: 800,
                                }}
                              />
                            </Box>
                            <Typography variant="caption" color="#94A3B8">
                              {prod.sku || "SKU-N/A"} · {prod.brand || "BEST"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={prod.category || "Gadgets"}
                          size="small"
                          sx={{ bgcolor: "rgba(255, 255, 255, 0.06)", color: "#FFFFFF", fontWeight: 700, fontSize: 11, border: "1px solid rgba(255, 255, 255, 0.1)" }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={isCBR ? <Storefront sx={{ fontSize: "14px !important", color: "#34D399 !important" }} /> : <LocationCity sx={{ fontSize: "14px !important", color: "#00F59B !important" }} />}
                          label={prod.branch || "Coimbatore"}
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

                      <TableCell align="center">
                        <Chip
                          label={`${qty} units`}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            fontSize: 11,
                            bgcolor: needsRestock ? "rgba(239, 68, 68, 0.18)" : "rgba(0, 229, 153, 0.12)",
                            color: needsRestock ? "#EF4444" : "#00E599",
                            border: needsRestock ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(0, 229, 153, 0.25)",
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={900} color="#00E599">
                          ₹{Number(prod.price || 0).toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {needsRestock ? (
                          <Chip
                            icon={<WarningAmber sx={{ fontSize: "14px !important", color: "#EF4444 !important" }} />}
                            label="Restock Required"
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: 10.5,
                              bgcolor: "rgba(239, 68, 68, 0.15)",
                              color: "#EF4444",
                              border: "1px solid rgba(239, 68, 68, 0.35)",
                            }}
                          />
                        ) : (
                          <Chip
                            icon={<CheckCircle sx={{ fontSize: "14px !important", color: "#00E599 !important" }} />}
                            label="Optimal Stock"
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: 10.5,
                              bgcolor: "rgba(0, 229, 153, 0.12)",
                              color: "#00E599",
                              border: "1px solid rgba(0, 229, 153, 0.25)",
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          {needsRestock && (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<Reorder />}
                              onClick={() => { setRestockDialog(prod); setRestockQty(100); }}
                              sx={{
                                py: 0.3,
                                px: 1.2,
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: "none",
                                bgcolor: "#EF4444",
                                color: "#FFFFFF",
                                "&:hover": { bgcolor: "#DC2626" },
                              }}
                            >
                              Restock
                            </Button>
                          )}
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => setViewItem(prod)} sx={{ color: "#94A3B8", "&:hover": { color: "#FFFFFF" } }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Product">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setForm({
                                  name: prod.name || "",
                                  category: prod.category || "Chargers",
                                  sku: prod.sku || "",
                                  brand: prod.brand || "BEST",
                                  price: prod.price || "",
                                  stock: prod.stock || "",
                                  minStock: prod.minStock || 25,
                                  branch: prod.branch || "Coimbatore",
                                  description: prod.description || "",
                                });
                                setEditId(prod._id);
                                setDialogOpen(true);
                              }}
                              sx={{ color: "#00E599", "&:hover": { bgcolor: "rgba(0, 229, 153, 0.1)" } }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteId(prod._id)} sx={{ color: "#EF4444", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Dropdown Drawer for Types, Units & Dynamic Price */}
                    <TableRow sx={{ bgcolor: "rgba(7, 10, 14, 0.6)" }}>
                      <TableCell colSpan={8} sx={{ py: 0, px: 3, borderBottom: isExpanded ? "1px solid rgba(0, 229, 153, 0.3)" : "none" }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2.5, px: 2, my: 1, borderRadius: 2.5, bgcolor: "#070A0E", border: "1px solid rgba(0, 229, 153, 0.25)", boxShadow: "0 8px 25px rgba(0,0,0,0.6)" }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight={900} color="#00E599">
                                  ⚡ {prod.name} · Types & Unit Pricing Breakdown
                                </Typography>
                                <Chip
                                  label={`Current Stock: ${qty} units`}
                                  size="small"
                                  sx={{
                                    bgcolor: needsRestock ? "rgba(239, 68, 68, 0.15)" : "rgba(0, 229, 153, 0.12)",
                                    color: needsRestock ? "#EF4444" : "#00E599",
                                    fontWeight: 800,
                                    fontSize: 10.5,
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" color="#94A3B8">
                                Select a variant type and packaging unit below to view that particular product unit amount:
                              </Typography>
                            </Box>

                            {/* Type / Variant Buttons */}
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" fontWeight={800} color="#94A3B8" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                                Step 1: Select Type / Specification
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {variants.map((v, typeIdx) => {
                                  const isSelectedType = currentSelection.selectedTypeIndex === typeIdx;
                                  return (
                                    <Button
                                      key={v.typeName}
                                      variant={isSelectedType ? "contained" : "outlined"}
                                      onClick={() => handleSelectType(prod._id, typeIdx)}
                                      size="small"
                                      sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 800,
                                        fontSize: 12,
                                        bgcolor: isSelectedType ? "#00E599" : "rgba(255, 255, 255, 0.04)",
                                        color: isSelectedType ? "#04130C" : "#E2E8F0",
                                        borderColor: isSelectedType ? "#00E599" : "rgba(255, 255, 255, 0.15)",
                                        "&:hover": {
                                          bgcolor: isSelectedType ? "#00F59B" : "rgba(0, 229, 153, 0.1)",
                                          borderColor: "#00E599",
                                        },
                                      }}
                                    >
                                      {v.typeName}
                                    </Button>
                                  );
                                })}
                              </Box>
                            </Box>

                            {/* Packaging Units & Dynamic Amount Display */}
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" fontWeight={800} color="#94A3B8" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                                Step 2: Select Packaging Unit & View Particular Amount
                              </Typography>
                              <Grid container spacing={2}>
                                {activeType?.units?.map((u, unitIdx) => {
                                  const isSelectedUnit = currentSelection.selectedUnitIndex === unitIdx;
                                  return (
                                    <Grid item xs={12} sm={4} key={u.unitName}>
                                      <Card
                                        onClick={() => handleSelectUnit(prod._id, unitIdx)}
                                        sx={{
                                          cursor: "pointer",
                                          p: 2,
                                          borderRadius: 2.5,
                                          border: isSelectedUnit ? "2px solid #00E599" : "1px solid rgba(255, 255, 255, 0.1)",
                                          bgcolor: isSelectedUnit ? "rgba(0, 229, 153, 0.12)" : "#0D131F",
                                          boxShadow: isSelectedUnit ? "0 0 15px rgba(0, 229, 153, 0.25)" : "none",
                                          transition: "all 0.15s ease",
                                          "&:hover": { borderColor: "#00E599", bgcolor: "rgba(0, 229, 153, 0.08)" },
                                        }}
                                      >
                                        <Typography variant="caption" color={isSelectedUnit ? "#00E599" : "#94A3B8"} fontWeight={800} sx={{ textTransform: "uppercase" }}>
                                          {u.unitName}
                                        </Typography>
                                        <Typography variant="h6" fontWeight={900} color="#FFFFFF" sx={{ mt: 0.5 }}>
                                          ₹{Number(u.price).toLocaleString("en-IN")}
                                        </Typography>
                                        <Typography variant="caption" color="#94A3B8" sx={{ display: "block", mt: 0.3 }}>
                                          ₹{Math.round(u.price / (u.qty || 1)).toLocaleString("en-IN")} / piece
                                        </Typography>
                                      </Card>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </Box>

                            {/* Active Particular Amount Summary Box */}
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
                                <Typography variant="body2" fontWeight={800} color="#FFFFFF">
                                  Selected: <span style={{ color: "#00E599" }}>{prod.name} ({activeType?.typeName})</span> — {activeUnit?.unitName}
                                </Typography>
                                <Typography variant="caption" color="#94A3B8">
                                  Includes wholesale B2B GST tax credit · Immediate stock dispatch from {prod.branch || "Coimbatore"} Hub
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ textAlign: "right" }}>
                                  <Typography variant="caption" color="#94A3B8" fontWeight={700}>
                                    Particular Amount:
                                  </Typography>
                                  <Typography variant="h5" fontWeight={900} color="#00E599">
                                    ₹{Number(activeUnit?.price || 0).toLocaleString("en-IN")}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="contained"
                                  startIcon={<ShoppingCart />}
                                  onClick={() => { setRestockDialog(prod); setRestockQty(activeUnit?.qty || 50); }}
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 800,
                                    background: "linear-gradient(135deg, #00E599 0%, #059669 100%)",
                                    color: "#04130C",
                                  }}
                                >
                                  Restock / Order This Unit
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
              {paginated.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="#94A3B8">No electronic products found matching criteria</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", color: "#94A3B8" }}
        />
      </Card>

      {/* Restock 1-Click Dialog */}
      <Dialog open={Boolean(restockDialog)} onClose={() => setRestockDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.3)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>🚨 Create Restock PO</DialogTitle>
        <DialogContent>
          {restockDialog && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="#FFFFFF" fontWeight={700} mb={1}>
                Product: <span style={{ color: "#00E599" }}>{restockDialog.name}</span>
              </Typography>
              <Typography variant="caption" color="#94A3B8" display="block" mb={2}>
                Current Stock: {restockDialog.stock} units · Receiving Hub: {restockDialog.branch || "Coimbatore"}
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Units to Restock (Cartons / Quantity)"
                type="number"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setRestockDialog(null)} sx={{ color: "#94A3B8" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={triggerRestock}
            disabled={saving}
            sx={{ borderRadius: 2, fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}
          >
            {saving ? "Placing Order..." : "Confirm Restock Order"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>{editId ? "Edit Gadget" : "Add New Wholesale Gadget"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["name","Gadget Simple Name (e.g. Power Bank, Earbuds)"],["category","Category"],["sku","SKU Code"],["brand","Brand"],["price","Base Wholesale Price (₹)"],["stock","Current Stock Quantity"],["minStock","Restock Threshold"]].map(([field, label]) => (
              <Grid item xs={12} sm={field === "name" ? 12 : 6} key={field}>
                <TextField
                  fullWidth
                  size="small"
                  label={label}
                  type={field === "price" || field === "stock" || field === "minStock" ? "number" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Wholesale Branch Hub"
                value={form.branch}
                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              >
                <MenuItem value="Coimbatore">Coimbatore Hub (CBR-001)</MenuItem>
                <MenuItem value="Tirupur">Tirupur Hub (TPR-001)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Product Specifications"
                multiline
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#070A0E" } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
            sx={{ borderRadius: 2, fontWeight: 800, background: "linear-gradient(135deg, #00E599 0%, #059669 100%)", color: "#04130C" }}
          >
            {saving ? "Saving..." : editId ? "Update Gadget" : "Save to Inventory"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(0, 229, 153, 0.2)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Gadget Specifications</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {[["Gadget Name", viewItem.name], ["Category", viewItem.category], ["SKU", viewItem.sku], ["Brand", viewItem.brand], ["Wholesale Hub", viewItem.branch || "Coimbatore"], ["Base Price", `₹${Number(viewItem.price || 0).toLocaleString("en-IN")}`], ["Stock", `${viewItem.stock} units`], ["Restock Alert Level", `${viewItem.minStock || 25} units`], ["Specs", viewItem.description]].map(([k, v]) => (
                <Grid item xs={12} key={k}>
                  <Typography variant="caption" color="#00E599" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: 10.5 }}>{k}</Typography>
                  <Typography variant="body2" fontWeight={600} color="#FFFFFF">{v || "—"}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, fontWeight: 800, background: "#00E599", color: "#04130C" }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: "#0D131F", border: "1px solid rgba(239, 68, 68, 0.3)" } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#FFFFFF" }}>Delete Gadget</DialogTitle>
        <DialogContent><Typography color="#94A3B8">Are you sure you want to remove this item from the catalog?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, color: "#94A3B8" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, fontWeight: 800 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
