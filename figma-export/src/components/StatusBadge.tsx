import type { OrderStatus, VerificationStatus } from '../lib/types';
import { ORDER_STATUS_LABELS } from '../lib/format';

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  pending_verification: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  payment_rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
};

const VERIFICATION_COLORS: Record<VerificationStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${ORDER_STATUS_COLORS[status]}`}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const labels: Record<VerificationStatus, string> = {
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${VERIFICATION_COLORS[status]}`}
    >
      {labels[status]}
    </span>
  );
}
