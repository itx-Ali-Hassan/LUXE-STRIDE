import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProducts } from "../api/productService.js";
import ProductCard from "../components/ProductCard.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Home.scss";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const scopeRef = useScrollReveal([featured]);

  useEffect(() => {
    getProducts({ limit: 6, sort: "newest" })
      .then((data) => setFeatured(data.products))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home" ref={scopeRef}>
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero__glow" />
        <motion.div
          className="home-hero__content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">The Autumn Collection</span>
          <h1 className="font-display">
            Every step, <em>considered.</em>
          </h1>
          <p>
            LuxeStride pairs old-world shoemaking with a quiet, modern edge.
            No noise, no logos shouting — just leather, form, and finish
            that speaks for itself.
          </p>
          <div className="home-hero__cta">
            <Link to="/products" className="btn-luxe-solid">Shop the Collection</Link>
            <Link to="/products?category=Sneakers" className="btn-luxe">Sneakers</Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURED */}
      <section className="home-section">
        <div className="home-section__head reveal">
          <span className="eyebrow">Selected For You</span>
          <h2 className="font-display">New Arrivals</h2>
          <div className="section-divider" />
        </div>

        {loading ? (
          <p className="home-empty">Loading products…</p>
        ) : featured.length === 0 ? (
          <p className="home-empty">
            No products yet. Once the admin adds shoes, they'll show up here automatically.
          </p>
        ) : (
          <div className="home-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        <div className="home-section__more reveal">
          <Link to="/products" className="btn-luxe">View Full Collection</Link>
        </div>
      </section>

      {/* VALUES STRIP */}
      <section className="home-values">
        {[
          { title: "Full-Grain Leather", text: "Sourced from small tanneries, aged for character." },
          { title: "Hand Finished", text: "Every pair passes through a craftsperson's hands, not just a machine." },
          { title: "Made To Last", text: "Resoleable construction — built for years, not seasons." },
        ].map((v, i) => (
          <div className="home-values__item reveal" data-delay={i * 100} key={v.title}>
            <span className="home-values__num">0{i + 1}</span>
            <h4>{v.title}</h4>
            <p>{v.text}</p>
          </div>
        ))}
      </section>

      {/* BANNER */}
      <section className="home-banner reveal">
        <h2 className="font-display">Step into the house.</h2>
        <p>Browse the full collection — sneakers, running, formal and boots.</p>
        <Link to="/products" className="btn-luxe-solid">Explore Now</Link>
      </section>
    </div>
  );
}
