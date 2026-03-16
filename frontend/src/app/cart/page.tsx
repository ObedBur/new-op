
import { CartView } from '@/features/cart/components/CartView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Panier | Marketplace Africain',
  description: 'Gérez vos articles et finalisez votre commande sur Marketplace Africain.',
};

export default function CartPage() {
  return (
    <main className="min-h-screen pt-20">
      <CartView />
    </main>
  );
}
