import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { message } from "antd";
import { FiHeart, FiChevronLeft } from "react-icons/fi";
import { getProduct } from "../api/productService.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import Loader from "../components/Loader.jsx";
import "./ProductDetails.scss";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((data) => {
        setProduct(data.product);
        setSize(data.product.sizes?.[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading product" />;
  if (!product) return <p className="products-empty">Product not found.</p>;

  const liked = isWishlisted(product._id);

  const handleAddToCart = () => {
    addToCart(product, qty, size);
    message.success("Added to cart");
  };

  const handleWishlist = async () => {
    const res = await toggle(product._id);
    if (res.requiresAuth) message.info("Please login to save items to your wishlist");
  };

  return (
    <div className="product-details">
      <Link to="/products" className="product-details__back">
        <FiChevronLeft /> Back to Collection
      </Link>

      <div className="product-details__grid">
        <div className="product-details__image">
          <img src={product.image.url} alt={product.name} />
        </div>

        <div className="product-details__info">
          <p className="eyebrow">{product.category}</p>
          <h1 className="font-display">{product.name}</h1>
          <p className="product-details__price">${product.price.toFixed(2)}</p>
          <p className="product-details__desc">{product.description}</p>

          <div className="product-details__row">
            <span className="product-details__label">Size</span>
            <div className="size-select">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={s === size ? "active" : ""}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="product-details__row">
            <span className="product-details__label">Quantity</span>
            <div className="qty-select">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <p className="product-details__stock">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently sold out"}
          </p>

          <div className="product-details__cta">
            <button className="btn-luxe-solid" onClick={handleAddToCart} disabled={product.stock === 0}>
              Add to Cart
            </button>
            <button className={`btn-luxe ${liked ? "is-liked" : ""}`} onClick={handleWishlist}>
              <FiHeart /> {liked ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
