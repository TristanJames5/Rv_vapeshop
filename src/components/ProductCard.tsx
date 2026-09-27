import { ShoppingCart, AlertTriangle, Eye, Image as ImageIcon } from 'lucide-react';
import type { Product } from '../lib/types';
import { formatPeso, CATEGORY_LABELS } from '../lib/format';
import { useCart } from '../lib/cart';
import { useNavigate } from 'react-router';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const outOfStock = product.stock_qty === 0;
  const lowStock = product.stock_qty > 0 && product.stock_qty <= 5;

  return (
    <div
      className="premium-card relative overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => navigate(`/catalog/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 bg-gradient-to-b from-zinc-800 to-zinc-900">
             <ImageIcon size={48} strokeWidth={1} className="mb-2" />
             <span className="text-xs font-sans tracking-widest uppercase">No Image</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-1 bg-black/60 text-primary backdrop-blur-md rounded border border-primary/20">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
          {outOfStock && (
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-1 bg-red-950/80 text-red-400 backdrop-blur-md rounded border border-red-900/50 shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* View overlay on hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 text-sm font-sans font-medium uppercase tracking-widest text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={16} />
            Quick View
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-[10px] font-sans font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
            {product.brand}
          </p>
          <h3 className="text-foreground font-display text-sm sm:text-lg leading-snug line-clamp-2 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </div>

        {lowStock && (
          <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-amber-500">
            <AlertTriangle size={12} />
            <span>Only {product.stock_qty} left</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-white/5">
          <span className="font-sans font-semibold text-sm sm:text-lg text-primary tracking-wide">
            {formatPeso(product.price)}
          </span>
          <button
            disabled={outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!outOfStock) addItem(product);
            }}
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
              outOfStock 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-background hover:shadow-[0_4px_12px_rgba(212,175,55,0.3)]'
            }`}
            title={outOfStock ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={16} className={outOfStock ? '' : 'translate-x-[-1px]'} />
          </button>
        </div>
      </div>
    </div>
  );
}
