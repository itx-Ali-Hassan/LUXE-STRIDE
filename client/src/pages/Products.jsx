import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Select, Input, Pagination } from "antd";
import { FiSearch } from "react-icons/fi";
import { getProducts } from "../api/productService.js";
import ProductCard from "../components/ProductCard.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Products.scss";

const CATEGORIES = ["All", "Sneakers", "Running", "Formal", "Boots", "Sandals", "Sports"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const category = searchParams.get("category") || "All";
  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  const scopeRef = useScrollReveal([products]);

  useEffect(() => {
    setLoading(true);
    getProducts({ category, keyword, sort, page, limit: 9 })
      .then((data) => {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [category, keyword, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="products-page" ref={scopeRef}>
      <div className="products-hero reveal">
        <span className="eyebrow">The Collection</span>
        <h1 className="font-display">All Footwear</h1>
        <p>{total} pair{total !== 1 ? "s" : ""} crafted for the way you move.</p>
      </div>

      <div className="products-toolbar reveal">
        <Input
          placeholder="Search products…"
          prefix={<FiSearch />}
          defaultValue={keyword}
          onPressEnter={(e) => updateParam("keyword", e.target.value)}
          allowClear
          onClear={() => updateParam("keyword", "")}
        />

        <Select
          value={category}
          onChange={(v) => updateParam("category", v === "All" ? "" : v)}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        <Select
          value={sort}
          onChange={(v) => updateParam("sort", v)}
          options={[
            { value: "newest", label: "Newest" },
            { value: "price_asc", label: "Price: Low to High" },
            { value: "price_desc", label: "Price: High to Low" },
            { value: "name_asc", label: "Name: A–Z" },
          ]}
        />
      </div>

      {loading ? (
        <p className="products-empty">Loading…</p>
      ) : products.length === 0 ? (
        <p className="products-empty">No products match your search.</p>
      ) : (
        <>
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {pages > 1 && (
            <div className="products-pagination">
              <Pagination
                current={page}
                total={pages * 9}
                pageSize={9}
                onChange={(p) => updateParam("page", p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
