import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ShoppingCart,
  ChevronLeft,
  Minus,
  Plus,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAppData } from '../lib/AppContext';
import { useCart } from '../lib/cart';
import { formatPeso, CATEGORY_LABELS } from '../lib/format';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useAppData();
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/catalog" className="text-primary hover:underline text-sm mt-3 block">
          Back to catalogue
        </Link>
      </div>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);
  const outOfStock = product.stock_qty === 0;
  const lowStock = product.stock_qty > 0 && product.stock_qty <= 5;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ChevronLeft size={14} />
        Back to catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-card border border-border rounded overflow-hidden aspect-square">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingCart size={60} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-widest text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded mb-2">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </span>
            <h1 className="font-display text-3xl text-foreground leading-tight mt-1">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
          </div>

          <div className="text-3xl font-semibold text-primary">{formatPeso(product.price)}</div>

          {/* Stock status */}
          {outOfStock ? (
            <div className="flex items-center gap-2 text-rose-400 text-sm">
              <AlertTriangle size={14} />
              Out of stock
            </div>
          ) : lowStock ? (
            <div className="flex items-center gap-2 text-amber-500 text-sm">
              <AlertTriangle size={14} />
              Only {product.stock_qty} left — order soon
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle size={14} />
              In stock
            </div>
          )}

          <p className="text-sm text-secondary-foreground leading-relaxed">{product.description}</p>

          {/* Quantity + add to cart */}
          {!outOfStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm text-foreground">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock_qty, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-sm font-medium transition-colors ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary text-primary-foreground hover:bg-accent'
                }`}
              >
                <ShoppingCart size={15} />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          )}

          {cartItem && (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded p-3">
              <span className="text-xs text-primary">
                {cartItem.quantity}× in your cart
              </span>
              <button
                onClick={() => navigate('/cart')}
                className="text-xs text-primary hover:underline"
              >
                View cart →
              </button>
            </div>
          )}

          {/* Meta */}
          <div className="border-t border-border pt-4 space-y-2">
            {product.ps_license_no && (
              <div className="flex items-start gap-2">
                <ShieldCheck size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  DTI-PS License: <span className="text-foreground">{product.ps_license_no}</span>
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground/60">
              For adults 18 and above only. Keep out of reach of children.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
