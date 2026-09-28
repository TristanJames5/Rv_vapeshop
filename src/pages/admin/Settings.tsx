import { useState, useRef } from 'react';
import { Upload, Save, Loader2, CheckCircle, Plus, Trash2, QrCode } from 'lucide-react';
import { useAppData } from '../../lib/AppContext';
import type { PaymentMethod } from '../../lib/types';

export default function Settings() {
  const { shopSettings, updateSettings } = useAppData();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(shopSettings.payment_methods || []);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    updateSettings({
      payment_methods: paymentMethods,
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addMethod = () => {
    setPaymentMethods([...paymentMethods, {
      id: `pm-${Date.now()}`,
      bank_name: '',
      account_name: '',
      account_number: '',
    }]);
  };

  const updateMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(methods => methods.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;
    const url = URL.createObjectURL(file);
    updateMethod(uploadingFor, { qr_image_url: url });
    setUploadingFor(null);
  };

  const inputCls = "w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure the payment methods available to customers at checkout.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium transition-colors ${
            saved ? 'bg-emerald-600 text-white' : 'bg-primary text-primary-foreground hover:bg-accent'
          } disabled:opacity-50`}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {saved ? <><CheckCircle size={14} />Saved!</> : <><Save size={14} />Save Settings</>}
        </button>
      </div>

      <div className="space-y-6">
        {paymentMethods.map((method, index) => (
          <div key={method.id} className="bg-card border border-border rounded p-5 relative">
            <button
              onClick={() => removeMethod(method.id)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
              title="Remove payment method"
            >
              <Trash2 size={18} />
            </button>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              Payment Method {index + 1}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Bank / Wallet Name</label>
                  <input
                    type="text"
                    value={method.bank_name}
                    onChange={(e) => updateMethod(method.id, { bank_name: e.target.value })}
                    placeholder="e.g. GCash, UnionBank"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Account Name</label>
                  <input
                    type="text"
                    value={method.account_name}
                    onChange={(e) => updateMethod(method.id, { account_name: e.target.value })}
                    placeholder="e.g. Juan A. Dela Cruz"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Account Number</label>
                  <input
                    type="text"
                    value={method.account_number}
                    onChange={(e) => updateMethod(method.id, { account_number: e.target.value })}
                    placeholder="e.g. 0917 123 4567"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">QR Code (Optional)</label>
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-32 shrink-0 bg-secondary border border-border rounded overflow-hidden flex items-center justify-center">
                    {method.qr_image_url ? (
                      <img src={method.qr_image_url} alt="QR Code" className="w-full h-full object-cover" />
                    ) : (
                      <QrCode size={40} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadingFor(method.id);
                        fileRef.current?.click();
                      }}
                      className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 border border-border rounded text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    >
                      <Upload size={13} />
                      Upload QR Image
                    </button>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Or paste URL:</p>
                      <input
                        type="url"
                        value={method.qr_image_url || ''}
                        onChange={(e) => updateMethod(method.id, { qr_image_url: e.target.value })}
                        placeholder="https://..."
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addMethod}
          className="w-full py-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Payment Method
        </button>
      </div>
      
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
