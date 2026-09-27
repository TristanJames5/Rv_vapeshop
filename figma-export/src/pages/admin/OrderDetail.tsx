import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Loader2,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useAppData } from '../../lib/AppContext';
import { OrderStatusBadge } from '../../components/StatusBadge';
import { formatPeso, formatDateTime } from '../../lib/format';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, profiles, products, updateOrder } = useAppData();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [trackingNo, setTrackingNo] = useState('');
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const order = orders.find((o) => o.id === id);
  const customer = order ? profiles.find((p) => p.id === order.customer_id) : null;

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Link to="/admin/orders" className="text-primary hover:underline text-sm">Back to orders</Link>
      </div>
    );
  }

  const items = order.items ?? [];

  const act = async (fn: () => void) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    fn();
    setLoading(false);
  };

  const approvePayment = () =>
    act(() =>
      updateOrder(order.id, {
        status: 'processing',
        payment_proof: order.payment_proof
          ? { ...order.payment_proof, review_status: 'approved', reviewed_at: new Date().toISOString() }
          : undefined,
      }),
    );

  const rejectPayment = () =>
    act(() => {
      updateOrder(order.id, {
        status: 'payment_rejected',
        payment_proof: order.payment_proof
          ? {
              ...order.payment_proof,
              review_status: 'rejected',
              review_notes: rejectNote,
              reviewed_at: new Date().toISOString(),
            }
          : undefined,
      });
      setShowRejectForm(false);
    });

  const markShipped = () =>
    act(() => {
      updateOrder(order.id, { status: 'shipped', tracking_no: trackingNo || undefined });
      setShowTrackingForm(false);
    });

  const markCompleted = () => act(() => updateOrder(order.id, { status: 'completed' }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to orders
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-foreground font-mono">{order.reference_code}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{formatDateTime(order.created_at)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="bg-card border border-border rounded p-4 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Customer</h2>
          <div className="flex items-center gap-2">
            <User size={14} className="text-muted-foreground" />
            <span className="text-sm text-foreground">{customer?.full_name ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-muted-foreground" />
            <span className="text-sm text-foreground">{order.contact_phone}</span>
          </div>
          {order.detailed_address && (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{order.detailed_address}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {order.logistics_company === 'lbc' ? (
              <Package size={14} className="text-muted-foreground" />
            ) : (
              <Truck size={14} className="text-muted-foreground" />
            )}
            <span className="text-sm text-foreground uppercase">{order.logistics_company}</span>
            {order.tracking_no && (
              <span className="text-xs text-muted-foreground">· {order.tracking_no}</span>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="bg-card border border-border rounded p-4 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Order Items</h2>
          {items.map((item) => {
            const product = item.product ?? products.find((p) => p.id === item.product_id);
            return (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <span className="text-foreground">
                  {product?.name ?? item.product_id} × {item.quantity}
                </span>
                <span className="text-muted-foreground shrink-0 ml-2">
                  {formatPeso(item.unit_price * item.quantity)}
                </span>
              </div>
            );
          })}
          <div className="border-t border-border pt-2 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-semibold text-primary">{formatPeso(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Payment proof */}
      {order.payment_proof && (
        <div className="bg-card border border-border rounded p-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Payment Proof
          </h2>
          <img
            src={order.payment_proof.image_url}
            alt="Payment proof"
            className="max-h-64 rounded border border-border object-contain bg-secondary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Uploaded {formatDateTime(order.payment_proof.uploaded_at)} ·{' '}
            <span
              className={
                order.payment_proof.review_status === 'approved'
                  ? 'text-emerald-400'
                  : order.payment_proof.review_status === 'rejected'
                  ? 'text-rose-400'
                  : 'text-amber-500'
              }
            >
              {order.payment_proof.review_status}
            </span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="bg-card border border-border rounded p-4 space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Actions</h2>

        {order.status === 'pending_verification' && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={approvePayment}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded text-sm font-medium hover:bg-emerald-500 transition-colors disabled:opacity-40"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Approve Payment
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white py-2.5 rounded text-sm font-medium hover:bg-rose-500 transition-colors disabled:opacity-40"
              >
                <XCircle size={14} />
                Reject Payment
              </button>
            </div>
            {showRejectForm && (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Rejection reason (shown to customer)…"
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={rejectPayment}
                    disabled={loading}
                    className="px-4 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-500 transition-colors"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 border border-border text-muted-foreground text-sm rounded hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {order.status === 'processing' && (
          <div className="space-y-3">
            <button
              onClick={() => setShowTrackingForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-500 transition-colors"
            >
              <Truck size={14} />
              Mark as Shipped
            </button>
            {showTrackingForm && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="Tracking number (optional)"
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="flex gap-2">
                  <button
                    onClick={markShipped}
                    disabled={loading}
                    className="px-4 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-500 transition-colors"
                  >
                    Confirm Shipment
                  </button>
                  <button
                    onClick={() => setShowTrackingForm(false)}
                    className="px-4 py-2 border border-border text-muted-foreground text-sm rounded hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {order.status === 'shipped' && (
          <button
            onClick={markCompleted}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Mark as Completed
          </button>
        )}

        {['completed', 'cancelled'].includes(order.status) && (
          <p className="text-sm text-muted-foreground">This order is closed.</p>
        )}
      </div>
    </div>
  );
}
