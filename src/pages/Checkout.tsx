import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Truck, ChevronRight } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useAppData } from '../lib/AppContext';
import { useAuth } from '../lib/auth';
import { formatPeso } from '../lib/format';
import type { Order } from '../lib/types';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { addOrder } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [loading, setLoading] = useState(false);

  const shippingCost = shippingMethod === 'standard' ? 150 : 300;
  const grandTotal = total + shippingCost;

  const createPendingOrder = () => {
    if (!user) return null;
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      customer_id: user.id,
      status: 'pending_payment',
      total_amount: grandTotal,
      logistics_company: shippingMethod === 'standard' ? 'lbc' : 'lalamove',
      detailed_address: address,
      contact_full_name: user.full_name,
      contact_phone: user.phone,
      reference_code: `REF-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map(i => ({
        id: `ITEM-${Date.now()}-${i.product.id}`,
        order_id: orderId,
        product_id: i.product.id,
        product: i.product,
        quantity: i.quantity,
        unit_price: i.product.price
      })),
    };
    addOrder(newOrder);
    clearCart();
    return orderId;
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    setTimeout(() => {
      const orderId = createPendingOrder();
      if (orderId) navigate(`/orders/${orderId}/payment`);
    }, 800);
  };

  const handlePayLater = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!address) {
      alert('Please enter a delivery address first.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      createPendingOrder();
      navigate('/orders');
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground font-sans">No items to checkout.</p>
        <button onClick={() => navigate('/catalog')} className="text-primary hover:underline mt-4 text-sm inline-block">Return to shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground mb-2">Secure Checkout</h1>
        <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground uppercase tracking-wider">
          <span className="text-primary">Checkout</span>
          <ChevronRight size={12} />
          <span>Payment</span>
          <ChevronRight size={12} />
          <span>Confirmation</span>
        </div>
      </div>

      <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10">
        <form onSubmit={handlePayNow} className="space-y-8">
          {/* Shipping Address */}
          <section className="bg-card p-6 rounded-lg border border-white/5">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground mb-6 pb-3 border-b border-white/5">
              <MapPin size={18} className="text-primary" /> Delivery Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-muted-foreground tracking-wide mb-2">Full Name</label>
                <input type="text" readOnly value={user?.full_name} className="premium-input opacity-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-sans text-muted-foreground tracking-wide mb-2">Contact Number</label>
                <input type="tel" readOnly value={user?.phone} className="premium-input opacity-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-sans text-muted-foreground tracking-wide mb-2">Full Delivery Address</label>
                <textarea
                  required rows={3} value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Barangay, City, Province, Zip Code"
                  className="premium-input resize-none"
                />
              </div>
            </div>
          </section>

          {/* Shipping Method */}
          <section className="bg-card p-6 rounded-lg border border-white/5">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground mb-6 pb-3 border-b border-white/5">
              <Truck size={18} className="text-primary" /> Shipping Method
            </h2>

            <div className="space-y-3">
              {[
                { id: 'standard' as const, label: 'Standard Delivery', time: '3-5 Business Days', price: 150 },
                { id: 'express' as const, label: 'Express Delivery', time: '1-2 Business Days', price: 300 },
              ].map((method) => (
                <label key={method.id} onClick={() => setShippingMethod(method.id)} className={`flex items-center justify-between p-4 rounded border cursor-pointer transition-all ${
                  shippingMethod === method.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-white/10 hover:border-white/30 bg-background/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      shippingMethod === method.id ? 'border-primary' : 'border-muted-foreground'
                    }`}>
                      {shippingMethod === method.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${shippingMethod === method.id ? 'text-primary' : 'text-foreground'}`}>{method.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{method.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{formatPeso(method.price)}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <button type="submit" disabled={loading} className="btn-premium w-full py-4 text-lg">
              {loading ? 'Processing...' : 'Pay Now (InstaPay)'}
            </button>
            <button type="button" onClick={handlePayLater} disabled={loading} className="btn-premium-outline w-full py-3">
              {loading ? 'Processing...' : 'Place Order & Pay Later'}
            </button>
          </div>
        </form>

        {/* Order Summary */}
        <div className="md:border-l md:border-white/5 md:pl-10">
          <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-[30vh] md:max-h-[40vh] overflow-y-auto pr-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 items-start">
                <div className="relative w-16 h-16 bg-zinc-900 rounded overflow-hidden shrink-0 border border-white/5">
                  <span className="absolute -top-1 -right-1 bg-primary text-background text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 font-bold">
                    {quantity}
                  </span>
                  {product.image_url ? (
                    <img src={product.image_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">?</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-sans font-medium text-foreground line-clamp-2 leading-snug">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{product.brand}</p>
                </div>
                <p className="text-sm font-medium text-foreground">{formatPeso(product.price * quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatPeso(total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-foreground">{formatPeso(shippingCost)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
              <span className="text-base text-foreground">Total</span>
              <span className="font-display text-2xl text-primary">{formatPeso(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
