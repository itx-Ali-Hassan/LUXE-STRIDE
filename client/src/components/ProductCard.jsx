import React from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { message } from "antd";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import "./ProductCard.scss";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    message.success(`${product.name} added to cart`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    const res = await toggle(product._id);
    if (res.requiresAuth) {
      message.info("Please login to save items to your wishlist");
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card reveal">
      <div className="product-card__image-wrap">
        <img src={product.image.url} alt={product.name} loading="lazy" />
        <button
          className={`product-card__fav ${liked ? "is-liked" : ""}`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <FiHeart />
        </button>
        {product.stock === 0 && <span className="product-card__soldout">Sold Out</span>}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h4 className="product-card__name">{product.name}</h4>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__bottom">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          <button
            className="btn-luxe product-card__add"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
