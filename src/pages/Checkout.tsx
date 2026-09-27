import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ChevronLeft, Loader2, Truck, Package, Zap } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';
import { useAppData } from '../lib/AppContext';
import { formatPeso, generateRefCode } from '../lib/format';
import type { Order, LogisticsCompany } from '../lib/types';

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { addOrder } = useAppData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    contact_full_name: user?.full_name ?? '',
    contact_phone: user?.phone ?? '',
    logistics_company: 'lbc' as LogisticsCompany,
    detailed_address: '',
  });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-mono-cyber text-muted-foreground mb-4">// Cart is empty.</p>
        <Link to="/catalog" className="text-primary hover:underline text-sm font-mono-cyber">Browse catalogue</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.logistics_company === 'lalamove' && !form.detailed_address.trim()) return;
    setLoading(true);
    const orderId = `order-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      customer_id: user!.id,
      customer: user!,
      status: 'pending_payment',
      total_amount: total,
      logistics_company: form.logistics_company,
      detailed_address: form.logistics_company === 'lalamove' ? form.detailed_address : undefined,
      contact_full_name: form.contact_full_name,
      contact_phone: form.contact_phone,
      reference_code: generateRefCode(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map((item, i) => ({
        id: `oi-${Date.now()}-${i}`,
        order_id: orderId,
        product_id: item.product.id,
        product: item.product,
        quantity: item.quantity,
        unit_price: item.product.price,
      })),
    };
    addOrder(newOrder);
    clearCart();
    navigate(`/orders/${orderId}/payment`);
  };

  const cyberCard = {
    background: '#050d14',
    border: '1px solid #0d2840',
    clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-mono-cyber text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft size={14} />
        Back to cart
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Zap size={22} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
        <h1 className="font-display text-3xl text-primary neon-text-cyan">CHECKOUT</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">
            {/* Contact */}
            <div style={cyberCard} className="p-5">
              <h2 className="font-display text-sm text-primary uppercase tracking-widest mb-4">// Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono-cyber text-primary/60 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input type="text" required value={form.contact_full_name}
                    onChange={(e) => setForm({ ...form, contact_full_name: e.target.value })}
                    className="cyber-input" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-cyber text-primary/60 uppercase tracking-widest mb-1.5">Mobile Number</label>
                  <input type="tel" required value={form.contact_phone}
                    onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                    placeholder="09XXXXXXXXX" className="cyber-input" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div style={cyberCard} className="p-5">
              <h2 className="font-display text-sm text-primary uppercase tracking-widest mb-4">// Shipping Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'lbc', label: 'LBC Express', desc: 'Drop-off at any LBC branch. Pick up using your reference code.', icon: Package },
                  { value: 'lalamove', label: 'Lalamove', desc: 'Door-to-door delivery. Requires a detailed delivery address.', icon: Truck },
                ].map(({ value, label, desc, icon: Icon }) => {
                  const isSelected = form.logistics_company === value;
                  return (
                    <label key={value}
                      className="flex items-start gap-3 p-4 cursor-pointer transition-all"
                      style={{
                        background: isSelected ? 'rgba(0,245,255,0.05)' : 'transparent',
                        border: `1px solid ${isSelected ? 'rgba(0,245,255,0.4)' : '#0d2840'}`,
                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                        boxShadow: isSelected ? '0 0 10px rgba(0,245,255,0.1)' : 'none',
                      }}>
                      <input type="radio" name="logistics" value={value} checked={isSelected}
                        onChange={() => setForm({ ...form, logistics_company: value as LogisticsCompany })}
                        className="mt-1 accent-primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon size={14} style={{ color: isSelected ? '#00f5ff' : '#4a7a9b' }} />
                          <span className="text-sm font-display text-foreground uppercase tracking-wider">{label}</span>
                        </div>
                        <p className="text-xs font-mono-cyber text-muted-foreground mt-1">{desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {form.logistics_company === 'lalamove' && (
                <div className="mt-4">
                  <label className="block text-[10px] font-mono-cyber text-primary/60 uppercase tracking-widest mb-1.5">
                    Delivery Address <span className="text-accent">· REQUIRED</span>
                  </label>
                  <textarea required rows={3} value={form.detailed_address}
                    onChange={(e) => setForm({ ...form, detailed_address: e.target.value })}
                    placeholder="Unit/Building, Street, Barangay, City, Province, ZIP"
                    className="cyber-input resize-none" />
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
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
            <p className="text-[10px] font-mono-cyber text-muted-foreground mb-5 leading-relaxed">
              // After placing order, you'll get an InstaPay QR and reference code. Upload payment screenshot to confirm.
            </p>
            <button type="submit" disabled={loading} className="btn-cyber w-full">
              {loading && <Loader2 size={14} className="animate-spin" />}
              PLACE ORDER
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
