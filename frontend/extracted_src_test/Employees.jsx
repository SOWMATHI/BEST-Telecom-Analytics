import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Typography, Button, TextField, InputAdornment,
  Avatar, Chip, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Alert, LinearProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Add, Edit, Delete, Visibility, FileDownload, Refresh, EmojiEvents } from "@mui/icons-material";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../api/employees";

const EMPTY = { name: "", email: "", phone: "", department: "", role: "", salary: "", target: "" };

const deptColor = { Sales: "#1976D2", Support: "#7C3AED", Management: "#EA580C", Technical: "#16A34A", Finance: "#0891B2" };

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setRows((res.data?.employees || res.data || []).map((e, i) => ({ ...e, id: e._id || i })));
    } catch { setError("Failed to load employees."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    [r.name, r.email, r.department, r.role].some((f) => (f || "").toLowerCase().includes(search.toLowerCase()))
  );

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateEmployee(editId, form);
      else await createEmployee(form);
      setDialogOpen(false); load();
    } catch { setError("Save failed."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await deleteEmployee(deleteId); setDeleteId(null); load(); }
    catch { setError("Delete failed."); }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Department", "Role", "Salary", "Monthly Sales", "Target"];
    const csvRows = [headers, ...filtered.map((r) => [r.name, r.email, r.phone, r.department, r.role, r.salary || 0, r.monthlySales || 0, r.target || 0])];
    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "employees.csv"; a.click();
  };

  const columns = [
    {
      field: "name", headerName: "Employee", flex: 1.5, minWidth: 180,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: deptColor[row.department] || "#64748B", fontWeight: 700 }}>
            {(row.name || "E")[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{row.role}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "department", headerName: "Department", flex: 1, minWidth: 130,
      renderCell: ({ value }) => (
        <Chip label={value || "—"} size="small" sx={{ bgcolor: `${deptColor[value] || "#64748B"}15`, color: deptColor[value] || "#64748B", fontWeight: 700 }} />
      ),
    },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    {
      field: "salary", headerName: "Salary", flex: 0.9, minWidth: 110,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={700} color="#0F172A">₹{Number(value || 0).toLocaleString("en-IN")}</Typography>
      ),
    },
    {
      field: "monthlySales", headerName: "Sales This Month", flex: 1, minWidth: 150,
      renderCell: ({ row }) => {
        const sales = row.monthlySales || 0;
        const target = row.target || 1;
        const pct = Math.min((sales / target) * 100, 100);
        return (
          <Box sx={{ width: "100%", pr: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
              <Typography variant="caption" fontWeight={600}>₹{Number(sales).toLocaleString("en-IN")}</Typography>
              <Typography variant="caption" color="text.secondary">{pct.toFixed(0)}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={pct} sx={{ height: 5, borderRadius: 3, bgcolor: "#F1F5F9", "& .MuiLinearProgress-bar": { bgcolor: pct >= 80 ? "#16A34A" : pct >= 50 ? "#D97706" : "#DC2626", borderRadius: 3 } }} />
          </Box>
        );
      },
    },
    {
      field: "rank", headerName: "Rank", flex: 0.6, minWidth: 80,
      renderCell: ({ row }) => {
        const rank = rows.filter((r) => (r.monthlySales || 0) > (row.monthlySales || 0)).length + 1;
        return rank <= 3 ? <EmojiEvents sx={{ color: rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : "#EA580C", fontSize: 20 }} /> : <Typography variant="body2" color="text.secondary">#{rank}</Typography>;
      },
    },
    {
      field: "actions", headerName: "Actions", flex: 0.8, minWidth: 120, sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View"><IconButton size="small" onClick={() => setViewItem(row)} sx={{ color: "#64748B" }}><Visibility fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => { setForm({ name: row.name || "", email: row.email || "", phone: row.phone || "", department: row.department || "", role: row.role || "", salary: row.salary || "", target: row.target || "" }); setEditId(row._id || row.id); setDialogOpen(true); }} sx={{ color: "#1976D2" }}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(row._id || row.id)} sx={{ color: "#DC2626" }}><Delete fontSize="small" /></IconButton></Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">Employees</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} employees</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<FileDownload />} onClick={exportCSV} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Export CSV</Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={load} sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(EMPTY); setEditId(null); setDialogOpen(true); }}
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#059669,#047857)", boxShadow: "0 4px 12px rgba(5,150,105,0.35)" }}>
            Add Employee
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by name, email, department, role..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94A3B8" }} /></InputAdornment> }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#F8FAFC" } }} />
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <DataGrid rows={filtered} columns={columns} loading={loading} autoHeight pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} disableRowSelectionOnClick rowHeight={60}
          sx={{ border: "none", "& .MuiDataGrid-columnHeaders": { bgcolor: "#F8FAFC", fontWeight: 700, fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }, "& .MuiDataGrid-row:hover": { bgcolor: "#F8FAFC" }, "& .MuiDataGrid-cell": { borderColor: "#F1F5F9" } }} />
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{editId ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[["name","Full Name"],["email","Email"],["phone","Phone"],["department","Department"],["role","Role"]].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth size="small" label={label} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Salary (₹)" type="number" value={form.salary} onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Monthly Target (₹)" type="number" value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#059669,#047857)" }}>
            {saving ? "Saving..." : editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewItem)} onClose={() => setViewItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Employee Profile</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                <Avatar sx={{ width: 56, height: 56, fontSize: 22, bgcolor: deptColor[viewItem.department] || "#64748B", fontWeight: 700 }}>{(viewItem.name || "E")[0]}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{viewItem.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{viewItem.role} · {viewItem.department}</Typography>
                </Box>
              </Box>
              <Grid container spacing={1.5}>
                {[["Email", viewItem.email], ["Phone", viewItem.phone], ["Salary", `₹${Number(viewItem.salary || 0).toLocaleString("en-IN")}`], ["Monthly Target", `₹${Number(viewItem.target || 0).toLocaleString("en-IN")}`], ["Monthly Sales", `₹${Number(viewItem.monthlySales || 0).toLocaleString("en-IN")}`]].map(([k, v]) => (
                  <Grid item xs={12} key={k}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{k}</Typography>
                    <Typography variant="body2" fontWeight={600}>{v || "—"}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Employee</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this employee?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
