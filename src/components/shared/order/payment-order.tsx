import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
} from '@/lib/actions/order.actions';
import { toast } from 'sonner';

type Props = {
  isPaid: boolean;
  paymentMethod: 'PayPal' | 'Stripe' | 'CashOnDelivery';
  paypalClientId?: string;
  stripeClientId?: string;
  orderId: string;
};

const PaymentOrder = (props: Props) => {
  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';

    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error Loading PayPal';
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(props.orderId);

    if (!res.success) {
      toast.error(res.message);
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(props.orderId, data);

    toast[!res.success ? 'error' : 'success'](res.message);
  };

  return (
    <>
      {!props.isPaid && props.paymentMethod === 'PayPal' && (
        <div>
          <PayPalScriptProvider options={{ clientId: props.paypalClientId! }}>
            <PrintLoadingState />
            <PayPalButtons
              createOrder={handleCreatePayPalOrder}
              onApprove={handleApprovePayPalOrder}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </>
  );
};

export default PaymentOrder;
