import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="luxe-footer">
      <div className="luxe-footer__inner">
        <div className="luxe-footer__brand">
          <h3>LUXE<span>STRIDE</span></h3>
          <p>Footwear built with restraint. Every pair, considered.</p>
        </div>

        <div className="luxe-footer__col">
          <h6>Shop</h6>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Sneakers">Sneakers</Link>
          <Link to="/products?category=Formal">Formal</Link>
          <Link to="/products?category=Boots">Boots</Link>
        </div>

        <div className="luxe-footer__col">
          <h6>Account</h6>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        <div className="luxe-footer__col">
          <h6>Contact</h6>
          <p>admin@luxestride.com</p>
          <p>+92 304 9742550</p>
        </div>
      </div>
      <div className="luxe-footer__bottom">
        <p>&copy; {new Date().getFullYear()} LuxeStride. All rights reserved.</p>
      </div>
    </footer>
  );
}
