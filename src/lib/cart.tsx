import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product, CartItem } from './types';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedFlavor?: string) => void;
  removeItem: (productId: string, flavor?: string) => void;
  updateQuantity: (productId: string, flavor: string | undefined, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, quantity = 1, selectedFlavor?: string) => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
    
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.selectedFlavor === selectedFlavor);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedFlavor === selectedFlavor
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock_qty) }
            : i,
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock_qty), selectedFlavor }];
    });
  };

  const removeItem = (productId: string, flavor?: string) =>
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.selectedFlavor === flavor)));

  const updateQuantity = (productId: string, flavor: string | undefined, quantity: number) => {
    if (quantity <= 0) return removeItem(productId, flavor);
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.selectedFlavor === flavor
          ? { ...i, quantity: Math.min(quantity, i.product.stock_qty) }
          : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
