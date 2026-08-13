import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Products.scss";

export default function Wishlist() {
  const { products } = useWishlist();
  const scopeRef = useScrollReveal([products]);

  return (
    <div className="products-page" ref={scopeRef}>
      <div className="products-hero">
        <span className="eyebrow">Saved For Later</span>
        <h1 className="font-display">Your Wishlist</h1>
        <p>{products.length} item{products.length !== 1 ? "s" : ""} saved</p>
      </div>

      {products.length === 0 ? (
        <div className="products-empty">
          <p>Nothing saved yet.</p>
          <Link to="/products" className="btn-luxe">Browse the Collection</Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
