import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, Eye, EyeOff, Upload, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { calculateAge } from '../lib/format';

type Tab = 'signin' | 'register';

export default function Landing() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('signin');

  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    birthdate: '',
    password: '',
    confirm_password: '',
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
    if (regForm.password !== regForm.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (regForm.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!idFile) {
      setError('Please upload a photo of your government-issued ID.');
      return;
    }
    const age = calculateAge(regForm.birthdate);
    if (age < 18) {
      setError('You must be at least 18 years old to register.');
      return;
    }
    setLoading(true);
    try {
      const id_document_url = URL.createObjectURL(idFile);
      await register(
        {
          full_name: regForm.full_name,
          email: regForm.email,
          phone: regForm.phone,
          birthdate: regForm.birthdate,
          id_document_url,
        },
        regForm.password,
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left brand panel */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 bg-card border-r border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C8842A 0, #C8842A 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10">
          <div className="font-display text-4xl text-primary leading-none">VapeHub</div>
          <div className="font-display text-4xl text-foreground italic leading-none">PH</div>
          <p className="mt-3 text-sm text-muted-foreground">Premium vaping products · Manila</p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="border-l-2 border-primary pl-4">
            <p className="font-display text-2xl text-foreground leading-tight">
              Quality you can trust.
            </p>
            <p className="font-display text-2xl text-primary italic leading-tight">
              Compliance you can count on.
            </p>
          </div>

          <div className="bg-background/60 border border-border rounded p-4 flex gap-3">
            <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">
                Age-Restricted Products
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All products on this platform are exclusively for adults aged 18 and above. A valid
                government-issued ID is required for verification before purchases are approved.
                This is mandated under Philippine law.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Devices', count: '50+' },
              { label: 'E-Liquids', count: '200+' },
              { label: 'Brands', count: '30+' },
            ].map(({ label, count }) => (
              <div key={label} className="border border-border rounded p-3">
                <div className="font-display text-xl text-primary">{count}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[11px] text-muted-foreground/50">
            DTI-registered · Compliant with Republic Act 11900
          </p>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:px-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden mb-8 text-center">
            <div className="font-display text-3xl text-primary leading-none inline">VapeHub </div>
            <div className="font-display text-3xl text-foreground italic leading-none inline">PH</div>
          </div>

          {/* Age warning */}
          <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded p-3 mb-6">
            <AlertTriangle size={14} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-400">
              <span className="font-semibold">18+ only.</span> A valid government ID is required for
              age verification.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex border border-border rounded overflow-hidden mb-6">
            {(['signin', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  tab === t
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 rounded p-3 mb-4">
              <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-400">{error}</p>
            </div>
          )}

          {/* Sign in form */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                    placeholder="••••••••"
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Sign In
              </button>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mt-4">Demo accounts:</p>
                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setSignInForm({ email: 'demo@vape.ph', password: 'demo123' })}
                    className="text-xs text-primary hover:underline block mx-auto"
                  >
                    demo@vape.ph / demo123 (verified customer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignInForm({ email: 'admin@vape.ph', password: 'admin123' })}
                    className="text-xs text-primary hover:underline block mx-auto"
                  >
                    admin@vape.ph / admin123 (admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignInForm({ email: 'pending@vape.ph', password: 'demo123' })}
                    className="text-xs text-primary hover:underline block mx-auto"
                  >
                    pending@vape.ph / demo123 (pending)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={regForm.full_name}
                  onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
                  placeholder="As it appears on your ID"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Date of Birth <span className="text-amber-500">· Must be 18+</span>
                </label>
                <input
                  type="date"
                  required
                  value={regForm.birthdate}
                  onChange={(e) => setRegForm({ ...regForm, birthdate: e.target.value })}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000)
                    .toISOString()
                    .slice(0, 10)}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="09XXXXXXXXX"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={regForm.confirm_password}
                  onChange={(e) => setRegForm({ ...regForm, confirm_password: e.target.value })}
                  placeholder="Repeat password"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Government-issued ID Photo{' '}
                  <span className="text-rose-400">· Required for verification</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`w-full border border-dashed rounded px-3 py-4 text-sm transition-colors flex flex-col items-center gap-2 ${
                    idFile
                      ? 'border-primary/50 bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  <Upload size={18} />
                  {idFile ? (
                    <span className="text-xs">{idFile.name}</span>
                  ) : (
                    <span className="text-xs">
                      UMID, Passport, Driver's License, PhilSys ID, etc.
                    </span>
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Create Account
              </button>
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                By registering you confirm you are 18+ and agree to our terms. Your ID will be
                reviewed by our team within 1–2 business days.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
