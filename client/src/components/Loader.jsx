import React from "react";
import "./Loader.scss";

// simple full-page loader, used while auth/session or page data is loading
export default function Loader({ label = "Loading" }) {
  return (
    <div className="luxe-loader">
      <div className="luxe-loader__ring" />
      <p>{label}</p>
    </div>
  );
}
