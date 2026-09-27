export const formatPeso = (amount: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const calculateAge = (birthdate: string): number => {
  const birth = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export const generateRefCode = (): string => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `VPH-${date}-${rand}`;
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Awaiting Payment',
  pending_verification: 'Payment Under Review',
  processing: 'Processing',
  shipped: 'Shipped',
  completed: 'Completed',
  payment_rejected: 'Payment Rejected',
  cancelled: 'Cancelled',
};

export const CATEGORY_LABELS: Record<string, string> = {
  device: 'Devices',
  pod: 'Pods',
  eliquid: 'E-Liquids',
  coil: 'Coils',
  accessory: 'Accessories',
};
