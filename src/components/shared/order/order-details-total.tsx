'use client';
import { formatCurrency } from '@/lib/utils';
import PaymentOrder from './payment-order';

type Props = {
  itemsPrice: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
};

const OrderDetailsTotal = ({
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
}: Props) => {
  return (
    <>
      <div className='flex items-center'>
        <div>Items </div>
        <div>{formatCurrency(itemsPrice)}</div>
      </div>
      <div className='flex items-center'>
        <div>Tax </div>
        <div> {formatCurrency(taxPrice)}</div>
      </div>
      <div className='flex items-center'>
        <div>Shipping </div>
        <div>{formatCurrency(shippingPrice)}</div>
      </div>

      <div className='flex items-center'>
        <div>Total </div>
        <div>{formatCurrency(totalPrice)}</div>
      </div>
    </>
  );
};

export default OrderDetailsTotal;
