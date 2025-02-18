'use client';
import OrderStatus from '@/components/orderStatus';
import { calculateTotalItems, calculateTotalAmount } from '@/lib/cartUtils';
import { formatDate } from '@/lib/formatDate';
import { formatNumber } from '@/lib/formatNumber';
import { IOrder } from '@/models/Order.model';
import { IProduct } from '@/models/Product.model';
import {
  Breadcrumbs,
  Button,
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
  const session = useSession();
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  if (!session) router.push('/login?callback=/orders');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        const order = res.data;
        setOrder(order);
        console.log(order);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  return (
    <Stack gap={2} p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href={'/'}>Home</Link>
        <Link href={'/orders'}>My Orders</Link>
        <Typography>{id}</Typography>
      </Breadcrumbs>
      {order && (
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
          <Divider />
          <Typography variant='h6' textTransform={'uppercase'}>
            Items on your Order
          </Typography>
          <Grid2 container spacing={2}>
            {(
              order.cartItems as unknown as ({
                product: IProduct;
              } & IOrder['cartItems'][0])[]
            ).map(({ product, quantity }) => (
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Paper key={product._id.toString()}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={3} sx={{ position: 'relative' }}>
                      <Image
                        src={product.mainPic}
                        alt={product.name}
                        fill
                        objectFit='contain'
                        style={{
                          padding: '8px',
                        }}
                      />
                    </Grid2>
                    <Grid2 size={9} p={1}>
                      <OrderStatus status={order.status} />
                      <Typography fontWeight={'600'}>{product.name}</Typography>
                      <Stack direction='row' gap={1} alignItems='center'>
                        {product.variation && (
                          <Typography>
                            Variation: <strong>{product.variation}</strong>
                          </Typography>
                        )}
                        {product.volume && (
                          <Typography>
                            Volume: <strong>{product.volume}</strong>
                          </Typography>
                        )}
                      </Stack>
                      <Typography>
                        QTY: <strong>{quantity}</strong>
                      </Typography>
                      <PriceSection product={product} />
                    </Grid2>
                  </Grid2>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
          <Paper sx={{ padding: '8px' }}>
            <Typography variant='h6' textTransform={'uppercase'}>
              Payment Information
            </Typography>
            <Typography variant='h6'>Payment Method</Typography>
            <Typography>
              {order.paymentMethod === 'cash'
                ? 'Pay on delivery'
                : 'Paid online'}
            </Typography>
            <Typography variant='h6'>Payment Details</Typography>
            <Typography>
              Items total: ₦
              {formatNumber(calculateTotalAmount(order.cartItems))}
            </Typography>
            <Typography>Delivery Fees: Free</Typography>
            <Typography>
              Total: ₦{formatNumber(calculateTotalAmount(order.cartItems))}
            </Typography>
          </Paper>
        </Stack>
      )}
    </Stack>
  );
};

export default OrderDetails;
