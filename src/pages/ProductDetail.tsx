import { useParams, Link } from 'react-router';
import { ChevronLeft, ShoppingCart, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useAppData } from '../lib/AppContext';
import { formatPeso, CATEGORY_LABELS } from '../lib/format';
import { useCart } from '../lib/cart';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useAppData();
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <h2 className="font-display text-2xl mb-4 text-muted-foreground">Product Not Found</h2>
        <Link to="/catalog" className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-2">
          <ChevronLeft size={16} /> Return to collection
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock_qty === 0;
  
  const selectedFlavorObj = product.flavors?.find(f => f.name === selectedFlavor);
  const currentStock = selectedFlavor ? (selectedFlavorObj?.stock ?? 0) : product.stock_qty;
  const lowStock = currentStock > 0 && currentStock <= 5;
  const cartItem = items.find(i => i.product.id === product.id && i.selectedFlavor === selectedFlavor);
  const maxQty = currentStock - (cartItem?.quantity ?? 0);

  const handleAdd = () => {
    if (product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      alert("Please select a flavor first.");
      return;
    }
    addItem(product, qty, selectedFlavor || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft size={16} />
        Back to collection
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-zinc-900 rounded-lg overflow-hidden border border-white/5 shadow-2xl">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 bg-gradient-to-b from-zinc-800 to-zinc-900">
              <ImageIcon size={64} strokeWidth={1} className="mb-4" />
              <span className="text-sm font-sans tracking-widest uppercase">Image Unavailable</span>
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="font-sans font-medium tracking-widest text-white border border-white/20 px-6 py-3 text-sm uppercase rounded">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col py-4">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-primary">
                {CATEGORY_LABELS[product.category]}
              </span>
              {product.ps_license_no && (
                <span className="text-xs text-muted-foreground/50 border-l border-white/10 pl-3">PS# {product.ps_license_no}</span>
              )}
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-sm font-sans font-medium uppercase tracking-widest text-muted-foreground">
              By {product.brand}
            </p>
          </div>

          <div className="font-sans font-medium text-3xl text-primary mb-8">
            {formatPeso(product.price)}
          </div>

          <div className="text-base text-muted-foreground leading-relaxed font-light mb-10">
            {product.description}
          </div>

          <div className="mt-auto space-y-6">
            {/* Stock status */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-6">
              {outOfStock || (selectedFlavor && currentStock === 0) ? (
                <div className="flex items-center gap-2 text-sm text-red-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Currently out of stock
                </div>
              ) : lowStock ? (
                <div className="flex items-center gap-2 text-sm font-medium text-amber-500">
                  <AlertTriangle size={16} />
                  Limited supply: Only {currentStock} units available
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  In Stock and ready to ship
                </div>
              )}
            </div>

            {/* Flavors */}
            {product.flavors && product.flavors.length > 0 && (
              <div className="border-b border-white/5 pb-6">
                <h3 className="text-sm font-sans font-medium text-foreground mb-3 uppercase tracking-widest">Select Flavor/Variation</h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map(flavor => (
                    <button
                      key={flavor.name}
                      disabled={flavor.stock === 0}
                      onClick={() => {
                        setSelectedFlavor(flavor.name);
                        setQty(1);
                      }}
                      className={`px-4 py-2 rounded-full border text-sm font-sans transition-colors ${
                        selectedFlavor === flavor.name 
                          ? 'bg-primary border-primary text-background' 
                          : flavor.stock === 0
                            ? 'bg-secondary/20 border-white/5 text-muted-foreground/30 cursor-not-allowed line-through'
                            : 'bg-secondary/50 border-white/10 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      }`}
                    >
                      {flavor.name} {flavor.stock === 0 && '(Sold Out)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty selector + add to cart */}
            {!outOfStock && (
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center border border-white/20 rounded h-12">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-lg">
                    &minus;
                  </button>
                  <span className="w-12 text-center font-sans font-medium text-foreground">{qty}</span>
                  <button onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    disabled={qty >= maxQty}
                    className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-lg disabled:opacity-30">
                    &#43;
                  </button>
                </div>
                
                <button onClick={handleAdd}
                  disabled={Boolean((product.flavors && product.flavors.length > 0 && !selectedFlavor) || (selectedFlavor && currentStock === 0))}
                  className={`btn-premium flex-1 h-12 ${added ? 'bg-green-600 border-green-500 text-white !shadow-none' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}>
                  <ShoppingCart size={18} />
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
