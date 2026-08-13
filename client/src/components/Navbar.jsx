import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import "./Navbar.scss";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { products } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`luxe-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="luxe-nav__inner">
        <Link to="/" className="luxe-nav__brand" onClick={() => setOpen(false)}>
          LUXE<span>STRIDE</span>
        </Link>

        <div className={`luxe-nav__links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Collection</NavLink>
          {isAuthenticated && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>
          )}

          {/* mobile-only auth actions */}
          <div className="luxe-nav__mobile-auth">
            {isAuthenticated ? (
              <button className="btn-luxe" onClick={handleLogout}>Logout</button>
            ) : (
              <Link className="btn-luxe" to="/login" onClick={() => setOpen(false)}>Login</Link>
            )}
          </div>
        </div>

        <div className="luxe-nav__actions">
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <FiHeart />
            {products.length > 0 && <span className="badge">{products.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <FiShoppingBag />
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="luxe-nav__user">
              <FiUser />
              <span>{user?.name?.split(" ")[0]}</span>
              <div className="luxe-nav__dropdown">
                {isAdmin && <Link to="/admin">Dashboard</Link>}
                <Link to="/my-orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-luxe luxe-nav__login">Login</Link>
          )}

          <button className="luxe-nav__toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
