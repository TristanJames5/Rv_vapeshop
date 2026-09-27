import { useState, useMemo } from 'react';
import { Download, TrendingUp, ShoppingBag, Users } from 'lucide-react';
import { useAppData } from '../../lib/AppContext';
import { formatPeso, formatDate } from '../../lib/format';

type Range = '7d' | '30d' | '90d' | 'all';

export default function Reports() {
  const { orders, profiles, products } = useAppData();
  const [range, setRange] = useState<Range>('30d');

  const cutoff = useMemo(() => {
    if (range === 'all') return new Date(0);
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return new Date(Date.now() - days * 24 * 3600 * 1000);
  }, [range]);

  const completedOrders = orders.filter(
    (o) =>
      ['processing', 'shipped', 'completed'].includes(o.status) &&
      new Date(o.created_at) >= cutoff,
  );

  const totalRevenue = completedOrders.reduce((s, o) => s + o.total_amount, 0);
  const totalOrders = completedOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const customersCount = profiles.filter((p) => !p.is_admin).length;

  // Best-selling products
  const productSales = new Map<string, { name: string; qty: number; revenue: number }>();
  completedOrders.forEach((order) => {
    (order.items ?? []).forEach((item) => {
      const product = item.product ?? products.find((p) => p.id === item.product_id);
      const name = product?.name ?? item.product_id;
      const existing = productSales.get(item.product_id) ?? { name, qty: 0, revenue: 0 };
      productSales.set(item.product_id, {
        name,
        qty: existing.qty + item.quantity,
        revenue: existing.revenue + item.unit_price * item.quantity,
      });
    });
  });

  const bestSellers = [...productSales.entries()]
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Daily revenue (last 14 days for chart)
  const dayMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 3600 * 1000);
    dayMap.set(d.toDateString(), 0);
  }
  completedOrders.forEach((o) => {
    const key = new Date(o.created_at).toDateString();
    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) ?? 0) + o.total_amount);
    }
  });

  const chartData = [...dayMap.entries()].map(([date, revenue]) => ({
    label: new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }),
    revenue,
  }));

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  // CSV export
  const exportCsv = () => {
    const rows = [
      ['Reference', 'Customer ID', 'Total', 'Status', 'Courier', 'Date'],
      ...completedOrders.map((o) => [
        o.reference_code,
        o.customer_id,
        o.total_amount.toFixed(2),
        o.status,
        o.logistics_company,
        formatDate(o.created_at),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vapehub-orders-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Revenue and sales analytics.</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2.5 border border-border rounded text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Range selector */}
      <div className="flex gap-1">
        {([['7d', '7 days'], ['30d', '30 days'], ['90d', '90 days'], ['all', 'All time']] as const).map(
          ([value, label]) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={`px-4 py-1.5 rounded text-sm transition-colors ${
                range === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: formatPeso(totalRevenue), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Orders', value: totalOrders, icon: ShoppingBag, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Avg Order', value: formatPeso(avgOrderValue), icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Customers', value: customersCount, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded p-4">
            <div className={`w-8 h-8 rounded ${bg} flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <div className="text-xl font-semibold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-card border border-border rounded p-5">
        <h2 className="text-sm font-semibold text-foreground mb-5">Daily Revenue (last 14 days)</h2>
        <div className="flex items-end gap-1.5 h-40">
          {chartData.map(({ label, revenue }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-t relative group"
                style={{ height: `${(revenue / maxRevenue) * 100}%`, minHeight: revenue > 0 ? '4px' : '0' }}
                title={`${label}: ${formatPeso(revenue)}`}
              >
                {revenue > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap text-[10px] bg-card border border-border rounded px-1.5 py-0.5 text-foreground z-10">
                    {formatPeso(revenue)}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-muted-foreground text-center leading-none hidden sm:block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Best sellers */}
      <div className="bg-card border border-border rounded p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Best-Selling Products</h2>
        {bestSellers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No sales in this period.</p>
        ) : (
          <div className="space-y-0 divide-y divide-border">
            {bestSellers.map(({ id, name, qty, revenue }, i) => (
              <div key={id} className="flex items-center gap-4 py-2.5">
                <span className="text-muted-foreground text-sm w-5 shrink-0">{i + 1}</span>
                <span className="flex-1 text-sm text-foreground truncate">{name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{qty} sold</span>
                <span className="text-sm font-medium text-primary shrink-0">{formatPeso(revenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
