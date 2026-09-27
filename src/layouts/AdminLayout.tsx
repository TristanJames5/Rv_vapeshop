import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, ShieldCheck, Package, ShoppingBag, BarChart2, Settings, LogOut, Menu, X, Zap, Terminal } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useAppData } from '../lib/AppContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/verifications', label: 'ID Verifications', icon: ShieldCheck },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/reports', label: 'Reports', icon: BarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { profiles, orders } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingVerifications = profiles.filter((p) => p.verification_status === 'pending').length;
  const pendingPayments = orders.filter((o) => o.status === 'pending_verification').length;
  const badges: Record<string, number> = {
    '/admin/verifications': pendingVerifications,
    '/admin/orders': pendingPayments,
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-primary" style={{ filter: 'drop-shadow(0 0 4px #00f5ff)' }} />
          <div>
            <div className="font-display text-sm text-primary neon-text-cyan">NEON VAPE</div>
            <div className="text-[10px] font-mono-cyber text-accent uppercase tracking-widest">// Admin Grid</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/admin/dashboard' ? location.pathname === '/admin/dashboard' : location.pathname.startsWith(to);
          const badge = badges[to];
          return (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-display uppercase tracking-wider transition-all ${isActive
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
              style={isActive ? { textShadow: '0 0 8px #00f5ff', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 4px 100%, 0 calc(100% - 4px))' } : {}}>
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              {badge != null && badge > 0 && (
                <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm min-w-[18px] text-center"
                  style={{ boxShadow: '0 0 6px #ff006e' }}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-primary/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 bg-primary/10 border border-primary/30 flex items-center justify-center"
            style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
            <Terminal size={12} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display text-foreground truncate">{user?.full_name}</p>
            <p className="text-[10px] font-mono-cyber text-accent/70">// ADMINISTRATOR</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-accent transition-colors font-display uppercase tracking-wider">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-primary/20"
        style={{ background: 'linear-gradient(180deg, #050d14 0%, #020408 100%)', boxShadow: '2px 0 20px rgba(0,245,255,0.05)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 border-r border-primary/20 flex flex-col"
            style={{ background: '#050d14', boxShadow: '4px 0 30px rgba(0,245,255,0.1)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 border-b border-primary/20 bg-background/90 backdrop-blur-md h-14 flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-primary transition-colors">
            <Menu size={18} />
          </button>
          <span className="font-display text-sm text-primary neon-text-cyan">NEON VAPE ADMIN</span>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-6xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
