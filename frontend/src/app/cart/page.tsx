
import { CartView } from '@/features/cart/components/CartView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Panier | Marketplace Africain',
  description: 'Gérez vos articles et finalisez votre commande sur Marketplace Africain.',
};

export default function CartPage() {
  return (
    <main className="flex-1 pt-24 pb-20 bg-[#F9F6F1]/50">
      <CartView />
    </main>
  );
}
