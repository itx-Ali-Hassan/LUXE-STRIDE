import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../api/userService.js";
import Loader from "../../components/Loader.jsx";
import "./Dashboard.scss";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setData);
  }, []);

  if (!data) return <Loader label="Loading dashboard" />;

  const { stats, recentOrders, recentUsers } = data;

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Customers", value: stats.totalCustomers },
    { label: "Admins", value: stats.totalAdmins },
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="font-display">Dashboard</h1>

      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card glass-panel" key={c.label}>
            <p className="stat-card__label">{c.label}</p>
            <p className="stat-card__value">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-dashboard__cols">
        <div className="glass-panel admin-panel">
          <div className="admin-panel__head">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="admin-panel__empty">No orders yet.</p>
          ) : (
            <table>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.user?.name || "—"}</td>
                    <td>${o.totalAmount.toFixed(2)}</td>
                    <td>{o.status}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="glass-panel admin-panel">
          <div className="admin-panel__head">
            <h3>Recent Users</h3>
            <Link to="/admin/users">View all</Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="admin-panel__empty">No users yet.</p>
          ) : (
            <table>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
