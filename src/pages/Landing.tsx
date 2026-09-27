import { useState, useRef } from 'react';
import { AlertTriangle, Eye, EyeOff, Upload, Loader2, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { calculateAge } from '../lib/format';

type Tab = 'signin' | 'register';

export default function Landing() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>('signin');
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    full_name: '', email: '', phone: '', birthdate: '', password: '', confirm_password: '',
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(signInForm.email, signInForm.password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regForm.password !== regForm.confirm_password) { setError('Passwords do not match.'); return; }
    if (regForm.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!idFile) { setError('Please upload a photo of your government-issued ID.'); return; }
    const age = calculateAge(regForm.birthdate);
    if (age < 18) { setError('You must be at least 18 years old to register.'); return; }
    setLoading(true);
    try {
      const id_document_url = URL.createObjectURL(idFile);
      await register({ full_name: regForm.full_name, email: regForm.email, phone: regForm.phone, birthdate: regForm.birthdate, id_document_url }, regForm.password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left cyberpunk brand panel */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 overflow-hidden scanlines">
        {/* Animated grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={32} className="text-primary" style={{ filter: 'drop-shadow(0 0 8px #00f5ff)' }} />
            <div>
              <div className="font-display text-4xl text-primary leading-none animate-flicker neon-text-cyan">NEON</div>
              <div className="font-display text-4xl text-accent leading-none" style={{ textShadow: '0 0 10px #ff006e' }}>VAPE</div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-mono-cyber tracking-widest mt-2 uppercase">// Premium Vaping — Manila Grid</p>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-6">
          <div className="border-l-2 border-primary pl-4" style={{ boxShadow: '-4px 0 16px #00f5ff44' }}>
            <p className="font-display text-xl text-foreground leading-tight">QUALITY YOU CAN</p>
            <p className="font-display text-xl text-primary leading-tight neon-text-cyan">TRUST.</p>
            <p className="font-display text-xl text-foreground leading-tight">COMPLIANCE YOU</p>
            <p className="font-display text-xl text-accent leading-tight" style={{ textShadow: '0 0 10px #ff006e' }}>COUNT ON.</p>
          </div>

          <div className="bg-background/40 border border-amber-400/30 p-4 relative" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-400" />
            <div className="flex gap-3">
              <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }} />
              <div>
                <p className="text-xs font-display text-amber-400 uppercase tracking-widest mb-1">// Age-Restricted</p>
                <p className="text-xs text-muted-foreground leading-relaxed">18+ only. Valid government ID required. Mandated under Philippine law (RA 11900).</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[{ label: 'Devices', count: '50+' }, { label: 'E-Liquids', count: '200+' }, { label: 'Brands', count: '30+' }].map(({ label, count }) => (
              <div key={label} className="border border-primary/30 p-3 text-center relative" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)', background: 'rgba(0,245,255,0.03)' }}>
                <div className="font-display text-xl text-primary neon-text-cyan">{count}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] text-muted-foreground/40 font-mono-cyber">DTI-REGISTERED // RA-11900 COMPLIANT // PH-GRID</p>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:px-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="md:hidden mb-8 text-center">
            <div className="font-display text-3xl text-primary neon-text-cyan inline">NEON </div>
            <div className="font-display text-3xl text-accent inline" style={{ textShadow: '0 0 10px #ff006e' }}>VAPE</div>
          </div>

          {/* HUD label */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="text-[10px] font-mono-cyber text-primary/60 uppercase tracking-widest">// SECURE ACCESS</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          {/* Age warning */}
          <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/30 p-3 mb-5" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
            <AlertTriangle size={14} className="text-amber-400 shrink-0" />
            <p className="text-xs text-amber-400"><span className="font-display">18+ ONLY.</span> Valid government ID required.</p>
          </div>

          {/* Tab switcher */}
          <div className="flex border border-primary/30 mb-5 relative" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
            {(['signin', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 text-xs font-display uppercase tracking-widest transition-all ${tab === t ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'}`}
                style={tab === t ? { boxShadow: '0 0 16px #00f5ff66' } : {}}
              >
                {t === 'signin' ? '// Sign In' : '// Register'}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-accent/10 border border-accent/30 p-3 mb-4" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
              <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-accent">{error}</p>
            </div>
          )}

          {/* Sign in form */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// Email</label>
                <input type="email" required value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                  placeholder="operator@neon.ph" className="cyber-input" />
              </div>
              <div>
                <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required value={signInForm.password}
                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                    placeholder="••••••••" className="cyber-input pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-cyber w-full">
                {loading && <Loader2 size={14} className="animate-spin" />}
                INITIALIZE SESSION
              </button>
              <div className="text-center border-t border-border/30 pt-4">
                <p className="text-[10px] font-mono-cyber text-muted-foreground mb-2">// DEMO ACCOUNTS</p>
                <div className="space-y-1">
                  {[
                    { email: 'demo@vape.ph', pass: 'demo123', label: 'demo@vape.ph — verified customer' },
                    { email: 'admin@vape.ph', pass: 'admin123', label: 'admin@vape.ph — administrator' },
                    { email: 'pending@vape.ph', pass: 'demo123', label: 'pending@vape.ph — pending' },
                  ].map(({ email, pass, label }) => (
                    <button key={email} type="button"
                      onClick={() => setSignInForm({ email, password: pass })}
                      className="text-[11px] text-primary/70 hover:text-primary hover:underline block mx-auto transition-colors font-mono-cyber">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              {[
                { label: 'Full Name', type: 'text', key: 'full_name', placeholder: 'As it appears on your ID' },
              ].map(({ label, type, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// {label}</label>
                  <input type={type} required value={(regForm as any)[key]}
                    onChange={(e) => setRegForm({ ...regForm, [key]: e.target.value })}
                    placeholder={placeholder} className="cyber-input" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// Date of Birth <span className="text-amber-400">· 18+ REQUIRED</span></label>
                <input type="date" required value={regForm.birthdate}
                  onChange={(e) => setRegForm({ ...regForm, birthdate: e.target.value })}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().slice(0, 10)}
                  className="cyber-input" style={{ colorScheme: 'dark' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// Email</label>
                  <input type="email" required value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} placeholder="you@neon.ph" className="cyber-input" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// Mobile</label>
                  <input type="tel" required value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} placeholder="09XXXXXXXXX" className="cyber-input" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// Password</label>
                <input type="password" required minLength={8} value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} placeholder="Min. 8 characters" className="cyber-input" />
              </div>
              <div>
                <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// Confirm Password</label>
                <input type="password" required value={regForm.confirm_password} onChange={(e) => setRegForm({ ...regForm, confirm_password: e.target.value })} placeholder="Repeat password" className="cyber-input" />
              </div>
              <div>
                <label className="block text-[10px] font-mono-cyber text-primary/70 uppercase tracking-widest mb-1.5">// ID Document <span className="text-accent">· REQUIRED</span></label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setIdFile(e.target.files?.[0] ?? null)} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className={`w-full border border-dashed p-4 flex flex-col items-center gap-2 transition-all ${idFile ? 'border-primary/60 bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                  <Upload size={18} />
                  <span className="text-xs font-mono-cyber">{idFile ? idFile.name : 'UMID / Passport / Driver\'s License'}</span>
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-cyber w-full">
                {loading && <Loader2 size={14} className="animate-spin" />}
                CREATE PROFILE
              </button>
              <p className="text-[10px] text-muted-foreground text-center font-mono-cyber leading-relaxed">
                // By registering you confirm 18+ status. ID reviewed within 1-2 business days.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
