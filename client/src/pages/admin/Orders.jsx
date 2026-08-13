import React, { useEffect, useState } from "react";
import { Select, message } from "antd";
import { getAllOrders, updateOrderStatus } from "../../api/orderService.js";
import Loader from "../../components/Loader.jsx";
import "./Products.scss";
import "./Orders.scss";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    getAllOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      message.success("Order status updated");
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      message.error(err.response?.data?.message || "Could not update order");
    }
  };

  if (loading) return <Loader label="Loading orders" />;

  return (
    <div className="admin-orders">
      <h1 className="font-display">Orders</h1>
      <p className="admin-orders__count">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

      <div className="admin-table-wrap glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}</td>
                <td>
                  {o.user?.name}
                  <div className="admin-orders__email">{o.user?.email}</div>
                </td>
                <td>{o.itemsCount}</td>
                <td>${o.totalAmount.toFixed(2)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <Select
                    value={o.status}
                    size="small"
                    style={{ width: 130 }}
                    options={STATUSES.map((s) => ({ value: s, label: s }))}
                    onChange={(v) => handleStatusChange(o._id, v)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="admin-panel__empty">No orders yet.</p>}
      </div>
    </div>
  );
}
