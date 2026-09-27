import { ShoppingCart, AlertTriangle, Zap, Eye } from 'lucide-react';
import type { Product } from '../lib/types';
import { formatPeso, CATEGORY_LABELS } from '../lib/format';
import { useCart } from '../lib/cart';
import { useNavigate } from 'react-router';

const CATEGORY_COLORS: Record<string, string> = {
  device: '#00f5ff',
  pod: '#bf00ff',
  eliquid: '#00ff88',
  coil: '#ffee00',
  accessory: '#ff006e',
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const outOfStock = product.stock_qty === 0;
  const lowStock = product.stock_qty > 0 && product.stock_qty <= 5;
  const color = CATEGORY_COLORS[product.category] ?? '#00f5ff';

  return (
    <div
      className="relative overflow-hidden flex flex-col cursor-pointer group transition-all duration-300"
      style={{
        background: '#050d14',
        border: `1px solid ${color}22`,
        clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
      }}
      onClick={() => navigate(`/catalog/${product.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}66`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}22, 0 0 40px ${color}11`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}22`;
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-4 h-4 pointer-events-none z-10"
        style={{ borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, boxShadow: `-2px -2px 6px ${color}44` }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none z-10"
        style={{ borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, boxShadow: `2px 2px 6px ${color}44` }} />

      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `radial-gradient(circle, ${color}11 0%, transparent 70%)` }}>
            <Zap size={40} style={{ color, filter: `drop-shadow(0 0 8px ${color})`, opacity: 0.6 }} className="group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-mono-cyber uppercase tracking-widest px-2 py-0.5"
            style={{ color, background: `${color}15`, border: `1px solid ${color}44` }}>
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
        </div>

        {/* View overlay on hover */}
        <div className="absolute inset-0 bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-2 text-xs font-display uppercase tracking-widest" style={{ color }}>
            <Eye size={14} />
            VIEW
          </div>
        </div>

        {outOfStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-xs font-display uppercase tracking-widest text-muted-foreground border border-border px-3 py-1"
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-[9px] font-mono-cyber uppercase tracking-widest mb-0.5" style={{ color, opacity: 0.8 }}>
            {product.brand}
          </p>
          <h3 className="text-foreground font-display text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        {lowStock && (
          <div className="flex items-center gap-1 text-[10px] font-mono-cyber" style={{ color: '#ffee00' }}>
            <AlertTriangle size={10} style={{ filter: 'drop-shadow(0 0 4px #ffee00)' }} />
            <span>ONLY {product.stock_qty} LEFT</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-border/30">
          <span className="font-display text-sm" style={{ color, textShadow: `0 0 8px ${color}66` }}>
            {formatPeso(product.price)}
          </span>
          <button
            disabled={outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!outOfStock) addItem(product);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-display uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{
              background: outOfStock ? 'transparent' : `${color}22`,
              color: outOfStock ? '#4a7a9b' : color,
              border: `1px solid ${outOfStock ? '#0d2840' : `${color}44`}`,
              clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
            }}
            onMouseEnter={(e) => {
              if (!outOfStock) {
                (e.currentTarget as HTMLElement).style.background = `${color}33`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 10px ${color}44`;
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = outOfStock ? 'transparent' : `${color}22`;
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <ShoppingCart size={11} />
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
