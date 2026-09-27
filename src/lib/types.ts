export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type OrderStatus =
  | 'pending_payment'
  | 'pending_verification'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'payment_rejected'
  | 'cancelled';

export type ProductCategory = 'device' | 'pod' | 'eliquid' | 'coil' | 'accessory';

export type LogisticsCompany = 'lalamove' | 'lbc';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  birthdate: string;
  id_document_url?: string;
  verification_status: VerificationStatus;
  is_admin: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_qty: number;
  category: ProductCategory;
  brand: string;
  ps_license_no?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  customer_id: string;
  customer?: Profile;
  status: OrderStatus;
  total_amount: number;
  logistics_company: LogisticsCompany;
  detailed_address?: string;
  contact_full_name: string;
  contact_phone: string;
  reference_code: string;
  tracking_no?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment_proof?: PaymentProof;
}

export interface PaymentProof {
  id: string;
  order_id: string;
  image_url: string;
  uploaded_at: string;
  review_status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  review_notes?: string;
  reviewed_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShopSettings {
  instapay_qr_url?: string;
  instapay_account_name?: string;
}
