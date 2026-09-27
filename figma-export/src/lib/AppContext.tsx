import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product, Order, Profile, ShopSettings } from './types';
import {
  MOCK_PRODUCTS,
  INITIAL_PROFILES,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
} from './data';

interface AppContextValue {
  products: Product[];
  orders: Order[];
  profiles: Profile[];
  shopSettings: ShopSettings;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  addProfile: (profile: Profile) => void;
  updateSettings: (updates: Partial<ShopSettings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(INITIAL_SETTINGS);

  const addProduct = (product: Product) =>
    setProducts((prev) => [product, ...prev]);

  const updateProduct = (id: string, updates: Partial<Product>) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const addOrder = (order: Order) =>
    setOrders((prev) => [order, ...prev]);

  const updateOrder = (id: string, updates: Partial<Order>) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, ...updates, updated_at: new Date().toISOString() } : o,
      ),
    );

  const updateProfile = (id: string, updates: Partial<Profile>) =>
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

  const addProfile = (profile: Profile) =>
    setProfiles((prev) => [...prev, profile]);

  const updateSettings = (updates: Partial<ShopSettings>) =>
    setShopSettings((prev) => ({ ...prev, ...updates }));

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        profiles,
        shopSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        updateProfile,
        addProfile,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
}
