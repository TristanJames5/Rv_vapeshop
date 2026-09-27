import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAppData } from '../lib/AppContext';
import { ProductCard } from '../components/ProductCard';
import type { ProductCategory } from '../lib/types';
import { CATEGORY_LABELS } from '../lib/format';

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'device', label: 'Devices' },
  { value: 'pod', label: 'Pods' },
  { value: 'eliquid', label: 'E-Liquids' },
  { value: 'coil', label: 'Coils' },
  { value: 'accessory', label: 'Accessories' },
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
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, category, search, showInStock]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground">Catalogue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, brands…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowInStock(!showInStock)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded border text-sm transition-colors ${
            showInStock
              ? 'bg-primary/10 border-primary/40 text-primary'
              : 'bg-card border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <SlidersHorizontal size={14} />
          In Stock Only
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`shrink-0 px-4 py-1.5 rounded text-sm transition-colors ${
              category === value
                ? 'bg-primary text-primary-foreground font-medium'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm">No products found.</p>
          <button
            onClick={() => { setSearch(''); setCategory('all'); setShowInStock(false); }}
            className="mt-3 text-primary text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
