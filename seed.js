import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Vaporesso XROS 3 Nano',
    description: 'Ultra-portable pod system with 1000mAh battery and adjustable airflow for smooth, satisfying vapor.',
    price: 1299,
    stock_qty: 25,
    category: 'device',
    brand: 'Vaporesso',
    ps_license_no: 'PS-2024-001',
    image_url: '/products/139ac773-7a4f-414e-a729-6b6d293700d3.jpg',
    is_active: true,
  },
  {
    id: 'prod-002',
    name: 'SMOK Nord 5',
    description: 'Next-gen pod system with 2000mAh battery, adjustable wattage, and stunning LED display.',
    price: 1899,
    stock_qty: 18,
    category: 'device',
    brand: 'SMOK',
    ps_license_no: 'PS-2024-002',
    image_url: '/products/448ace29-5d4d-4709-ae48-e439c1c9fa38.jpg',
    is_active: true,
  },
  {
    id: 'prod-003',
    name: 'GeekVape Aegis Legend 3',
    description: 'Military-grade waterproof, dustproof, and shockproof mod. 200W max output with dual 18650 batteries.',
    price: 3499,
    stock_qty: 10,
    category: 'device',
    brand: 'GeekVape',
    ps_license_no: 'PS-2024-003',
    image_url: '/products/5820dcf0-4486-42b8-97a9-ec5c6e14f0e1.jpg',
    is_active: true,
  },
  {
    id: 'prod-004',
    name: 'Vaporesso XROS Pro Pod',
    description: 'Compatible with XROS series, 2ml capacity, 0.6Ω mesh coil for rich, warm vapor.',
    price: 349,
    stock_qty: 50,
    category: 'pod',
    brand: 'Vaporesso',
    image_url: '/products/60344611-413c-4f88-b7c3-6f07ca114794.jpg',
    is_active: true,
  },
  {
    id: 'prod-005',
    name: 'SMOK Nord RPM Pod 3ml',
    description: 'Replacement pod for SMOK Nord series. 3ml capacity with leak-resistant design.',
    price: 299,
    stock_qty: 40,
    category: 'pod',
    brand: 'SMOK',
    image_url: '/products/8bca6b67-c9ea-46ab-b8d6-db050052ae25.jpg',
    is_active: true,
  },
  {
    id: 'prod-006',
    name: 'Naked 100 — Hawaiian POG 60ml',
    description: 'Tropical blend of passion fruit, orange, and guava. 3mg nicotine, 70VG/30PG.',
    price: 699,
    stock_qty: 30,
    category: 'eliquid',
    brand: 'Naked 100',
    image_url: '/products/93277486-5438-4972-819d-1268160e2e78.jpg',
    is_active: true,
  },
  {
    id: 'prod-007',
    name: 'Dinner Lady — Lemon Tart 60ml',
    description: 'Award-winning lemon curd tart with flaky pastry finish. 3mg/6mg options.',
    price: 749,
    stock_qty: 22,
    category: 'eliquid',
    brand: 'Dinner Lady',
    image_url: '/products/aba0f187-ea39-4030-8067-1dfa2ba54612.jpg',
    is_active: true,
  },
  {
    id: 'prod-008',
    name: 'Saltnic by Naked 100 — Lava Flow 30ml',
    description: 'Strawberry, coconut, and pineapple salt nic. 25mg/50mg options. Smooth throat hit.',
    price: 499,
    stock_qty: 35,
    category: 'eliquid',
    brand: 'Naked 100',
    image_url: '/products/bd680d2a-f643-4103-a534-88e332b3cfd8.jpg',
    is_active: true,
  },
  {
    id: 'prod-009',
    name: 'Vaporesso GT Mesh Coil 0.18Ω (3pcs)',
    description: 'Large surface area mesh coil for intense flavor and vapor production. Compatible with SKRR/NRG tanks.',
    price: 459,
    stock_qty: 60,
    category: 'coil',
    brand: 'Vaporesso',
    image_url: '/products/c1c5ecae-ee04-4d7a-a5c0-6a60ddd30f32.jpg',
    is_active: true,
  },
  {
    id: 'prod-010',
    name: 'SMOK V8-X4 Coil (5pcs)',
    description: 'Quad-coil configuration for massive cloud production. 0.15Ω resistance.',
    price: 399,
    stock_qty: 45,
    category: 'coil',
    brand: 'SMOK',
    image_url: '/products/e7df1948-f338-4cd9-97c5-a6e6c76e36a4.jpg',
    is_active: true,
  },
  {
    id: 'prod-011',
    name: 'MOLICEL P26A 18650 Battery (2pcs)',
    description: 'High-drain 18650 cells, 2600mAh, 35A continuous discharge. Top-rated for high-wattage mods.',
    price: 599,
    stock_qty: 20,
    category: 'accessory',
    brand: 'MOLICEL',
    image_url: '/products/e851d1cd-b072-41bb-bfc8-15eec766ee47.jpg',
    is_active: true,
  }
];

async function seed() {
  console.log('Seeding products...');
  const { data, error } = await supabase.from('products').upsert(MOCK_PRODUCTS);
  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log('Successfully seeded products.');
  }
  
  // Seed settings
  const { error: setErr } = await supabase.from('shop_settings').upsert({
    id: 1,
    instapay_account_name: 'VapeHub PH (GCash)'
  });
  if (setErr) {
    console.error('Error seeding settings:', setErr);
  } else {
    console.log('Successfully seeded settings.');
  }
}

seed();
