import api from "./axios";
import { mockShopOrders, mockProducts, mockPurchaseOrders } from "./mockData";

let localShopOrders = [...mockShopOrders];

export const getShopOrders = async () => {
  try {
    const res = await api.get("/shop-orders");
    const list = Array.isArray(res.data?.orders) ? res.data.orders : Array.isArray(res.data) ? res.data : [];
    if (list.length > 0) return { data: { orders: list } };
    return { data: { orders: localShopOrders } };
  } catch (err) {
    return { data: { orders: localShopOrders } };
  }
};

export const placeShopOrder = async (orderData) => {
  // Check live warehouse inventory for the requested product
  const product = mockProducts.find(
    (p) => p.name === orderData.productName || p._id === orderData.productId
  );

  const availableStock = product ? product.stock : 10;
  const requestedQty = Number(orderData.requestedQty || 1);
  const isSufficient = availableStock >= requestedQty;

  const branchCode = orderData.branch === "Tirupur" ? "TPR" : "CBR";
  const orderNo = `ORD-${branchCode}-${Math.floor(500 + Math.random() * 500)}`;

  let mfrPoNo = null;
  if (!isSufficient) {
    // Generate auto manufacturer PO
    mfrPoNo = `PO-${branchCode}-${Math.floor(8500 + Math.random() * 1000)}`;
    const newMfrPO = {
      _id: `PO-${Date.now().toString().slice(-4)}`,
      purchaseOrderNo: mfrPoNo,
      supplier: { name: "VoltPro GaN / OEM Factory" },
      product: { name: orderData.productName },
      quantity: Math.max(requestedQty * 2, 100),
      purchasePrice: Math.round(Number(orderData.amount || 1000) * 0.7 / requestedQty),
      totalAmount: Math.round(Number(orderData.amount || 1000) * 0.7 * 2),
      branch: orderData.branch,
      status: "Ordered",
      createdAt: new Date().toISOString(),
    };
    mockPurchaseOrders.unshift(newMfrPO);
  } else {
    // Deduct stock
    if (product) {
      product.stock -= requestedQty;
    }
  }

  const newOrder = {
    _id: `ORD-${Date.now().toString().slice(-4)}`,
    orderNo,
    shopName: orderData.shopName,
    productName: orderData.productName,
    productCode: product?.sku || "SKU-01",
    type: orderData.type || "Standard Variant",
    unit: orderData.unit || "Carton Pack",
    requestedQty,
    availableStock,
    status: isSufficient ? "Sufficient Stock - Delivered" : "Shortage - Manufacturer Order Needed",
    fulfillmentStatus: isSufficient ? "Delivered & Invoiced" : `Auto PO Sent to Factory (${mfrPoNo})`,
    branch: orderData.branch || "Coimbatore",
    amount: Number(orderData.amount || 1000),
    mfrPoNo,
    createdAt: new Date().toISOString(),
  };

  localShopOrders.unshift(newOrder);
  return { data: newOrder };
};

export const deliverShopOrder = async (orderId) => {
  const ord = localShopOrders.find((o) => o._id === orderId);
  if (ord) {
    ord.status = "Sufficient Stock - Delivered";
    ord.fulfillmentStatus = "Delivered & Invoiced";
  }
  return { data: ord };
};
