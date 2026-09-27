import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../lib/cart';
import { formatPeso } from '../lib/format';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center bg-card/30 rounded-lg mt-8 border border-white/5">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-white/5 text-muted-foreground">
          <ShoppingCart size={32} strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-3xl text-foreground mb-3">Your Cart is Empty</h2>
        <p className="text-sm font-sans text-muted-foreground mb-8 font-light">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/catalog" className="btn-premium">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft size={16} />
        Continue shopping
      </Link>

      <div className="mb-10 border-b border-white/5 pb-6">
        <h1 className="font-display text-4xl text-foreground tracking-wide">Shopping Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-6 items-center p-4 bg-card border border-white/5 rounded-lg">
              <div className="w-24 h-24 shrink-0 flex items-center justify-center bg-zinc-900 rounded-md overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-muted-foreground/30" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground mb-1">{product.brand}</p>
                <Link to={`/catalog/${product.id}`} className="text-lg font-display text-foreground leading-snug hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-primary font-sans font-medium mt-1">
                  {formatPeso(product.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-4 shrink-0">
                <button onClick={() => removeItem(product.id)}
                  className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center border border-white/20 rounded">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-sans font-medium text-foreground">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock_qty}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-30">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-white/5 rounded-lg p-6 shadow-xl">
            <h3 className="font-display text-xl text-foreground mb-6 pb-4 border-b border-white/5">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="font-sans text-muted-foreground line-clamp-1 pr-4">{quantity}x {product.name}</span>
                  <span className="font-sans text-foreground shrink-0">{formatPeso(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 flex justify-between items-end mb-6">
              <span className="text-base font-sans text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl text-primary">{formatPeso(total)}</span>
            </div>
            
            <p className="text-xs font-sans text-muted-foreground/60 mb-6 font-light">
              Shipping and taxes calculated at checkout.
            </p>
            
            <button onClick={() => navigate('/checkout')} className="btn-premium w-full flex justify-between items-center">
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
