import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  updateOrderToPaidCOD,
  deliverOrder,
} from '@/lib/actions/order.actions';
import { toast } from 'sonner';

const CodPaymentOrder = ({
  orderId,
  isPaid,
  isDelivered,
}: {
  orderId: string;
  isPaid: boolean;
  isDelivered: boolean;
}) => {
  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(orderId);
            toast[res.success ? 'success' : 'error'](res.message);
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Paid'}
      </Button>
    );
  };

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(orderId);
            toast[res.success ? 'success' : 'error'](res.message);
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Delivered'}
      </Button>
    );
  };

  return (
    <div>
      {!isPaid && <MarkAsPaidButton />}
      {isPaid && !isDelivered && <MarkAsDeliveredButton />}
    </div>
  );
};

export default CodPaymentOrder;
