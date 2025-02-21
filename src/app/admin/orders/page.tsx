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
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const OrderElement = ({ order }: { order: IOrder }) => {
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const { trackingId, status } = order;
  // Type assertion for cartItems
  const cartItems = order.cartItems as unknown as ({
    product: IProduct;
  } & IOrder['cartItems'][0])[];

  return (
    <>
      {cartItems.map(({ product, quantity }) => (
        <Paper key={product._id.toString()} sx={{ mb: 2, p: 1 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 3, sm: 2 }} sx={{ position: 'relative' }}>
              <Image
                src={product.mainPic}
                alt={product.name}
                fill
                objectFit='contain'
                style={{ padding: '4px' }}
              />
            </Grid2>
            <Grid2
              size={{ xs: 9, sm: 8 }}
              p={1}
              onClick={
                isMobile
                  ? () => router.push(`/orders/${trackingId}`)
                  : undefined
              }
              sx={{ cursor: isMobile ? 'pointer' : 'default' }}
            >
              <Typography variant='subtitle1'>{product.name}</Typography>
              <Typography variant='body2'>Order {trackingId}</Typography>
              <OrderStatus status={status} />
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
            </Grid2>
            <Grid2
              size={2}
              display={{ xs: 'none', sm: 'flex' }}
              alignItems='center'
              justifyContent='center'
            >
              <Button onClick={() => router.push(`/orders/${trackingId}`)}>
                See details
              </Button>
            </Grid2>
          </Grid2>
        </Paper>
      ))}
    </>
  );
};

const OrderSkeleton = () => {
  return (
    <Paper sx={{ mb: 2, p: 1 }}>
      <Grid2 container spacing={2} alignItems='center'>
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
          <Stack direction='row' gap={1} alignItems='center' mt={1}>
            <Skeleton variant='text' sx={{ fontSize: '1rem', width: '50px' }} />
            <Skeleton variant='text' sx={{ fontSize: '1rem', width: '50px' }} />
          </Stack>
          <Skeleton variant='text' sx={{ fontSize: '1rem', width: '50px' }} />
        </Grid2>
        <Grid2
          size={2}
          display={{ xs: 'none', sm: 'flex' }}
          alignItems='center'
          justifyContent='center'
        >
          <Skeleton variant='rectangular' height={30} width={60} />
        </Grid2>
      </Grid2>
    </Paper>
  );
};

const Orders = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    IOrder['status'] | 'all'
  >('all');

  const LIMIT = 10;
  const pageCount = Math.ceil(count / LIMIT) || 1;
  const BASE_URL = `/api/orders?limit=${LIMIT}`;

  // Redirect if unauthenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?callback=/orders');
    }
  }, [sessionStatus, router]);

  // Fetch orders with optional query parameters
  const fetchOrders = useCallback(
    async (paramsString: string = '') => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}${paramsString}`);
        const { orders, totalCount } = res.data;
        setOrders(orders);
        setCount(totalCount);
      } catch (e) {
        console.error(errorHandler(e));
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL],
  );

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterStatus = useCallback(
    async (statusFilter: IOrder['status'] | 'all') => {
      const params = new URLSearchParams();
      params.append('status', statusFilter === 'all' ? '' : statusFilter);
      setCurrentPage(1);
      setOrderStatusFilter(statusFilter);
      await fetchOrders(`&${params.toString()}`);
    },
    [fetchOrders],
  );

  const handleChangePage = useCallback(
    async (e: ChangeEvent<unknown>, page: number) => {
      const params = new URLSearchParams();
      params.append(
        'status',
        orderStatusFilter === 'all' ? '' : orderStatusFilter,
      );
      params.append('page', page.toString());
      setCurrentPage(page);
      await fetchOrders(`&${params.toString()}`);
    },
    [fetchOrders, orderStatusFilter],
  );

  const statusOptions: (IOrder['status'] | 'all')[] = [
    'all',
    'processing',
    'shipped',
    'delivered',
  ];

  return (
    <Stack gap={2} p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href='/'>Admin</Link>
        <Typography>Manage Orders</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Stack direction='row' gap={1}>
          {statusOptions.map((option) => (
            <Chip
              key={option}
              label={option.charAt(0).toUpperCase() + option.slice(1)}
              variant={orderStatusFilter === option ? 'filled' : 'outlined'}
              onClick={() => handleFilterStatus(option)}
              disabled={loading || orderStatusFilter === option}
              color='primary'
            />
          ))}
        </Stack>
      </Box>

      {loading ? (
        <Stack gap={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </Stack>
      ) : orders.length > 0 ? (
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
              onChange={handleChangePage}
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
            onClick={() => router.push('/admin')}
          >
            View Dashboard
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default Orders;
