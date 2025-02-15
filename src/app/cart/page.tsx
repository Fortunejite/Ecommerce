'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { calculateTotalAmount, calculateTotalItems } from '@/lib/cartUtils';
import { formatNumber } from '@/lib/formatNumber';
import { ICart } from '@/models/Cart.model';
import { IProduct } from '@/models/Product.model';
import { toggleCart, updateQuantity } from '@/redux/cartSlice';
import { Add, DeleteOutline, Remove } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid2,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const ImageContainter = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100px',
  height: '100px',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '4px',
}));

const QuantityChangeButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '4px',
  backgroundColor: theme.palette.primary.main,
  height: '100%',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.8,
  },
  '&:disabled': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.5,
  },
}));

const PCCheckOutBtn = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));
const MobileCheckOutBtn = styled(Button)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    position: 'sticky',
    bottom: 0,
    display: 'block',
  },
}));

const Cart = () => {
  const { items, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href={'/'}>Home</Link>
        <Typography>Cart</Typography>
      </Breadcrumbs>

      {items.length ? (
        <Grid2
          container
          spacing={4}
          flexDirection={{ xs: 'column-reverse', sm: 'row' }}
          sx={{ position: 'relative' }}
        >
          <Grid2 size={{ xs: 12, sm: 8 }}>
            <Typography variant={'h6'}>
              Cart ({calculateTotalItems(items)})
            </Typography>
            <Divider />
            {items.map((item, i) => {
              const product = item.product as IProduct;
              const discountAmount =
                product?.price - (product?.discount / 100) * product?.price;

              const addQuantity = () => {
                dispatch(
                  updateQuantity({
                    productId: product._id,
                    quantity: (item.quantity + 1) as number,
                  }),
                );
              };
              const subtractQuantity = () => {
                dispatch(
                  updateQuantity({
                    productId: product._id,
                    quantity: (item.quantity - 1) as number,
                  }),
                );
              };
              return (
                <Box key={i} sx={{ margin: '16px 0' }}>
                  <Stack direction={'row'} gap={2} marginBottom={1}>
                    <ImageContainter>
                      <Image
                        src={product.mainPic}
                        alt={product.name}
                        fill
                        objectFit='contain'
                        style={{
                          padding: '8px',
                        }}
                      />
                    </ImageContainter>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      gap={1}
                      justifyContent='space-between'
                      flex={1}
                    >
                      <Stack>
                        <Typography variant={'h6'}>{product.name}</Typography>
                        <Typography>{product.category}</Typography>
                        <Typography
                          variant='body2'
                          color={product.stock ? 'success' : 'error'}
                        >
                          {product.stock
                            ? `${product.stock} units left`
                            : 'Out of Stock'}
                        </Typography>
                      </Stack>
                      <Stack>
                        {product.discount ? (
                          <Stack
                            spacing={1}
                            direction={{ xs: 'row', sm: 'column' }}
                            alignItems={'center'}
                          >
                            <Typography variant='h6'>
                              ₦{formatNumber(discountAmount)}
                            </Typography>
                            <Stack direction='row' gap={1}>
                              <Typography
                                variant='body1'
                                sx={{ textDecoration: 'line-through' }}
                              >
                                ₦{formatNumber(product.price)}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='primary'
                                bgcolor={'secondary.main'}
                                p={0.5}
                                borderRadius={1}
                              >
                                - {product.discount}%
                              </Typography>
                            </Stack>
                          </Stack>
                        ) : (
                          <Typography variant='h6'>
                            ₦{formatNumber(product.price)}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} justifyContent='space-between'>
                    <Button
                      onClick={() => dispatch(toggleCart(product._id))}
                      disabled={status === 'loading'}
                      startIcon={<DeleteOutline />}
                    >
                      Remove
                    </Button>
                    <Stack direction='row'>
                      <QuantityChangeButton
                        disabled={item.quantity <= 1 || status === 'loading'}
                        onClick={subtractQuantity}
                      >
                        <Remove />
                      </QuantityChangeButton>

                      <Box
                        flex={1}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '50px',
                        }}
                      >
                        <Typography>{item.quantity}</Typography>
                      </Box>
                      <QuantityChangeButton
                        disabled={
                          item.quantity >= product.stock || status === 'loading'
                        }
                        onClick={addQuantity}
                      >
                        <Add />
                      </QuantityChangeButton>
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
            <MobileCheckOutBtn size={'large'} onClick={() => router.push('/checkout')} variant='contained' fullWidth>
              Checkout (₦{formatNumber(calculateTotalAmount(items))})
            </MobileCheckOutBtn>
          </Grid2>
          <Grid2
            size={{ xs: 12, sm: 4 }}
            position={{ xs: 'static', sm: 'sticky' }}
            sx={{ top: 32 }}
          >
            <Box>
              <Typography variant={'h6'}>Cart Summary</Typography>
              <Divider />
              <Stack
                marginTop={2}
                direction='row'
                justifyContent='space-between'
              >
                <Typography>Subtotal:</Typography>
                <Typography variant={'h6'}>
                  ₦{formatNumber(calculateTotalAmount(items))}
                </Typography>
              </Stack>
              <PCCheckOutBtn size={'large'} onClick={() => router.push('/checkout')} variant='contained' fullWidth>
                Checkout (₦{formatNumber(calculateTotalAmount(items))})
              </PCCheckOutBtn>
            </Box>
          </Grid2>
        </Grid2>
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
            No items is cart
          </Typography>
          <Button variant='contained' size='large' onClick={() => router.push('/products')}>
            View products
          </Button>
        </Box>
      )}
    </Stack>
  );
};
export default Cart;
