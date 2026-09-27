import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router';
import { useAppData } from '../lib/AppContext';
import { formatPeso } from '../lib/format';
import { ArrowLeft, Printer } from 'lucide-react';

export default function Invoice() {
  const { id } = useParams();
  const { orders } = useAppData();
  const navigate = useNavigate();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const subtotal = (order.items || []).reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
  const shipping = order.total_amount - subtotal;

  return (
    <div className="min-h-screen bg-white text-black font-sans p-8 md:p-16 max-w-4xl mx-auto">
      {/* Non-printable controls */}
      <div className="print-hide flex justify-between items-center mb-12 pb-4 border-b border-gray-200">
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-500 hover:text-black">
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded">
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      {/* Invoice Document */}
      <div className="bg-white">
        <div className="flex justify-between items-start border-b border-gray-300 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-1 text-black">INVOICE</h1>
            <p className="text-gray-500">Invoice Number: {order.id}</p>
            <p className="text-gray-500">Date: {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-black">RV VAPESHOP INC.</h2>
            <p className="text-gray-600 text-sm mt-1">123 Vape Street, Metro Manila</p>
            <p className="text-gray-600 text-sm">Philippines, 1000</p>
            <p className="text-gray-600 text-sm">contact@rvvapeshop.ph</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
          <p className="text-lg font-bold text-black">{order.contact_full_name}</p>
          <p className="text-gray-700 max-w-xs mt-1 leading-snug">{order.detailed_address}</p>
          <p className="text-gray-700 mt-1">{order.contact_phone}</p>
        </div>

        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="py-3 font-bold text-gray-700 w-1/2">Item Description</th>
              <th className="py-3 font-bold text-gray-700 text-center">Qty</th>
              <th className="py-3 font-bold text-gray-700 text-right">Unit Price</th>
              <th className="py-3 font-bold text-gray-700 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-4 text-black">
                  {item.product?.name || 'Unknown Product'}
                  {item.flavor && <div className="text-sm text-gray-500 mt-1">Flavor: {item.flavor}</div>}
                </td>
                <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                <td className="py-4 text-right text-gray-700">{formatPeso(item.unit_price)}</td>
                <td className="py-4 text-right text-black font-medium">{formatPeso(item.unit_price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPeso(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping ({order.logistics_company.toUpperCase()})</span>
              <span>{formatPeso(shipping)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-300 pt-3 text-lg font-bold text-black">
              <span>Grand Total</span>
              <span>{formatPeso(order.total_amount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Thank you for shopping with RV Vapeshop!</p>
          <p className="mt-1 text-xs">This is a system generated invoice and does not require a signature.</p>
        </div>
      </div>
    </div>
  );
}
