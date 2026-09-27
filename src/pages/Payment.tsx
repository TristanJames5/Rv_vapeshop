import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ChevronLeft, Upload, Copy, CheckCircle, Loader2, QrCode, AlertTriangle, Zap } from 'lucide-react';
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
        <p className="font-mono-cyber text-muted-foreground mb-4">// Order not found.</p>
        <Link to="/orders" className="text-primary hover:underline text-sm font-mono-cyber">View my orders</Link>
      </div>
    );
  }

  if (order.status !== 'pending_payment' && order.status !== 'payment_rejected') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-mono-cyber text-muted-foreground mb-2">// Payment already submitted for this order.</p>
        <Link to="/orders" className="text-primary hover:underline text-sm font-mono-cyber">View my orders</Link>
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
    setTimeout(() => navigate('/orders'), 800);
  };

  const cyberCard = {
    background: '#050d14',
    border: '1px solid #0d2840',
    clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm font-mono-cyber text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft size={14} />
        My orders
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Zap size={22} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
        <h1 className="font-display text-3xl text-primary neon-text-cyan">COMPLETE PAYMENT</h1>
      </div>
      <p className="text-sm font-mono-cyber text-muted-foreground mb-8">
        // Transfer exact amount via InstaPay, then upload payment screenshot below.
      </p>

      {order.status === 'payment_rejected' && (
        <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 p-4 mb-6"
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
          <AlertTriangle size={16} style={{ color: '#ff006e', filter: 'drop-shadow(0 0 4px #ff006e)' }} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-display text-accent uppercase tracking-wider">// Previous Payment Rejected</p>
            <p className="text-xs font-mono-cyber text-muted-foreground mt-0.5">Please submit a new payment screenshot.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment info */}
        <div className="space-y-4">
          {/* QR code */}
          <div style={cyberCard} className="p-5 text-center">
            <div className="w-44 h-44 mx-auto mb-4 flex items-center justify-center relative"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.2)',
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              }}>
              <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: '2px solid #00f5ff', borderLeft: '2px solid #00f5ff' }} />
              <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: '2px solid #00f5ff', borderRight: '2px solid #00f5ff' }} />
              {shopSettings.instapay_qr_url ? (
                <img src={shopSettings.instapay_qr_url} alt="InstaPay QR Code" className="w-full h-full object-contain p-2" />
              ) : (
                <QrCode size={56} style={{ color: '#00f5ff', opacity: 0.4, filter: 'drop-shadow(0 0 8px #00f5ff)' }} />
              )}
            </div>
            <p className="text-[9px] font-mono-cyber text-muted-foreground uppercase tracking-widest mb-1">// INSTAPAY ACCOUNT</p>
            <p className="text-sm font-display text-foreground">{shopSettings.instapay_account_name ?? '—'}</p>
          </div>

          {/* Amount + ref */}
          <div style={cyberCard} className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono-cyber text-muted-foreground">AMOUNT TO PAY</span>
              <span className="font-display text-2xl text-primary neon-text-cyan">{formatPeso(order.total_amount)}</span>
            </div>
            <div>
              <p className="text-[9px] font-mono-cyber text-muted-foreground uppercase tracking-widest mb-1.5">
                Reference Code <span className="text-amber-400">· Include in payment description</span>
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted border border-border px-3 py-2 text-sm font-mono-cyber text-primary tracking-wider"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                  {order.reference_code}
                </code>
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono-cyber transition-all"
                  style={{
                    border: `1px solid ${copied ? 'rgba(0,255,136,0.4)' : '#0d2840'}`,
                    color: copied ? '#00ff88' : '#4a7a9b',
                    background: copied ? 'rgba(0,255,136,0.1)' : 'transparent',
                    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                    boxShadow: copied ? '0 0 8px rgba(0,255,136,0.3)' : 'none',
                  }}>
                  {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                  {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload proof */}
        <div className="space-y-4">
          <div style={cyberCard} className="p-5">
            <h3 className="font-display text-sm text-primary uppercase tracking-widest mb-3">// Upload Payment Screenshot</h3>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {proofPreview ? (
              <div className="space-y-3">
                <img src={proofPreview} alt="Payment proof"
                  className="w-full max-h-56 object-contain border border-border bg-muted"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="text-xs font-mono-cyber text-primary hover:underline">
                  Change file
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-border px-4 py-12 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                <Upload size={28} />
                <span className="text-sm font-mono-cyber">CLICK TO UPLOAD SCREENSHOT</span>
                <span className="text-xs font-mono-cyber text-muted-foreground/50">JPG · PNG · WEBP · MAX 10MB</span>
              </button>
            )}
          </div>

          <button disabled={!proofFile || loading} onClick={handleSubmit} className="btn-cyber w-full">
            {loading && <Loader2 size={14} className="animate-spin" />}
            SUBMIT PAYMENT PROOF
          </button>

          <p className="text-[10px] font-mono-cyber text-muted-foreground text-center leading-relaxed">
            // Team verifies payment within 1-4 hours during business hours. You'll be notified when order moves to Processing.
          </p>
        </div>
      </div>
    </div>
  );
}
