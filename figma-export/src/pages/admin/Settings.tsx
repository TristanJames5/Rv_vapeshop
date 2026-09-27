import { useState, useRef } from 'react';
import { Upload, Save, Loader2, CheckCircle, QrCode } from 'lucide-react';
import { useAppData } from '../../lib/AppContext';

export default function Settings() {
  const { shopSettings, updateSettings } = useAppData();
  const [form, setForm] = useState({
    instapay_account_name: shopSettings.instapay_account_name ?? '',
    instapay_qr_url: shopSettings.instapay_qr_url ?? '',
  });
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    const url = URL.createObjectURL(file);
    setQrPreview(url);
    setForm((f) => ({ ...f, instapay_qr_url: url }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    updateSettings({
      instapay_account_name: form.instapay_account_name,
      instapay_qr_url: form.instapay_qr_url,
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls =
    'w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring';

  const currentQr = qrPreview ?? shopSettings.instapay_qr_url;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-display text-3xl text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your InstaPay details shown to customers at checkout.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* QR Code */}
        <div className="bg-card border border-border rounded p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">InstaPay QR Code</h2>

          <div className="flex gap-5 items-start">
            <div className="w-32 h-32 shrink-0 bg-secondary border border-border rounded overflow-hidden flex items-center justify-center">
              {currentQr ? (
                <img src={currentQr} alt="QR Code" className="w-full h-full object-cover" />
              ) : (
                <QrCode size={40} className="text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Account Name</label>
                <input
                  type="text"
                  value={form.instapay_account_name}
                  onChange={(e) => setForm({ ...form, instapay_account_name: e.target.value })}
                  placeholder="e.g. VapeHub PH — Juan A. Dela Cruz"
                  className={inputCls}
                />
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-xs px-3 py-2 border border-border rounded text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <Upload size={13} />
                {qrFile ? qrFile.name : 'Upload new QR image'}
              </button>
            </div>
          </div>
        </div>

        {/* QR URL fallback */}
        <div className="bg-card border border-border rounded p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">QR Image URL (optional)</h2>
          <p className="text-xs text-muted-foreground mb-3">
            If you prefer to link an externally hosted QR image instead of uploading.
          </p>
          <input
            type="url"
            value={form.instapay_qr_url}
            onChange={(e) => setForm({ ...form, instapay_qr_url: e.target.value })}
            placeholder="https://…"
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded text-sm font-medium transition-colors ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-primary text-primary-foreground hover:bg-accent'
          } disabled:opacity-50`}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {saved ? (
            <>
              <CheckCircle size={14} />
              Saved!
            </>
          ) : (
            <>
              <Save size={14} />
              Save Settings
            </>
          )}
        </button>
      </form>

      {/* Preview */}
      <div className="bg-card border border-border rounded p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Checkout Preview</h2>
        <p className="text-xs text-muted-foreground mb-4">
          This is how the payment step appears to customers.
        </p>
        <div className="border border-border rounded p-4 bg-background flex flex-col items-center gap-3">
          <div className="w-28 h-28 bg-secondary border border-border rounded overflow-hidden flex items-center justify-center">
            {currentQr ? (
              <img src={currentQr} alt="QR preview" className="w-full h-full object-cover" />
            ) : (
              <QrCode size={32} className="text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
              InstaPay Account
            </p>
            <p className="text-sm font-semibold text-foreground">
              {form.instapay_account_name || '(Account name not set)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
