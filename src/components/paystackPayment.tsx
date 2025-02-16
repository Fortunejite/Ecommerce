import { Button, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import SimpleSnackbar from './snackbar';

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface Props {
  email: string;
  amount: number;
  onSuccess: (response: { reference: string }) => void;
  validateForm: () => boolean;
  loading: boolean;
}

const PayBtn = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    position: 'sticky',
    bottom: 0,
    display: 'block',
  },
}));

const PaystackPayment = ({
  email,
  amount,
  onSuccess,
  validateForm,
  loading,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payWithPaystack = () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('Paystack public key is required');
    }
    if (!validateForm()) return;
    if (typeof window !== 'undefined' && window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: amount * 100, // Paystack works with kobo (multiply by 100)
        currency: 'NGN',
        callback: function (response: { reference: string }) {
          onSuccess(response);
        },
        onClose: function () {
          setMessage('Transaction was not completed.');
          setOpen(true);
        },
      });

      handler.openIframe();
    } else {
      setMessage('Paystack is not loaded. Please try again.');
      setOpen(true);
    }
  };

  return (
    <>
      <PayBtn
        size={'large'}
        onClick={payWithPaystack}
        variant='contained'
        fullWidth
        disabled={loading}
      >
        {loading ? 'Processing Order' : 'Pay Now'}
      </PayBtn>
      <SimpleSnackbar open={open} setOpen={setOpen} message={message} />
    </>
  );
};

export default PaystackPayment;
