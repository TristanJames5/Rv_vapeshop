import { Package, Search, CreditCard } from 'lucide-react';
import { useAppData } from '../lib/AppContext';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { formatPeso } from '../lib/format';
import { OrderStatusBadge } from '../components/StatusBadge';

export default function Orders() {
  const { orders, updateOrder } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myOrders = orders.filter((o) => o.customer_id === user?.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (myOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Package size={48} className="mx-auto mb-6 text-muted-foreground/30" strokeWidth={1} />
        <h2 className="font-display text-2xl text-foreground mb-2">No Orders Yet</h2>
        <p className="text-muted-foreground font-light mb-8">You haven't placed any orders yet. Discover our collection.</p>
        <a href="/catalog" className="btn-premium">Browse Collection</a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/5">
        <div>
          <h1 className="font-display text-4xl text-foreground tracking-wide mb-2">Order History</h1>
          <p className="text-sm text-muted-foreground font-light">View and track your recent purchases.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search order ID..." className="premium-input pl-10 text-sm" />
        </div>
      </div>

      <div className="space-y-6">
        {myOrders.map((order) => (
          <div key={order.id} className="bg-card border border-white/5 rounded-lg overflow-hidden transition-all hover:border-white/10">
            {/* Header */}
            <div className="bg-background px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Order Placed</p>
                  <p className="text-sm font-medium text-foreground">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-sm font-medium text-primary">{formatPeso(order.total_amount)}</p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Order #{order.id}</p>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Items */}
            <div className="px-6 py-4 divide-y divide-white/5">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground font-medium text-sm">{item.quantity}x</span>
                    <span className="text-foreground text-sm font-medium">{item.product?.name ?? 'Unknown Product'}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{formatPeso(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-background/50 px-6 py-3 border-t border-white/5 flex justify-between items-center text-xs print-hide">
              <span className="text-muted-foreground">Shipping via {order.logistics_company.toUpperCase()}</span>
              <div className="flex items-center gap-4">
                {order.status === 'pending_payment' && (
                  <>
                    <button onClick={() => {
                      if (confirm('Are you sure you want to cancel this order?')) {
                        updateOrder(order.id, { status: 'cancelled' });
                      }
                    }} className="text-rose-400 hover:text-rose-300 font-medium hover:underline transition-colors mr-2">
                      Cancel Order
                    </button>
                    <button onClick={() => navigate(`/orders/${order.id}/payment`)} className="flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium bg-primary/10 px-3 py-1.5 rounded transition-colors">
                      <CreditCard size={14} /> Complete Payment
                    </button>
                  </>
                )}
                <button onClick={() => window.open(`/orders/${order.id}/invoice`, '_blank')} className="text-primary hover:underline font-medium">View Invoice</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
