'use client';

import OrderStatus from '@/components/orderStatus';
import { calculateTotalItems, calculateTotalAmount } from '@/lib/cartUtils';
import { formatDate } from '@/lib/formatDate';
import { formatNumber } from '@/lib/formatNumber';
import { IOrder } from '@/models/Order.model';
import { IProduct } from '@/models/Product.model';
import {
  Breadcrumbs,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const PriceSection = ({ product }: { product: IProduct }) => {
  if (product.discount > 0) {
    const discountAmount =
      product.price - (product.discount / 100) * product.price;
    return (
      <Stack direction='row' spacing={1} alignItems='center'>
        <Typography variant='body1'>
          ₦{formatNumber(discountAmount.toFixed(0))}
        </Typography>
        <Typography variant='body2' sx={{ textDecoration: 'line-through' }}>
          ₦{formatNumber(product.price.toFixed(0))}
        </Typography>
      </Stack>
    );
  }
  return (
    <Typography variant='body1'>
      ₦{formatNumber(product.price.toFixed(0))}
    </Typography>
  );
};

const OrderDetails = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users once the session status is determined
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?callback=/orders');
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <Stack gap={2} p={{ xs: 1, sm: 4 }}>
        <Typography>Loading order details...</Typography>
      </Stack>
    );
  }

  if (!order) {
    return (
      <Stack gap={2} p={{ xs: 1, sm: 4 }}>
        <Typography>Order not found.</Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={2} p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href='/'>Home</Link>
        <Link href='/orders'>My Orders</Link>
        <Typography>{id}</Typography>
      </Breadcrumbs>

      <Stack gap={1}>
        <Typography variant='body2'>
          {calculateTotalItems(order.cartItems)} items
        </Typography>
        <Typography variant='body2'>
          Placed on {formatDate(new Date(order.createdAt))}
        </Typography>
        <Typography variant='body2'>
          Total: ₦{formatNumber(calculateTotalAmount(order.cartItems))}
        </Typography>
      </Stack>

      <Divider />

      <Typography variant='h6' textTransform='uppercase'>
        Items on your Order
      </Typography>

      <Grid2 container spacing={2}>
        {(
          order.cartItems as unknown as ({
            product: IProduct;
          } & IOrder['cartItems'][0])[]
        ).map(({ product, quantity }) => (
          <Grid2 key={product._id.toString()} size={{ xs: 12, sm: 6 }}>
            <Paper>
              <Grid2 container spacing={2}>
                <Grid2 size={3} sx={{ position: 'relative' }}>
                  <Image
                    src={product.mainPic}
                    alt={product.name}
                    fill
                    objectFit='contain'
                    style={{ padding: '8px' }}
                  />
                </Grid2>
                <Grid2 size={9} p={1}>
                  <OrderStatus status={order.status} />
                  <Typography fontWeight={600}>{product.name}</Typography>
                  <Stack direction='row' gap={1} alignItems='center' mt={1}>
                    {product.variation && (
                      <Typography variant='body2'>
                        Variation: <strong>{product.variation}</strong>
                      </Typography>
                    )}
                    {product.volume && (
                      <Typography variant='body2'>
                        Volume: <strong>{product.volume}</strong>
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant='body2' mt={1}>
                    QTY: <strong>{quantity}</strong>
                  </Typography>
                  <PriceSection product={product} />
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>
        ))}
      </Grid2>

      <Paper sx={{ p: 2 }}>
        <Typography variant='h6' textTransform='uppercase'>
          Payment Information
        </Typography>
        <Typography variant='h6' mt={2}>
          Payment Method
        </Typography>
        <Typography variant='body1' mb={1}>
          {order.paymentMethod === 'cash' ? 'Pay on delivery' : 'Paid online'}
        </Typography>
        <Typography variant='h6' mt={2}>
          Payment Details
        </Typography>
        <Typography variant='body1'>
          Items total: ₦{formatNumber(calculateTotalAmount(order.cartItems))}
        </Typography>
        <Typography variant='body1'>Delivery Fees: Free</Typography>
        <Typography variant='body1' fontWeight={600}>
          Total: ₦{formatNumber(calculateTotalAmount(order.cartItems))}
        </Typography>
      </Paper>
    </Stack>
  );
};

export default OrderDetails;
