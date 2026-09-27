import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ChevronLeft, Loader2, Truck, Package } from 'lucide-react';
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
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link to="/catalog" className="text-primary hover:underline text-sm">Browse catalogue</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.logistics_company === 'lalamove' && !form.detailed_address.trim()) {
      return;
    }
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

  const inputCls =
    'w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={14} />
        Back to cart
      </Link>

      <h1 className="font-display text-3xl text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: shipping form */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-card border border-border rounded p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.contact_full_name}
                    onChange={(e) => setForm({ ...form, contact_full_name: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={form.contact_phone}
                    onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                    placeholder="09XXXXXXXXX"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Shipping Method</h2>
              <div className="space-y-3">
                {[
                  {
                    value: 'lbc',
                    label: 'LBC Express',
                    desc: 'Drop-off at any LBC branch. Pick up using your reference code.',
                    icon: Package,
                  },
                  {
                    value: 'lalamove',
                    label: 'Lalamove',
                    desc: 'Door-to-door delivery. Requires a detailed delivery address.',
                    icon: Truck,
                  },
                ].map(({ value, label, desc, icon: Icon }) => (
                  <label
                    key={value}
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${
                      form.logistics_company === value
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border hover:border-primary/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="logistics"
                      value={value}
                      checked={form.logistics_company === value}
                      onChange={() =>
                        setForm({ ...form, logistics_company: value as LogisticsCompany })
                      }
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">{label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {form.logistics_company === 'lalamove' && (
                <div className="mt-4">
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    Detailed Delivery Address <span className="text-rose-400">· Required</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.detailed_address}
                    onChange={(e) => setForm({ ...form, detailed_address: e.target.value })}
                    placeholder="Unit/Building, Street, Barangay, City, Province, ZIP"
                    className={`${inputCls} resize-none`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: order summary */}
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
              <p className="text-[11px] text-muted-foreground mb-5">
                After placing your order, you'll be shown our InstaPay QR code and a reference
                number. Upload your payment screenshot to confirm.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
