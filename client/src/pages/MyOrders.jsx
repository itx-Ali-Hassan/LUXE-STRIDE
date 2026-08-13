import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag } from "antd";
import { getMyOrders } from "../api/orderService.js";
import Loader from "../components/Loader.jsx";
import "./MyOrders.scss";

const STATUS_COLOR = {
  Pending: "gold",
  Processing: "blue",
  Shipped: "purple",
  Delivered: "green",
  Cancelled: "red",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your orders" />;

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2 className="font-display">No orders yet</h2>
        <p>Once you place an order, it'll show up here.</p>
        <Link to="/products" className="btn-luxe-solid">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="font-display">My Orders</h1>
      <p className="orders-page__count">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card glass-panel" key={order._id}>
            <div className="order-card__head">
              <div>
                <p className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="order-card__date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <Tag color={STATUS_COLOR[order.status] || "default"}>{order.status}</Tag>
            </div>

            <div className="order-card__items">
              {order.items.map((item, idx) => (
                <div className="order-card__item" key={idx}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="name">{item.name}</p>
                    <p className="meta">Size {item.size} &times; {item.quantity}</p>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-card__foot">
              <span>Total</span>
              <span className="order-card__total">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
