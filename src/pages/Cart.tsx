import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ChevronLeft, Zap } from 'lucide-react';
import { useCart } from '../lib/cart';
import { formatPeso } from '../lib/format';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center animate-neon-pulse"
          style={{
            background: 'rgba(0,245,255,0.05)',
            border: '1px solid rgba(0,245,255,0.2)',
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          }}>
          <ShoppingCart size={36} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 8px #00f5ff)', opacity: 0.6 }} />
        </div>
        <h2 className="font-display text-2xl text-primary neon-text-cyan mb-2">CART IS EMPTY</h2>
        <p className="text-sm font-mono-cyber text-muted-foreground mb-8">// No items loaded. Browse the grid.</p>
        <Link to="/catalog" className="btn-cyber inline-flex">
          <Zap size={14} />
          BROWSE CATALOGUE
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-sm font-mono-cyber text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft size={14} />
        Continue shopping
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart size={22} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
        <h1 className="font-display text-3xl text-primary neon-text-cyan">YOUR CART</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 items-start p-4 relative"
              style={{
                background: '#050d14',
                border: '1px solid #0d2840',
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
              }}>
              <div className="w-16 h-16 shrink-0 flex items-center justify-center"
                style={{
                  background: 'rgba(0,245,255,0.05)',
                  border: '1px solid #0d2840',
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Zap size={22} style={{ color: '#00f5ff', opacity: 0.4 }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-mono-cyber uppercase tracking-widest text-primary/60">{product.brand}</p>
                <p className="text-sm font-display text-foreground leading-snug mt-0.5 truncate">{product.name}</p>
                <p className="text-primary font-mono-cyber text-sm mt-1" style={{ textShadow: '0 0 8px #00f5ff44' }}>
                  {formatPeso(product.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeItem(product.id)}
                  className="text-muted-foreground hover:text-accent transition-colors">
                  <Trash2 size={14} />
                </button>
                <div className="flex items-center border border-border"
                  style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}>
                  <button onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-xs font-mono-cyber text-foreground">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock_qty}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-30">
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-[10px] font-mono-cyber text-muted-foreground">
                  {formatPeso(product.price * quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="relative p-5"
          style={{
            background: '#050d14',
            border: '1px solid rgba(0,245,255,0.2)',
            clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
            boxShadow: '0 0 30px rgba(0,245,255,0.05)',
          }}>
          <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: '2px solid #00f5ff', borderLeft: '2px solid #00f5ff' }} />
          <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: '2px solid #00f5ff', borderRight: '2px solid #00f5ff' }} />

          <h3 className="font-display text-sm text-primary uppercase tracking-widest mb-4">// Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-xs">
                <span className="font-mono-cyber text-muted-foreground truncate pr-2">{product.name} × {quantity}</span>
                <span className="font-mono-cyber text-foreground shrink-0">{formatPeso(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-primary/20 pt-3 flex justify-between items-center mb-4">
            <span className="text-sm font-mono-cyber text-muted-foreground">TOTAL</span>
            <span className="font-display text-xl text-primary neon-text-cyan">{formatPeso(total)}</span>
          </div>
          <p className="text-[10px] font-mono-cyber text-muted-foreground mb-4 leading-relaxed">
            // Shipping calculated at checkout based on courier and location.
          </p>
          <button onClick={() => navigate('/checkout')} className="btn-cyber w-full">
            PROCEED TO CHECKOUT
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
