import { ShoppingCart, AlertTriangle } from 'lucide-react';
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
      className="bg-card border border-border rounded overflow-hidden group flex flex-col hover:border-primary/40 transition-colors duration-200 cursor-pointer"
      onClick={() => navigate(`/catalog/${product.id}`)}
    >
      <div className="relative aspect-square bg-secondary overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart size={40} />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-background/80 backdrop-blur-sm text-muted-foreground text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-border">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
        </div>
        {outOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="bg-background border border-border text-muted-foreground text-xs px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-0.5">
            {product.brand}
          </p>
          <h3 className="text-foreground font-medium text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        {lowStock && (
          <div className="flex items-center gap-1 text-amber-500 text-[11px]">
            <AlertTriangle size={11} />
            <span>Only {product.stock_qty} left</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-primary font-semibold text-sm">{formatPeso(product.price)}</span>
          <button
            disabled={outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!outOfStock) addItem(product);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-accent"
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
