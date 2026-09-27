import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { ShoppingCart, LogOut, Menu, X, Package, Zap, Terminal } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/catalog', label: 'All Products' },
    { to: '/catalog?cat=device', label: 'Devices' },
    { to: '/catalog?cat=pod', label: 'Pods' },
    { to: '/catalog?cat=eliquid', label: 'E-Liquids' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/90 backdrop-blur-md"
        style={{ boxShadow: '0 1px 20px rgba(0,245,255,0.1)' }}>
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/catalog" className="flex items-center gap-2 shrink-0 group">
            <Zap size={20} className="text-primary transition-all group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
            <span className="font-display text-lg text-primary neon-text-cyan">NEON</span>
            <span className="font-display text-lg text-accent" style={{ textShadow: '0 0 8px #ff006e' }}>VAPE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-sm font-display text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                style={location.pathname === link.to.split('?')[0] ? { color: '#00f5ff', textShadow: '0 0 8px #00f5ff' } : {}}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/orders" className="hidden md:flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-primary transition-colors" title="My Orders">
              <Package size={18} />
            </Link>

            <Link to="/cart" className="relative flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-neon-pulse"
                  style={{ boxShadow: '0 0 8px #ff006e' }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border">
              <Terminal size={12} className="text-primary/50" />
              <span className="text-xs font-mono-cyber text-muted-foreground max-w-[100px] truncate">
                {user?.full_name}
              </span>
              <button onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-accent transition-colors" title="Sign out">
                <LogOut size={15} />
              </button>
            </div>

            <button className="md:hidden flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-primary/20 bg-card/90 px-4 py-3 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-sm font-display text-foreground uppercase tracking-wider py-1 hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to="/orders" className="text-sm font-display text-foreground uppercase tracking-wider py-1 hover:text-primary" onClick={() => setMenuOpen(false)}>
              My Orders
            </Link>
            <div className="border-t border-border/30 pt-3 flex items-center justify-between">
              <span className="text-xs font-mono-cyber text-muted-foreground">{user?.full_name}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-primary/10 py-6 px-4 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-6" />
        <p className="text-[10px] font-mono-cyber text-muted-foreground/60 uppercase tracking-widest">
          NEON VAPE PH // 18+ ONLY // DTI-REGISTERED // RA-11900 COMPLIANT
        </p>
        <p className="text-[10px] text-muted-foreground/30 mt-1 font-mono-cyber">
          SALE TO MINORS STRICTLY PROHIBITED UNDER PHILIPPINE LAW
        </p>
      </footer>
    </div>
  );
}
