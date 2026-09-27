import { ORDER_STATUS_LABELS } from '../lib/format';
import type { OrderStatus } from '../lib/types';

const STATUS_STYLES: Record<OrderStatus, { color: string; label: string }> = {
  pending_payment: { color: '#ffee00', label: 'AWAITING PAYMENT' },
  pending_verification: { color: '#bf00ff', label: 'PAYMENT REVIEW' },
  processing: { color: '#00f5ff', label: 'PROCESSING' },
  shipped: { color: '#00ff88', label: 'SHIPPED' },
  completed: { color: '#00ff88', label: 'COMPLETED' },
  payment_rejected: { color: '#ff006e', label: 'PAYMENT REJECTED' },
  cancelled: { color: '#4a7a9b', label: 'CANCELLED' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { color, label } = STATUS_STYLES[status] ?? { color: '#4a7a9b', label: status.toUpperCase() };
  return (
    <span
      className="text-[9px] font-mono-cyber uppercase tracking-widest px-2 py-0.5 inline-flex items-center gap-1"
      style={{
        color,
        background: `${color}15`,
        border: `1px solid ${color}44`,
        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      {label}
    </span>
  );
}

export function VerificationBadge({ status }: { status: string }) {
  const styles: Record<string, { color: string; label: string }> = {
    pending: { color: '#ffee00', label: 'PENDING' },
    verified: { color: '#00ff88', label: 'VERIFIED' },
    rejected: { color: '#ff006e', label: 'REJECTED' },
  };
  const { color, label } = styles[status] ?? { color: '#4a7a9b', label: status.toUpperCase() };
  return (
    <span
      className="text-[9px] font-mono-cyber uppercase tracking-widest px-2 py-0.5 inline-flex items-center gap-1"
      style={{
        color,
        background: `${color}15`,
        border: `1px solid ${color}44`,
        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      {label}
    </span>
  );
}
