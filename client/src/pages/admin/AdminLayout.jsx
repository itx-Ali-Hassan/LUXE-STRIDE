import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiBox, FiUsers, FiShoppingBag } from "react-icons/fi";
import "./AdminLayout.scss";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="admin-sidebar__title">Admin</p>
        <nav>
          <NavLink to="/admin" end><FiGrid /> Dashboard</NavLink>
          <NavLink to="/admin/products"><FiBox /> Products</NavLink>
          <NavLink to="/admin/orders"><FiShoppingBag /> Orders</NavLink>
          <NavLink to="/admin/users"><FiUsers /> Users</NavLink>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
