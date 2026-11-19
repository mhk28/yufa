import { getVariantLabel } from "../utils/variants";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "yufa-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.map(item => item.designCode ? { ...item, variantLabel: getVariantLabel(item) } : item) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId &&
          (cartItem.variantKey || "") === (item.variantKey || "")
      );

      if (existingIndex === -1) {
        return [...currentItems, { ...item, quantity: item.quantity || 1 }];
      }

      return currentItems.map((cartItem, index) =>
        index === existingIndex
          ? { ...cartItem, ...item, quantity: Math.min(item.stock ?? Infinity, cartItem.quantity + (item.quantity || 1)) }
          : cartItem
      );
    });
  };

  const removeItem = (productId, variantKey = "") => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId || (item.variantKey || "") !== variantKey
      )
    );
  };

  const updateQuantity = (productId, variantKey = "", quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId && (item.variantKey || "") === variantKey
          ? { ...item, quantity: Math.min(item.stock ?? Infinity, nextQuantity) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + (Number(item.price) || 0) * item.quantity,
      0
    );

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
