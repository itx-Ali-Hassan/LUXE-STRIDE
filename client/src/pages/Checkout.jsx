import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { FiMail, FiLock } from "react-icons/fi";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { placeOrder } from "../api/orderService.js";
import "./Checkout.scss";

// The assignment spec is specific here: clicking "Checkout" always opens
// this page. If the user isn't logged in, we don't redirect them anywhere —
// we just show a login box above a *disabled* checkout form. Once they log
// in, the login box disappears, the form unlocks, and the cart is untouched.

export default function Checkout() {
  const { isAuthenticated, user, login } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loggingIn, setLoggingIn] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    postalCode: "",
    notes: "",
  });
  const [placing, setPlacing] = useState(false);

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const loggedInUser = await login(loginForm);
      // fill in what we already know about the user, cart stays exactly as it was
      setForm((f) => ({ ...f, fullName: loggedInUser.name, email: loggedInUser.email }));
      message.success("Logged in — you can continue checking out");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      message.error("Your cart is empty");
      return;
    }
    setPlacing(true);
    try {
      await placeOrder({
        items: items.map((i) => ({ product: i.product, quantity: i.quantity, size: i.size, name: i.name })),
        shippingInfo: form,
      });
      clearCart();
      message.success("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      message.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2 className="font-display">Nothing to check out</h2>
        <p>Your cart is empty — add a few pairs first.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="font-display">Checkout</h1>

      <div className="checkout-grid">
        <div className="checkout-forms">
          {/* Login section — only shown to guests, disappears after login */}
          {!isAuthenticated && (
            <div className="checkout-login glass-panel">
              <h3>Log in to continue</h3>
              <p>Your cart is safe — sign in below and the form unlocks right here.</p>
              <form className="form-luxe" onSubmit={handleLoginSubmit}>
                <div className="input-icon">
                  <FiMail />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={loginForm.email}
                    onChange={handleLoginChange}
                  />
                </div>
                <div className="input-icon">
                  <FiLock />
                  <input
                    type={ showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    onFocus={() => {setIsFocused(true)}} 
                    onBlur={() => {setIsFocused(false)}}
                  />
                  {(isFocused) && (<span className="password-toggle" onMouseDown={(e) => {e.preventDefault() ; setShowPassword(!showPassword)}}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span> )}
                </div>
                <button className="btn-luxe-solid" disabled={loggingIn}>
                  {loggingIn ? "Signing in…" : "Login"}
                </button>
              </form>
            </div>
          )}

          {/* Checkout form — disabled until the user is authenticated */}
          <fieldset
            className={`checkout-fieldset glass-panel ${!isAuthenticated ? "is-disabled" : ""}`}
            disabled={!isAuthenticated}
          >
            <h3>Shipping Details</h3>
            <form className="form-luxe checkout-form" onSubmit={handlePlaceOrder}>
              <div className="checkout-form__row">
                <div>
                  <label>Full Name</label>
                  <input name="fullName" required value={form.fullName} onChange={handleFormChange} />
                </div>
                <div>
                  <label>Email</label>
                  <input name="email" type="email" required value={form.email} onChange={handleFormChange} />
                </div>
              </div>

              <div className="checkout-form__row">
                <div>
                  <label>Phone Number</label>
                  <input name="phone" required value={form.phone} onChange={handleFormChange} />
                </div>
                <div>
                  <label>City</label>
                  <input name="city" required value={form.city} onChange={handleFormChange} />
                </div>
              </div>

              <label>Shipping Address</label>
              <input name="address" required value={form.address} onChange={handleFormChange} />

              <div className="checkout-form__row">
                <div>
                  <label>Postal Code (optional)</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleFormChange} />
                </div>
                <div>
                  <label>Order Notes (optional)</label>
                  <input name="notes" value={form.notes} onChange={handleFormChange} />
                </div>
              </div>

              <button type="submit" className="btn-luxe-solid checkout-submit" disabled={!isAuthenticated || placing}>
                {placing ? "Placing Order…" : "Place Order"}
              </button>
            </form>
          </fieldset>
        </div>

        <div className="checkout-summary glass-panel">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div className="checkout-summary__item" key={`${item.product}-${item.size}`}>
              <img src={item.image} alt={item.name} />
              <div>
                <p className="name">{item.name}</p>
                <p className="meta">Size {item.size} &times; {item.quantity}</p>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-summary__total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
