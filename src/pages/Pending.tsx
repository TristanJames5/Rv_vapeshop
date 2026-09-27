import { Clock, CheckCircle, Zap, Terminal } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function Pending() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-md w-full text-center">
        <div className="p-8 relative"
          style={{
            background: '#050d14',
            border: '1px solid rgba(0,245,255,0.2)',
            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
            boxShadow: '0 0 40px rgba(0,245,255,0.1)',
          }}>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: '2px solid #00f5ff', borderLeft: '2px solid #00f5ff' }} />
          <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: '2px solid #00f5ff', borderRight: '2px solid #00f5ff' }} />

          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center animate-neon-pulse"
            style={{
              background: 'rgba(0,245,255,0.1)',
              border: '1px solid rgba(0,245,255,0.4)',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}>
            <Clock size={32} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 8px #00f5ff)' }} />
          </div>

          <h1 className="font-display text-2xl text-primary neon-text-cyan mb-2">VERIFICATION PENDING</h1>
          <p className="text-sm font-mono-cyber text-muted-foreground mb-6 leading-relaxed">
            // Yo, <span className="text-primary">{user?.full_name}</span>!<br />
            Your ID is being reviewed by our team.<br />
            ETA: 1-2 business days.
          </p>

          <div className="space-y-3 mb-6 text-left">
            {[
              { done: true, label: 'Account created' },
              { done: true, label: 'ID document uploaded' },
              { done: false, label: 'Age verification review' },
              { done: false, label: 'Full access granted' },
            ].map(({ done, label }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${done ? '' : 'opacity-30'}`}
                  style={{
                    border: `1px solid ${done ? '#00ff88' : '#0d2840'}`,
                    background: done ? 'rgba(0,255,136,0.1)' : 'transparent',
                    clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
                  }}>
                  {done && <CheckCircle size={12} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 4px #00ff88)' }} />}
                </div>
                <span className={`text-sm font-mono-cyber ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {done ? '// ' : '   '}{label}
                </span>
              </div>
            ))}
          </div>

          <button onClick={logout}
            className="btn-cyber-outline w-full">
            <Terminal size={14} />
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  );
}
