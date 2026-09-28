import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function cleanDB() {
  console.log('Cleaning up Supabase products...');
  
  // We'll delete all products, then re-seed using seed.js
  const { data: allProducts, error: fetchErr } = await supabase.from('products').select('id');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    return;
  }
  
  if (allProducts && allProducts.length > 0) {
    const ids = allProducts.map(p => p.id);
    console.log(`Found ${ids.length} products. Deleting them all to reset...`);
    const { error: delErr } = await supabase.from('products').delete().in('id', ids);
    if (delErr) {
      console.error('Delete error:', delErr);
    } else {
      console.log('Successfully deleted all old products.');
    }
  } else {
    console.log('No products found to delete.');
  }
}

cleanDB();
