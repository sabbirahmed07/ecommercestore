import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getOrderById } from '@/lib/actions/order.actions';
import OrderDetailstable from '@/components/shared/order/order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import Stripe from 'stripe';

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  // Redirect the user if they don't own the order
  if (order.userId !== session?.user.id && session?.user.role !== 'admin') {
    return redirect('/unauthorized');
  }

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <>
      <OrderDetailstable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        isAdmin={session?.user.role === 'admin' || false}
        stripeClient_secret={client_secret!}
      />
    </>
  );
};

export default OrderDetailsPage;
