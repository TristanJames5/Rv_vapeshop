import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { ShoppingCart, User, LogOut, Menu, X, Package } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/catalog', label: 'All Products' },
    { to: '/catalog?cat=device', label: 'Devices' },
    { to: '/catalog?cat=pod', label: 'Pods' },
    { to: '/catalog?cat=eliquid', label: 'E-Liquids' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/catalog" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl text-primary leading-none">VapeHub</span>
            <span className="font-display text-xl text-foreground leading-none italic">PH</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded hover:bg-secondary transition-colors"
            >
              <ShoppingCart size={18} className="text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              className="hidden md:flex items-center justify-center w-9 h-9 rounded hover:bg-secondary transition-colors"
              title="My Orders"
            >
              <Package size={18} className="text-foreground" />
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border">
              <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                {user?.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-9 h-9 rounded hover:bg-secondary transition-colors"
                title="Sign out"
              >
                <LogOut size={16} className="text-muted-foreground" />
              </button>
            </div>

            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded hover:bg-secondary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-foreground py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{user?.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          VapeHub PH · For adults 18 and over only · DTI-registered vape retailer · Philippines
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1">
          Sale of vaping products to minors is strictly prohibited under Philippine law.
        </p>
      </footer>
    </div>
  );
}
