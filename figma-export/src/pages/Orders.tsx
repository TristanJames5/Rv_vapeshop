import { Link } from 'react-router';
import { Package, ChevronRight, Truck, RotateCcw } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAppData } from '../lib/AppContext';
import { OrderStatusBadge } from '../components/StatusBadge';
import { formatPeso, formatDate } from '../lib/format';

export default function Orders() {
  const { user } = useAuth();
  const { orders, products } = useAppData();

  const myOrders = orders
    .filter((o) => o.customer_id === user?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (myOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
          <Package size={32} className="text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl text-foreground mb-2">No orders yet</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Your order history will appear here once you place an order.
        </p>
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl text-foreground mb-8">My Orders</h1>

      <div className="space-y-3">
        {myOrders.map((order) => {
          const canPay =
            order.status === 'pending_payment' || order.status === 'payment_rejected';
          const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

          return (
            <div
              key={order.id}
              className="bg-card border border-border rounded p-4 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">
                    Reference
                  </p>
                  <p className="font-mono text-sm text-foreground">{order.reference_code}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Items preview */}
              {order.items && order.items.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="w-10 h-10 bg-secondary border border-border rounded overflow-hidden shrink-0"
                    >
                      {item.product?.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {itemCount > 3 && (
                    <div className="w-10 h-10 bg-secondary border border-border rounded flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">+{itemCount - 3}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                <span>{formatDate(order.created_at)}</span>
                <span>
                  {order.logistics_company === 'lbc' ? 'LBC Express' : 'Lalamove'}
                </span>
                {order.tracking_no && (
                  <span className="flex items-center gap-1">
                    <Truck size={11} />
                    {order.tracking_no}
                  </span>
                )}
                <span className="font-medium text-foreground">{formatPeso(order.total_amount)}</span>
              </div>

              {canPay && (
                <Link
                  to={`/orders/${order.id}/payment`}
                  className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-accent transition-colors"
                >
                  {order.status === 'payment_rejected' ? (
                    <>
                      <RotateCcw size={11} />
                      Re-submit Payment
                    </>
                  ) : (
                    <>
                      Upload Payment Proof
                      <ChevronRight size={11} />
                    </>
                  )}
                </Link>
              )}

              {order.status === 'payment_rejected' && order.payment_proof?.review_notes && (
                <p className="mt-2 text-xs text-rose-400">
                  Rejection reason: {order.payment_proof.review_notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
