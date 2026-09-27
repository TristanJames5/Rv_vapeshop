import { Link } from 'react-router';
import { Package, ChevronRight, Truck, RotateCcw, Zap } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAppData } from '../lib/AppContext';
import { OrderStatusBadge } from '../components/StatusBadge';
import { formatPeso, formatDate } from '../lib/format';

export default function Orders() {
  const { user } = useAuth();
  const { orders } = useAppData();

  const myOrders = orders
    .filter((o) => o.customer_id === user?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (myOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center animate-neon-pulse"
          style={{
            background: 'rgba(0,245,255,0.05)',
            border: '1px solid rgba(0,245,255,0.2)',
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          }}>
          <Package size={36} style={{ color: '#00f5ff', opacity: 0.6, filter: 'drop-shadow(0 0 8px #00f5ff)' }} />
        </div>
        <h2 className="font-display text-2xl text-primary neon-text-cyan mb-2">NO ORDERS YET</h2>
        <p className="text-sm font-mono-cyber text-muted-foreground mb-8">// Your order history will appear here once you place an order.</p>
        <Link to="/catalog" className="btn-cyber inline-flex">
          <Zap size={14} />
          BROWSE CATALOGUE
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Package size={22} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
        <h1 className="font-display text-3xl text-primary neon-text-cyan">MY ORDERS</h1>
      </div>

      <div className="space-y-3">
        {myOrders.map((order) => {
          const canPay = order.status === 'pending_payment' || order.status === 'payment_rejected';
          const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

          return (
            <div key={order.id} className="p-4 md:p-5 relative"
              style={{
                background: '#050d14',
                border: '1px solid #0d2840',
                clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
              }}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[9px] font-mono-cyber text-muted-foreground uppercase tracking-widest mb-0.5">// Reference</p>
                  <p className="font-mono-cyber text-sm text-primary" style={{ textShadow: '0 0 6px #00f5ff44' }}>
                    {order.reference_code}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Items preview */}
              {order.items && order.items.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="w-10 h-10 flex items-center justify-center"
                      style={{
                        background: '#0a1525',
                        border: '1px solid #0d2840',
                        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                      }}>
                      {item.product?.image_url ? (
                        <img src={item.product.image_url} alt={item.product?.name} className="w-full h-full object-cover" />
                      ) : (
                        <Zap size={14} style={{ color: '#00f5ff', opacity: 0.4 }} />
                      )}
                    </div>
                  ))}
                  {itemCount > 3 && (
                    <div className="w-10 h-10 flex items-center justify-center"
                      style={{ background: '#0a1525', border: '1px solid #0d2840', clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                      <span className="text-[10px] font-mono-cyber text-muted-foreground">+{itemCount - 3}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-xs font-mono-cyber text-muted-foreground mb-3">
                <span>{formatDate(order.created_at)}</span>
                <span>{order.logistics_company === 'lbc' ? 'LBC EXPRESS' : 'LALAMOVE'}</span>
                {order.tracking_no && (
                  <span className="flex items-center gap-1">
                    <Truck size={11} />
                    {order.tracking_no}
                  </span>
                )}
                <span className="font-display text-foreground">{formatPeso(order.total_amount)}</span>
              </div>

              {canPay && (
                <Link to={`/orders/${order.id}/payment`}
                  className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wider px-3 py-1.5 transition-all"
                  style={{
                    background: 'rgba(0,245,255,0.1)',
                    border: '1px solid rgba(0,245,255,0.4)',
                    color: '#00f5ff',
                    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                    boxShadow: '0 0 8px rgba(0,245,255,0.2)',
                  }}>
                  {order.status === 'payment_rejected' ? (
                    <><RotateCcw size={11} /> Re-submit Payment</>
                  ) : (
                    <>Upload Payment Proof <ChevronRight size={11} /></>
                  )}
                </Link>
              )}

              {order.status === 'payment_rejected' && order.payment_proof?.review_notes && (
                <p className="mt-2 text-xs font-mono-cyber text-accent">
                  // Rejection reason: {order.payment_proof.review_notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
