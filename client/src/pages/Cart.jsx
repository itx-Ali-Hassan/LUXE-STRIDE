import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";
import "./Cart.scss";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2 className="font-display">Your cart is empty</h2>
        <p>Browse the collection and add something you love.</p>
        <Link to="/products" className="btn-luxe-solid">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="font-display">Shopping Cart</h1>
      <p className="cart-page__count">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>

      <div className="cart-page__grid">
        <div className="cart-list">
          {items.map((item) => (
            <div className="cart-item" key={`${item.product}-${item.size}`}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item__info">
                <h4>{item.name}</h4>
                <p>Size: {item.size}</p>
                <p className="cart-item__price">${item.price.toFixed(2)}</p>
              </div>

              <div className="qty-select">
                <button onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)}>+</button>
              </div>

              <p className="cart-item__subtotal">${(item.price * item.quantity).toFixed(2)}</p>

              <button className="cart-item__remove" onClick={() => removeFromCart(item.product, item.size)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary glass-panel">
          <h3>Order Summary</h3>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="cart-summary__row cart-summary__total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button className="btn-luxe-solid cart-summary__cta" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
