import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCart } from '../lib/cart';
import { formatPeso } from '../lib/format';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={32} className="text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl text-foreground mb-2">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mb-8">Add items from the catalogue to get started.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded text-sm font-medium hover:bg-accent transition-colors"
        >
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={14} />
        Continue shopping
      </Link>

      <h1 className="font-display text-3xl text-foreground mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded p-4 flex gap-4 items-start"
            >
              <div className="w-16 h-16 shrink-0 bg-secondary rounded overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
                  {product.brand}
                </p>
                <p className="text-sm font-medium text-foreground leading-snug mt-0.5 truncate">
                  {product.name}
                </p>
                <p className="text-primary font-semibold text-sm mt-1">{formatPeso(product.price)}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-muted-foreground hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex items-center border border-border rounded overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-xs text-foreground">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock_qty}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Subtotal: {formatPeso(product.price * quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-card border border-border rounded p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate pr-2">
                    {product.name} × {quantity}
                  </span>
                  <span className="text-foreground shrink-0">
                    {formatPeso(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center mb-5">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-semibold text-primary">{formatPeso(total)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">
              Shipping cost is determined after checkout based on your selected courier and address.
            </p>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded text-sm font-medium hover:bg-accent transition-colors"
            >
              Proceed to Checkout
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
