import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.scss";

const luxeTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#C6A15B",
    colorBgBase: "#0B0B0D",
    colorBgContainer: "#17171C",
    colorText: "#F4F1EA",
    fontFamily: "'Jost', sans-serif",
    borderRadius: 6,
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={luxeTheme}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
