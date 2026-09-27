import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Search, ShieldCheck } from 'lucide-react';
import { useAppData } from '../../lib/AppContext';
import { VerificationBadge } from '../../components/StatusBadge';
import { formatDate, calculateAge } from '../../lib/format';
import type { VerificationStatus } from '../../lib/types';

export default function IDQueue() {
  const { profiles } = useAppData();
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [search, setSearch] = useState('');

  const customers = profiles.filter((p) => !p.is_admin);

  const filtered = customers.filter((p) => {
    if (filter !== 'all' && p.verification_status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: customers.length,
    pending: customers.filter((p) => p.verification_status === 'pending').length,
    verified: customers.filter((p) => p.verification_status === 'verified').length,
    rejected: customers.filter((p) => p.verification_status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">ID Verifications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review submitted government IDs and approve or reject customer accounts.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border pb-0 -mb-px overflow-x-auto">
        {(['pending', 'verified', 'rejected', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px whitespace-nowrap transition-colors ${
              filter === status
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-[10px] text-muted-foreground">({counts[status]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <ShieldCheck size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No accounts found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((profile) => (
            <Link
              key={profile.id}
              to={`/admin/verifications/${profile.id}`}
              className="flex items-center gap-4 bg-card border border-border rounded p-4 hover:border-primary/30 hover:bg-secondary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-foreground">
                  {profile.full_name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <p className="text-sm text-foreground truncate">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="text-sm text-foreground">{calculateAge(profile.birthdate)}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="text-sm text-foreground">{formatDate(profile.created_at)}</p>
                </div>
                <div>
                  <VerificationBadge status={profile.verification_status} />
                  {!profile.id_document_url && (
                    <p className="text-[10px] text-muted-foreground mt-1">No ID uploaded</p>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
