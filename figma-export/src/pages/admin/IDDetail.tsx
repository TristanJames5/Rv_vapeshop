import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useAppData } from '../../lib/AppContext';
import { VerificationBadge } from '../../components/StatusBadge';
import { formatDate, calculateAge } from '../../lib/format';

export default function IDDetail() {
  const { id } = useParams<{ id: string }>();
  const { profiles, updateProfile } = useAppData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const profile = profiles.find((p) => p.id === id);

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Profile not found.</p>
        <Link to="/admin/verifications" className="text-primary hover:underline text-sm">
          Back to queue
        </Link>
      </div>
    );
  }

  const handleVerify = async (status: 'verified' | 'rejected' | 'pending') => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile(profile.id, { verification_status: status });
    navigate('/admin/verifications');
  };

  const age = calculateAge(profile.birthdate);
  const isMinor = age < 18;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          to="/admin/verifications"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to queue
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-foreground">{profile.full_name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Submitted {formatDate(profile.created_at)}</p>
          </div>
          <VerificationBadge status={profile.verification_status} />
        </div>
      </div>

      {/* Profile details */}
      <div className="bg-card border border-border rounded p-5">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Account Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: User, label: 'Full Name', value: profile.full_name },
            {
              icon: Calendar,
              label: 'Date of Birth',
              value: `${formatDate(profile.birthdate)} (Age ${age})`,
              highlight: isMinor ? 'text-rose-400' : undefined,
            },
            { icon: Mail, label: 'Email', value: profile.email },
            { icon: Phone, label: 'Mobile', value: profile.phone },
          ].map(({ icon: Icon, label, value, highlight }) => (
            <div key={label} className="flex items-start gap-2.5">
              <Icon size={14} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
                <p className={`text-sm mt-0.5 ${highlight ?? 'text-foreground'}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {isMinor && (
          <div className="mt-4 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded p-3">
            <XCircle size={14} className="text-rose-400" />
            <p className="text-xs text-rose-400 font-semibold">
              This applicant is under 18. Do not approve.
            </p>
          </div>
        )}
      </div>

      {/* ID document */}
      <div className="bg-card border border-border rounded p-5">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Government ID Photo
        </h2>
        {profile.id_document_url ? (
          <img
            src={profile.id_document_url}
            alt="Submitted government ID"
            className="w-full max-h-80 object-contain rounded border border-border bg-secondary"
          />
        ) : (
          <div className="py-10 text-center border border-dashed border-border rounded">
            <p className="text-sm text-muted-foreground">No ID document was uploaded.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {profile.verification_status === 'pending' && (
        <div className="flex gap-3">
          <button
            disabled={loading || isMinor || !profile.id_document_url}
            onClick={() => handleVerify('verified')}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded text-sm font-medium hover:bg-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle size={14} />
            )}
            Approve Account
          </button>
          <button
            disabled={loading}
            onClick={() => handleVerify('rejected')}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white py-3 rounded text-sm font-medium hover:bg-rose-500 transition-colors disabled:opacity-40"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <XCircle size={14} />
            )}
            Reject Account
          </button>
        </div>
      )}

      {profile.verification_status !== 'pending' && (
        <div className="bg-secondary border border-border rounded p-4 text-center">
          <p className="text-sm text-muted-foreground">
            This account has already been{' '}
            <span
              className={
                profile.verification_status === 'verified' ? 'text-emerald-400' : 'text-rose-400'
              }
            >
              {profile.verification_status}
            </span>
            .
          </p>
          <button
            onClick={() => handleVerify('pending')}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Reset to pending
          </button>
        </div>
      )}
    </div>
  );
}
