import { Metadata } from 'next';

import CartTable from '@/components/shared/cart/cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};

const ShoppingCart = async () => {
  const cart = await getMyCart();
  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
};

export default ShoppingCart;
