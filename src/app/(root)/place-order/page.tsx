import { Metadata } from 'next';
import { getMyCart } from '@/lib/actions/cart.actions';
import { auth } from '@/auth';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PlaceOrderForm from '@/components/shared/order/place-order-form';
import PlaceOrderTable from '@/components/shared/order/place-order-table';
import OrderDetailsTotal from '@/components/shared/order/order-details-total';

export const metadata: Metadata = {
  title: 'Place Order',
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAdrress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className='py-4 text-2xl'>Place Order</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p>{userAdrress.fullName}</p>
              <p>
                {userAdrress.streetAddress}, {userAdrress.city}{' '}
                {userAdrress.postalCode}, {userAdrress.country}{' '}
              </p>
              <div className='mt-3'>
                <Link href={'/shipping-address'}>
                  <Button variant={'outline'}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p>{user.paymentMethod}</p>

              <div className='mt-3'>
                <Link href={'/payment-method'}>
                  <Button variant={'outline'}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>
              <PlaceOrderTable cartItems={cart.items} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <OrderDetailsTotal
                itemsPrice={cart.itemsPrice}
                shippingPrice={cart.shippingPrice}
                taxPrice={cart.taxPrice}
                totalPrice={cart.totalPrice}
              />
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
