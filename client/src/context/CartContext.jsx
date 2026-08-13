import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "luxestride_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, size = product.sizes?.[0]) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product === product._id && i.size === size);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = Math.min(next[idx].quantity + quantity, product.stock);
        return next;
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image.url,
          price: product.price,
          stock: product.stock,
          size,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setItems((prev) => prev.filter((i) => !(i.product === productId && i.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product === productId && i.size === size
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const { subtotal, totalItems } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        subtotal: acc.subtotal + i.price * i.quantity,
        totalItems: acc.totalItems + i.quantity,
      }),
      { subtotal: 0, totalItems: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
