import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "0.8rem" }}>
      <span className="eyebrow">404</span>
      <h1 className="font-display">Page Not Found</h1>
      <p style={{ color: "#8C8C93" }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-luxe-solid">Back to Home</Link>
    </div>
  );
}
