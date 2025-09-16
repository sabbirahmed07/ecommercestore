'use client';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { toast } from 'sonner';

import { Cart, CartItem } from '@/types';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);

        return;
      }
      toast.success(res.message, {
        action: (
          <Button
            className='bg-primary-foreground text-primary hover:bg-gray-800 hover:text-white'
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </Button>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }

      return;
    });
  };

  //check if item is in cart
  const existitem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existitem ? (
    <div>
      <Button type='button' variant={'outline'} onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='h-4 w-4' />
        )}
      </Button>
      <span className='px-2'>{existitem.qty}</span>
      <Button type='button' variant={'outline'} onClick={handleAddToCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='h-4 w-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Plus className='h-4 w-4' />
      )}{' '}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
