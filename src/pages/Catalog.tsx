import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Zap } from 'lucide-react';
import { useAppData } from '../lib/AppContext';
import { ProductCard } from '../components/ProductCard';
import type { ProductCategory } from '../lib/types';
import { CATEGORY_LABELS } from '../lib/format';

const CATEGORIES: { value: ProductCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Products', color: '#00f5ff' },
  { value: 'device', label: 'Devices', color: '#00f5ff' },
  { value: 'pod', label: 'Pods', color: '#bf00ff' },
  { value: 'eliquid', label: 'E-Liquids', color: '#00ff88' },
  { value: 'coil', label: 'Coils', color: '#ffee00' },
  { value: 'accessory', label: 'Accessories', color: '#ff006e' },
];

export default function Catalog() {
  const { products } = useAppData();
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showInStock, setShowInStock] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.is_active) return false;
      if (category !== 'all' && p.category !== category) return false;
      if (showInStock && p.stock_qty === 0) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, category, search, showInStock]);

  const activeColor = CATEGORIES.find(c => c.value === category)?.color ?? '#00f5ff';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 relative">
        <div className="flex items-center gap-3 mb-1">
          <Zap size={24} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 8px #00f5ff)' }} />
          <h1 className="font-display text-3xl text-primary neon-text-cyan">CATALOGUE</h1>
        </div>
        <p className="text-sm font-mono-cyber text-muted-foreground">
          // {filtered.length} PRODUCT{filtered.length !== 1 ? 'S' : ''} AVAILABLE
        </p>
        <div className="absolute right-0 top-0 text-[10px] font-mono-cyber text-primary/30 uppercase tracking-widest">
          NEON VAPE GRID
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cyber-input pl-9 pr-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowInStock(!showInStock)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-display uppercase tracking-wider transition-all"
          style={{
            background: showInStock ? 'rgba(0,245,255,0.1)' : 'transparent',
            border: `1px solid ${showInStock ? '#00f5ff66' : '#0d2840'}`,
            color: showInStock ? '#00f5ff' : '#4a7a9b',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            boxShadow: showInStock ? '0 0 10px rgba(0,245,255,0.2)' : 'none',
          }}
        >
          <SlidersHorizontal size={14} />
          In Stock Only
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {CATEGORIES.map(({ value, label, color }) => {
          const isActive = category === value;
          return (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className="shrink-0 px-4 py-1.5 text-sm font-display uppercase tracking-wider transition-all"
              style={{
                color: isActive ? color : '#4a7a9b',
                background: isActive ? `${color}15` : 'transparent',
                border: `1px solid ${isActive ? `${color}60` : '#0d2840'}`,
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                boxShadow: isActive ? `0 0 12px ${color}33` : 'none',
                textShadow: isActive ? `0 0 8px ${color}` : 'none',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Zap size={40} className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-display text-muted-foreground">// NO PRODUCTS FOUND</p>
          <button
            onClick={() => { setSearch(''); setCategory('all'); setShowInStock(false); }}
            className="mt-4 text-sm text-primary hover:underline font-mono-cyber"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
