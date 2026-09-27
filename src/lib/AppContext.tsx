import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, Order, Profile, ShopSettings } from './types';
import { supabase } from './supabase';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rv_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('rv_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('rv_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  useEffect(() => {
    // Fetch initial products from Supabase
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (data && !error) {
        const mappedProducts = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          category: item.category,
          imageUrl: item.image_url,
          isActive: item.is_active,
          flavors: item.flavors || []
        }));
        setProducts(mappedProducts as Product[]);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => { localStorage.setItem('rv_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('rv_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('rv_settings', JSON.stringify(shopSettings)); }, [shopSettings]);

  const addProduct = async (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    const { error } = await supabase.from('products').insert({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image_url: product.imageUrl,
      is_active: product.isActive ?? true,
      flavors: product.flavors || []
    });
    if (error) console.error("Insert error:", error);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const dbUpdates: any = { ...updates };
    if (updates.imageUrl !== undefined) {
      dbUpdates.image_url = updates.imageUrl;
      delete dbUpdates.imageUrl;
    }
    if (updates.isActive !== undefined) {
      dbUpdates.is_active = updates.isActive;
      delete dbUpdates.isActive;
    }
    const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
    if (error) console.error("Update error:", error);
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error("Delete error:", error);
  };

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
