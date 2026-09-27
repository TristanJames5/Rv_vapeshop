import { RouterProvider } from 'react-router';
import { AppProvider } from './lib/AppContext';
import { AuthProvider } from './lib/auth';
import { CartProvider } from './lib/cart';
import { router } from './router';
import SmokeIntro from './components/SmokeIntro';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';

export default function App() {
  return (
    <AppProvider>
      <CustomCursor />
      <ParticleBackground />
      <SmokeIntro />
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </AppProvider>
  );
}
