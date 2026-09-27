import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAppData } from '../lib/AppContext';
import { ProductCard } from '../components/ProductCard';
import type { ProductCategory } from '../lib/types';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = (searchParams.get('cat') as ProductCategory) || 'all';
  
  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCat);
  const [search, setSearch] = useState('');
  const [showInStock, setShowInStock] = useState(false);

  // Sync state when URL changes
  useEffect(() => {
    const cat = searchParams.get('cat') as ProductCategory;
    if (cat) {
      setCategory(cat);
    } else {
      setCategory('all');
    }
  }, [searchParams]);

  // Update URL when category changes
  const handleCategoryChange = (val: ProductCategory | 'all') => {
    setCategory(val);
    if (val === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', val);
    }
    setSearchParams(searchParams);
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center md:text-left relative border-b border-white/5 pb-8">
        <h1 className="font-display text-4xl text-primary tracking-wide mb-3">
          Our Collection
        </h1>
        <p className="text-sm font-sans text-muted-foreground">
          Discover our curated selection of premium vaping devices and accessories. 
          <span className="block mt-1 text-primary/70">Showing {filtered.length} products.</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="premium-input pl-10 pr-9 text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-4">Categories</h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map(({ value, label }) => {
                const isActive = category === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleCategoryChange(value)}
                    className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Toggles */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-4">Filters</h3>
            <button
              onClick={() => setShowInStock(!showInStock)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-all ${
                showInStock 
                  ? 'bg-primary/10 text-primary border border-primary/30' 
                  : 'border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} />
                In Stock Only
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${showInStock ? 'bg-primary' : 'bg-zinc-700'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${showInStock ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-32 bg-card/50 rounded-lg border border-white/5">
              <p className="font-display text-xl text-muted-foreground mb-2">No products found</p>
              <p className="text-sm text-muted-foreground/60 mb-6 font-light">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearch(''); handleCategoryChange('all'); setShowInStock(false); }}
                className="btn-premium-outline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {filtered.map((product) => (
                <motion.div 
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
