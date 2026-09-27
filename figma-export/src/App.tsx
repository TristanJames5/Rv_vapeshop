import { RouterProvider } from 'react-router';
import { AppProvider } from './lib/AppContext';
import { AuthProvider } from './lib/auth';
import { CartProvider } from './lib/cart';
import { router } from './router';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </AppProvider>
  );
}
