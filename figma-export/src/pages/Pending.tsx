import { useNavigate } from 'react-router';
import { Clock, ShieldAlert, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { formatDate } from '../lib/format';

export default function Pending() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isRejected = user.verification_status === 'rejected';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-2xl text-primary inline">VapeHub </div>
          <div className="font-display text-2xl text-foreground italic inline">PH</div>
        </div>

        <div className="bg-card border border-border rounded p-6 space-y-6">
          {isRejected ? (
            <>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <XCircle size={28} className="text-rose-400" />
                </div>
                <div>
                  <h1 className="font-display text-xl text-foreground">Verification Declined</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    We were unable to verify your account.
                  </p>
                </div>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/20 rounded p-4">
                <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
                  Reason
                </p>
                <p className="text-sm text-foreground">
                  The submitted ID could not be verified. Please ensure the photo is clear, fully
                  visible, and matches the name you registered with.
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                To appeal or re-submit, please contact us at{' '}
                <a href="mailto:verify@vapehubph.com" className="text-primary hover:underline">
                  verify@vapehubph.com
                </a>
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Clock size={28} className="text-amber-500" />
                </div>
                <div>
                  <h1 className="font-display text-xl text-foreground">Account Under Review</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your ID verification is in progress.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Name', value: user.full_name },
                  { label: 'Email', value: user.email },
                  { label: 'Mobile', value: user.phone },
                  { label: 'Date of birth', value: formatDate(user.birthdate) },
                  { label: 'Registered', value: formatDate(user.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-border pb-2">
                    <span className="text-muted-foreground text-xs">{label}</span>
                    <span className="text-foreground text-xs font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {user.id_document_url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Submitted ID</p>
                  <img
                    src={user.id_document_url}
                    alt="Submitted government ID"
                    className="w-full rounded border border-border object-cover max-h-40"
                  />
                </div>
              )}

              <div className="bg-muted border border-border rounded p-3 flex gap-3">
                <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">What happens next?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our team reviews submitted IDs within 1–2 business days. You'll be able to
                    browse and purchase once your account is approved. Questions?{' '}
                    <a href="mailto:verify@vapehubph.com" className="text-primary hover:underline">
                      Contact us.
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-border rounded text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
