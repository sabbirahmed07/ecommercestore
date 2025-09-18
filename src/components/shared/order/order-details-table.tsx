'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import PlaceOrderTable from './place-order-table';
import OrderDetailsTotal from './order-details-total';
import PaymentOrder from './payments/payment-paypal-order';
import CodPaymentOrder from './payments/payment-cod-order';

const OrderDetailstable = ({
  order,
  isAdmin,
}: {
  order: Order;
  isAdmin: boolean;
}) => {
  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    id,
    paidAt,
    deliveredAt,
  } = order;
  return (
    <>
      <h1 className='py-4 text-2xl'>{formatId(id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-4-y overflow-x-auto'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant={'secondary'}>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={'destructive'}>Not Paid</Badge>
              )}
            </CardContent>
          </Card>

          <Card className='my-2'>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p className='mb-2'>{shippingAddress.fullName}</p>
              <p className='mb-2'>
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant={'secondary'}>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={'destructive'}>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>
              <PlaceOrderTable cartItems={orderItems} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <OrderDetailsTotal
                itemsPrice={itemsPrice}
                shippingPrice={shippingPrice}
                taxPrice={taxPrice}
                totalPrice={totalPrice}
              />
              {isPaid && paymentMethod === 'PayPal' && (
                <PaymentOrder
                  orderId={id}
                  paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
                />
              )}

              {isAdmin && paymentMethod === 'CashOnDelivery' && (
                <CodPaymentOrder
                  orderId={id}
                  isDelivered={isDelivered}
                  isPaid={isPaid}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailstable;
