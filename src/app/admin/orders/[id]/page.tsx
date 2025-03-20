'use client';

import OrderStatus from '@/components/orderStatus';
import { useAppSelector } from '@/hooks/redux.hook';
import { calculateTotalItems, calculateTotalAmount } from '@/lib/cartUtils';
import { formatDate } from '@/lib/formatDate';
import { formatNumber } from '@/lib/formatNumber';
import { IOrder } from '@/models/Order.model';
import { IProduct } from '@/models/Product.model';
import { getBrandById } from '@/redux/brandSlice';
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const PriceSection = ({ product }: { product: IProduct | null }) => {
  if (!product) return;
  if (product.discount > 0) {
    const discountAmount =
      product.price - (product.discount / 100) * product.price;
    return (
      <Stack direction='row' spacing={1} alignItems='center'>
        <Typography>₦{formatNumber(discountAmount.toFixed(0))}</Typography>
        <Typography variant='body2' sx={{ textDecoration: 'line-through' }}>
          ₦{formatNumber(product.price.toFixed(0))}
        </Typography>
      </Stack>
    );
  }
  return <Typography>₦{formatNumber(product.price.toFixed(0))}</Typography>;
};

const OrderDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const Brand = useAppSelector((state) => state.brand);

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

  const setStatus = async (
    status: 'processing' | 'shipped' | 'delivered' | 'canceled',
  ) => {
    try {
      const res = await axios.patch(`/api/admin/orders/${id}`, { status });
      setOrder(res.data);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <Link href='/admin'>Admin</Link>
        <Link href='/admin/orders'>Manage Orders</Link>
        <Typography>{id}</Typography>
      </Breadcrumbs>

      <Grid2 container>
        <Grid2 size={{ xs: 12, sm: 6 }} gap={1}>
          <Typography variant='body2'>
            {calculateTotalItems(order.cartItems)} items
          </Typography>
          <Typography variant='body2'>
            Placed on {formatDate(new Date(order.createdAt))}
          </Typography>
          <Typography variant='body2'>
            Total: ₦{formatNumber(calculateTotalAmount(order.cartItems))}
          </Typography>

          <OrderStatus status={order.status} />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }} gap={4}>
          <Typography variant='h6' textAlign='center'>
            Actions
          </Typography>
          <ButtonGroup
            variant='contained'
            sx={{
              display: 'flex',
              gap: 1,
              width: 'fit-content',
            }}
          >
            <Button
              onClick={() => setStatus('processing')}
              disabled={order.status === 'processing'}
            >
              Mark as Processing
            </Button>
            <Button
              onClick={() => setStatus('shipped')}
              disabled={order.status === 'shipped'}
            >
              Mark as Shipped
            </Button>
            <Button
              onClick={() => setStatus('delivered')}
              disabled={order.status === 'delivered'}
            >
              Mark as Delivered
            </Button>
          </ButtonGroup>
        </Grid2>
      </Grid2>

      <Divider />

      <Typography variant='h6' textTransform='uppercase'>
        Items
      </Typography>

      <Grid2 container spacing={2}>
        {(
          order.cartItems as unknown as ({
            product: IProduct;
          } & IOrder['cartItems'][0])[]
        ).map(({ product, quantity }) => (
          <Grid2
            key={product?._id.toString()}
            size={{ xs: 12, sm: 6 }}
            onClick={() => router.push(`/products/${product?._id}`)}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Paper>
              <Grid2 container spacing={2}>
                <Grid2 size={3} sx={{ position: 'relative' }}>
                  <Image
                    src={product?.mainPic}
                    alt={product?.name}
                    fill
                    objectFit='contain'
                    style={{ padding: '8px' }}
                  />
                </Grid2>
                <Grid2 size={9} p={1}>
                  <Typography fontWeight={600}>{product?.name}</Typography>
                  <Typography variant='body2'>
                    Brand:{' '}
                    {
                      getBrandById({ brand: Brand }, product?.brand.toString())
                        ?.name
                    }
                  </Typography>
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

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' textTransform='uppercase'>
              Payment Information
            </Typography>
            <Typography variant='h6' mt={2}>
              Payment Method
            </Typography>
            <Typography mb={1}>
              {order.paymentMethod === 'cash'
                ? 'Pay on delivery'
                : 'Paid online'}
            </Typography>
            {order.paymentMethod !== 'cash' && (
              <Typography mb={1}>
                Payment Reference: {order.paymentReference}
              </Typography>
            )}
            <Typography variant='h6' mt={2}>
              Payment Details
            </Typography>
            <Typography>
              Items total: ₦
              {formatNumber(calculateTotalAmount(order.cartItems))}
            </Typography>
            <Typography>Delivery Fees: Free</Typography>
            <Typography fontWeight={600}>
              Total: ₦{formatNumber(calculateTotalAmount(order.cartItems))}
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' textTransform='uppercase'>
              Shipment Information
            </Typography>
            <Typography variant='h6' mt={2}>
              Address
            </Typography>
            <Typography mb={1}>
              {order.shipmentInfo?.address}, {order.shipmentInfo?.city}
            </Typography>
            <Typography variant='h6' mt={2}>
              Contact
            </Typography>
            <Typography>Name: {order.shipmentInfo?.name}</Typography>
            <Typography>Phone: {order.shipmentInfo?.phoneNumber}</Typography>
            <Typography>Email: {order.shipmentInfo?.email}</Typography>
          </Paper>
        </Grid2>
      </Grid2>
    </Stack>
  );
};

export default OrderDetails;
