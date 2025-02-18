'use client';

import OrderStatus from '@/components/orderStatus';
import { errorHandler } from '@/lib/errorHandler';
import { IOrder } from '@/models/Order.model';
import { IProduct } from '@/models/Product.model';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid2,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

const OrderElement = ({ order }: { order: IOrder }) => {
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const { trackingId, status } = order;
  const cartItems = order.cartItems as unknown as ({
    product: IProduct;
  } & IOrder['cartItems'][0])[];

  return cartItems.map(({ product, quantity }) => (
    <Paper key={product._id.toString()}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 3, sm: 2 }} sx={{ position: 'relative' }}>
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
        <Grid2
          size={{ xs: 9, sm: 8 }}
          p={1}
          onClick={
            isMobile ? () => router.push(`/orders/${trackingId}`) : () => {}
          }
        >
          <Typography>{product.name}</Typography>
          <Typography variant='body2'>Order {trackingId}</Typography>
          <OrderStatus status={status} />
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
        </Grid2>
        <Grid2
          size={2}
          display={{ xs: 'none', sm: 'flex' }}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Button onClick={() => router.push(`/orders/${trackingId}`)}>
            See details
          </Button>
        </Grid2>
      </Grid2>
    </Paper>
  ));
};
const OrderSkeleton = () => {
  return (
    <Paper>
      <Grid2 container spacing={2}>
        <Grid2
          size={{ xs: 3, sm: 2 }}
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Skeleton variant='rectangular' height={100} width={100} />
        </Grid2>
        <Grid2 size={{ xs: 9, sm: 8 }} p={1}>
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
          <Skeleton variant='text' sx={{ fontSize: '1rem', width: '100px' }} />
          <Stack direction='row' gap={1} alignItems='center'>
            <Skeleton variant='text' sx={{ fontSize: '1rem', width: '50px' }} />
            <Skeleton variant='text' sx={{ fontSize: '1rem', width: '50px' }} />
          </Stack>
          <Skeleton variant='text' sx={{ fontSize: '1rem', width: '50px' }} />
        </Grid2>
        <Grid2
          size={2}
          display={{ xs: 'none', sm: 'flex' }}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Skeleton variant='rectangular' height={30} width={60} />
        </Grid2>
      </Grid2>
    </Paper>
  );
};

const Orders = () => {
  const router = useRouter();
  const session = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  // const [search, setSearch] = useState('');
  const [status, setStatus] = useState<IOrder['status'] | 'all'>('all');

  const LIMIT = 10;
  const pageCount = Math.ceil(count / LIMIT) || 1;

  const URL = `/api/orders?limit=${LIMIT}`;

  if (!session) router.push('/login?callback=/orders');
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(URL);
        const { orders, totalCount } = res.data;
        setOrders(orders);
        setCount(totalCount);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterStatus = async (status: IOrder['status'] | 'all') => {
    try {
      const params = new URLSearchParams();
      params.append('status', status === 'all' ? '' : status);
      setCurrentPage(1);
      setLoading(true);
      setStatus(status);
      const res = await axios.get(`${URL}&${params.toString()}`);
      const { orders, totalCount } = res.data;
      setOrders(orders);
      setCount(totalCount);
    } catch (e) {
      console.log(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  const changePage = async (e: ChangeEvent<unknown>, value: number) => {
    try {
      const params = new URLSearchParams();
      params.append('status', status);
      params.append('page', value.toString());
      setCurrentPage(value);
      setLoading(true);
      const res = await axios.get(`${URL}&${params.toString()}`);
      const { orders, totalCount } = res.data;
      setOrders(orders);
      setCount(totalCount);
    } catch (e) {
      console.log(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap={2} p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href={'/'}>Home</Link>
        <Typography>My Orders</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Stack direction={'row'} gap={1}>
          <Chip
            label='All'
            variant={status === 'all' ? 'filled' : 'outlined'}
            onClick={() => filterStatus('all')}
            disabled={loading || status === 'all'}
            color='primary'
          />
          <Chip
            label='Processing'
            variant={status === 'processing' ? 'filled' : 'outlined'}
            onClick={() => filterStatus('processing')}
            disabled={loading || status === 'processing'}
            color='primary'
          />
          <Chip
            label='Shipped'
            variant={status === 'shipped' ? 'filled' : 'outlined'}
            onClick={() => filterStatus('shipped')}
            disabled={loading || status === 'shipped'}
            color='primary'
          />
          <Chip
            label='Delivered'
            variant={status === 'delivered' ? 'filled' : 'outlined'}
            onClick={() => filterStatus('delivered')}
            disabled={loading || status === 'delivered'}
            color='primary'
          />
        </Stack>
      </Box>
      {loading ? (
        <Stack gap={2}>
          {[1, 2, 3, 4].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </Stack>
      ) : orders.length ? (
        <>
          <Stack gap={2}>
            {orders.map((order) => (
              <OrderElement key={order._id.toString()} order={order} />
            ))}
          </Stack>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Pagination
              count={pageCount}
              page={currentPage}
              shape='rounded'
              onChange={changePage}
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography textAlign='center' variant='h6'>
            No order is available
          </Typography>
          <Button
            variant='contained'
            size='large'
            onClick={() => router.push('/products')}
          >
            View products
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default Orders;
