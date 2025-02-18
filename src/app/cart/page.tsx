'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { calculateTotalAmount, calculateTotalItems } from '@/lib/cartUtils';
import { formatNumber } from '@/lib/formatNumber';
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

const ImageContainer = styled(Box)(({ theme }) => ({
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

  const totalItems = calculateTotalItems(items);
  const totalAmount = calculateTotalAmount(items);

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href='/'>Home</Link>
        <Typography>Cart</Typography>
      </Breadcrumbs>

      {items.length ? (
        <Grid2
          container
          spacing={4}
          flexDirection={{ xs: 'column-reverse', sm: 'row' }}
          sx={{ position: 'relative' }}
        >
          {/* Cart Items List */}
          <Grid2 size={{ xs: 12, sm: 8 }}>
            <Typography variant='h6'>Cart ({totalItems})</Typography>
            <Divider sx={{ my: 1 }} />
            {items.map((item) => {
              const product = item.product as IProduct;
              const discountAmount = product.discount
                ? product.price - (product.discount / 100) * product.price
                : product.price;

              const addQuantity = () => {
                dispatch(
                  updateQuantity({
                    productId: product._id,
                    quantity: item.quantity + 1,
                  }),
                );
              };

              const subtractQuantity = () => {
                dispatch(
                  updateQuantity({
                    productId: product._id,
                    quantity: item.quantity - 1,
                  }),
                );
              };

              return (
                <Box key={product._id.toString()} sx={{ my: 2 }}>
                  <Stack direction='row' gap={2} mb={1}>
                    <ImageContainer>
                      <Image
                        src={product.mainPic}
                        alt={product.name}
                        fill
                        objectFit='contain'
                        style={{ padding: '8px' }}
                      />
                    </ImageContainer>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      gap={1}
                      justifyContent='space-between'
                      flex={1}
                    >
                      <Stack spacing={0.5}>
                        <Typography variant='h6'>{product.name}</Typography>
                        <Typography variant='body2'>
                          Category: {product.category.toString()}
                        </Typography>
                        <Typography
                          variant='body2'
                          color={product.stock ? 'success' : 'error'}
                        >
                          {product.stock
                            ? `${product.stock} units left`
                            : 'Out of Stock'}
                        </Typography>
                      </Stack>
                      <Stack justifyContent='center'>
                        {product.discount ? (
                          <Stack
                            spacing={1}
                            direction={{ xs: 'row', sm: 'column' }}
                            alignItems='center'
                          >
                            <Typography variant='h6'>
                              ₦{formatNumber(discountAmount)}
                            </Typography>
                            <Stack direction='row' gap={1} alignItems='center'>
                              <Typography
                                variant='body1'
                                sx={{ textDecoration: 'line-through' }}
                              >
                                ₦{formatNumber(product.price)}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='primary'
                                bgcolor='secondary.main'
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
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Button
                      onClick={() => dispatch(toggleCart(product._id))}
                      disabled={status === 'loading'}
                      startIcon={<DeleteOutline />}
                    >
                      Remove
                    </Button>
                    <Stack direction='row' alignItems='center'>
                      <QuantityChangeButton
                        disabled={item.quantity <= 1 || status === 'loading'}
                        onClick={subtractQuantity}
                      >
                        <Remove />
                      </QuantityChangeButton>
                      <Box
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
            <MobileCheckOutBtn
              size='large'
              onClick={() => router.push('/checkout')}
              variant='contained'
              fullWidth
            >
              Checkout (₦{formatNumber(totalAmount)})
            </MobileCheckOutBtn>
          </Grid2>

          {/* Cart Summary */}
          <Grid2
            size={{ xs: 12, sm: 4 }}
            sx={{
              position: { xs: 'static', sm: 'sticky' },
              top: 32,
            }}
          >
            <Box>
              <Typography variant='h6'>Cart Summary</Typography>
              <Divider sx={{ my: 1 }} />
              <Stack mt={2} direction='row' justifyContent='space-between'>
                <Typography>Subtotal:</Typography>
                <Typography variant='h6'>
                  ₦{formatNumber(totalAmount)}
                </Typography>
              </Stack>
              <PCCheckOutBtn
                size='large'
                onClick={() => router.push('/checkout')}
                variant='contained'
                fullWidth
                sx={{ mt: 2 }}
              >
                Checkout (₦{formatNumber(totalAmount)})
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
            mt: 4,
          }}
        >
          <Typography textAlign='center' variant='h6'>
            No items in cart
          </Typography>
          <Button
            variant='contained'
            size='large'
            onClick={() => router.push('/products')}
          >
            View Products
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default Cart;
