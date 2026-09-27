import { useParams, Link } from 'react-router';
import { ChevronLeft, ShoppingCart, AlertTriangle, Zap, Package } from 'lucide-react';
import { useAppData } from '../lib/AppContext';
import { formatPeso, CATEGORY_LABELS } from '../lib/format';
import { useCart } from '../lib/cart';
import { useState } from 'react';

const CATEGORY_COLORS: Record<string, string> = {
  device: '#00f5ff', pod: '#bf00ff', eliquid: '#00ff88', coil: '#ffee00', accessory: '#ff006e',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useAppData();
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package size={40} className="mx-auto mb-4 text-muted-foreground" />
        <p className="font-display text-muted-foreground">// PRODUCT NOT FOUND</p>
        <Link to="/catalog" className="mt-4 text-primary hover:underline text-sm font-mono-cyber inline-block">← Return to catalogue</Link>
      </div>
    );
  }

  const color = CATEGORY_COLORS[product.category] ?? '#00f5ff';
  const outOfStock = product.stock_qty === 0;
  const lowStock = product.stock_qty > 0 && product.stock_qty <= 5;
  const cartItem = items.find(i => i.product.id === product.id);
  const maxQty = product.stock_qty - (cartItem?.quantity ?? 0);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-sm font-mono-cyber text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft size={14} />
        Back to catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square"
          style={{
            background: `radial-gradient(circle, ${color}08 0%, #050d14 70%)`,
            border: `1px solid ${color}33`,
            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
          }}>
          <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
          <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />

          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-8" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Zap size={80} style={{ color, filter: `drop-shadow(0 0 20px ${color})`, opacity: 0.4 }} />
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
              <span className="font-display text-muted-foreground border border-border px-4 py-2 text-sm uppercase tracking-widest">OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-mono-cyber uppercase tracking-widest px-2 py-0.5"
                style={{ color, background: `${color}15`, border: `1px solid ${color}44` }}>
                {CATEGORY_LABELS[product.category]}
              </span>
              {product.ps_license_no && (
                <span className="text-[9px] font-mono-cyber text-muted-foreground/50">PS#{product.ps_license_no}</span>
              )}
            </div>
            <p className="text-[10px] font-mono-cyber uppercase tracking-widest mb-1" style={{ color, opacity: 0.8 }}>{product.brand}</p>
            <h1 className="font-display text-2xl text-foreground leading-tight">{product.name}</h1>
          </div>

          <div className="font-display text-3xl" style={{ color, textShadow: `0 0 20px ${color}88` }}>
            {formatPeso(product.price)}
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed font-sans">
            {product.description}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {outOfStock ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono-cyber">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                OUT OF STOCK
              </div>
            ) : lowStock ? (
              <div className="flex items-center gap-2 text-sm font-mono-cyber" style={{ color: '#ffee00' }}>
                <AlertTriangle size={14} style={{ filter: 'drop-shadow(0 0 4px #ffee00)' }} />
                ONLY {product.stock_qty} LEFT IN STOCK
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-mono-cyber" style={{ color: '#00ff88' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
                IN STOCK ({product.stock_qty} units)
              </div>
            )}
          </div>

          {/* Qty selector + add to cart */}
          {!outOfStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border"
                style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors font-display text-lg">
                  −
                </button>
                <span className="w-10 text-center font-mono-cyber text-foreground">{qty}</span>
                <button onClick={() => setQty(Math.min(maxQty, qty + 1))}
                  disabled={qty >= maxQty}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors font-display text-lg disabled:opacity-30">
                  +
                </button>
              </div>
              <button onClick={handleAdd}
                className={`btn-cyber flex-1 ${added ? 'bg-green-400' : ''}`}
                style={added ? { boxShadow: '0 0 20px #00ff88' } : {}}>
                <ShoppingCart size={14} />
                {added ? 'ADDED!' : 'ADD TO CART'}
              </button>
            </div>
          )}

          {/* HUD info */}
          <div className="border-t border-border/30 pt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Brand', value: product.brand },
              { label: 'Category', value: CATEGORY_LABELS[product.category] },
              ...(product.ps_license_no ? [{ label: 'PS License', value: product.ps_license_no }] : []),
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] font-mono-cyber text-muted-foreground uppercase tracking-widest">{label}</p>
                <p className="text-sm font-display text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
