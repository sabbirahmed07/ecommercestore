'use client';

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Loader, Check } from 'lucide-react';
import { createOrder } from '@/lib/actions/order.actions';
import { Button } from '@/components/ui/button';

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className='w-full' disabled={pending}>
        {pending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Check className='w-4 h-4' />
        )}{' '}
        Place Order
      </Button>
    );
  };

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
