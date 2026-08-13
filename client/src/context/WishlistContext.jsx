import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import { getWishlist, toggleWishlist as toggleWishlistApi } from "../api/userService.js";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      return;
    }
    try {
      const { wishlist } = await getWishlist();
      setProducts(wishlist.products);
    } catch {
      setProducts([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (productId) => {
    if (!isAuthenticated) return { requiresAuth: true };
    const { wishlist } = await toggleWishlistApi(productId);
    setProducts(wishlist.products);
    return { requiresAuth: false };
  };

  const isWishlisted = (productId) => products.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ products, toggle, isWishlisted, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
