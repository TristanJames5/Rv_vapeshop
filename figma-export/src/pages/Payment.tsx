import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Upload,
  Copy,
  CheckCircle,
  Loader2,
  QrCode,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAppData } from '../lib/AppContext';
import { formatPeso } from '../lib/format';

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const { orders, updateOrder, shopSettings } = useAppData();
  const navigate = useNavigate();

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const order = orders.find((o) => o.id === orderId && o.customer_id === user?.id);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Link to="/orders" className="text-primary hover:underline text-sm">View my orders</Link>
      </div>
    );
  }

  if (order.status !== 'pending_payment' && order.status !== 'payment_rejected') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-2">Payment already submitted for this order.</p>
        <Link to="/orders" className="text-primary hover:underline text-sm">View my orders</Link>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(order.reference_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!proofFile) return;
    setLoading(true);
    const image_url = URL.createObjectURL(proofFile);
    updateOrder(order.id, {
      status: 'pending_verification',
      payment_proof: {
        id: `pp-${Date.now()}`,
        order_id: order.id,
        image_url,
        uploaded_at: new Date().toISOString(),
        review_status: 'pending',
      },
    });
    setTimeout(() => {
      navigate('/orders');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={14} />
        My orders
      </Link>

      <h1 className="font-display text-3xl text-foreground mb-2">Complete Your Payment</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Transfer the exact amount via InstaPay, then upload a screenshot of your payment below.
      </p>

      {order.status === 'payment_rejected' && (
        <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded p-4 mb-6">
          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-400">Previous payment was rejected</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Please submit a new payment screenshot.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment info */}
        <div className="space-y-4">
          {/* QR + account */}
          <div className="bg-card border border-border rounded p-5 text-center">
            <div className="w-40 h-40 mx-auto bg-secondary border border-border rounded overflow-hidden mb-4 flex items-center justify-center">
              {shopSettings.instapay_qr_url ? (
                <img
                  src={shopSettings.instapay_qr_url}
                  alt="InstaPay QR Code"
                  className="w-full h-full object-cover"
                />
              ) : (
                <QrCode size={48} className="text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              InstaPay Account
            </p>
            <p className="text-sm font-semibold text-foreground">
              {shopSettings.instapay_account_name ?? '—'}
            </p>
          </div>

          {/* Amount + ref code */}
          <div className="bg-card border border-border rounded p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount to pay</span>
              <span className="text-xl font-semibold text-primary">{formatPeso(order.total_amount)}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                Reference Code{' '}
                <span className="text-amber-500">· Include this in your payment description</span>
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground font-mono tracking-wider">
                  {order.reference_code}
                </code>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded border text-xs transition-colors ${
                    copied
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload proof */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Upload Payment Screenshot</h3>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {proofPreview ? (
              <div className="space-y-3">
                <img
                  src={proofPreview}
                  alt="Payment proof preview"
                  className="w-full max-h-56 object-contain rounded border border-border bg-secondary"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-primary hover:underline"
                >
                  Change file
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-border rounded px-4 py-10 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                <Upload size={24} />
                <span className="text-sm">Click to upload screenshot</span>
                <span className="text-xs">JPG, PNG, WEBP · Max 10MB</span>
              </button>
            )}
          </div>

          <button
            disabled={!proofFile || loading}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded text-sm font-medium hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Submit Payment Proof
          </button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Once submitted, our team will verify your payment within 1–4 hours during business
            hours. You'll be notified when your order moves to Processing.
          </p>
        </div>
      </div>
    </div>
  );
}
