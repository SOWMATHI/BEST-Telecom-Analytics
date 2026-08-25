import {
  Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, Box, Skeleton,
} from "@mui/material";

const statusColor = { completed: "success", pending: "warning", cancelled: "error", refunded: "default" };

export default function RecentSales({ data, loading }) {
  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}>
      <CardContent sx={{ p: 3, pb: "12px !important" }}>
        <Typography variant="h6" fontWeight={700} color="#0F172A" mb={2}>Recent Sales</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, color: "#64748B", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "2px solid #F1F5F9", pb: 1.5 } }}>
                <TableCell>Customer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton height={28} /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (data || []).slice(0, 8).map((sale, i) => (
                <TableRow key={sale._id || i} hover sx={{ "& td": { borderBottom: "1px solid #F8FAFC", py: 1.5 } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: "#1976D2" }}>
                        {(sale.customerName || sale.customer || "C")[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>
                        {sale.customerName || sale.customer || "—"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 130 }}>
                      {sale.productName || sale.product || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700} color="#0F172A">
                      ₹{Number(sale.totalAmount || sale.amount || 0).toLocaleString("en-IN")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {sale.paymentMethod || "Cash"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sale.status || "completed"}
                      size="small"
                      color={statusColor[sale.status] || "success"}
                      sx={{ fontWeight: 600, fontSize: 11, textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString("en-IN") : "—"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
