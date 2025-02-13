'use client';

import Section from '@/components/section';
import { errorHandler } from '@/lib/errorHandler';
import Product, { IProduct } from '@/models/Product.model';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid2,
  IconButton,
  Paper,
  Rating,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageDetailsSkeleton from './skeleton';
import {
  Add,
  AddShoppingCart,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { selectIsFavourite, toggleFavourite } from '@/redux/favouriteSlice';
import CarouselComponent from '@/components/carousel';
import { toggleCart, updateQuantity } from '@/redux/cartSlice';

const ImageContainter = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
const ButtonWrapper = styled(Paper)(({ theme }) => ({
  display: 'none',
  backgroundColor: theme.palette.background.default,
  padding: 2,
  [theme.breakpoints.down('sm')]: {
    position: 'sticky',
    bottom: 0,
    display: 'block',
  },
}));
const FavouriteButton = styled(IconButton)(({ theme }) => ({
  marginLeft: 'auto',
  [theme.breakpoints.up('sm')]: {
    position: 'absolute',
    top: '0',
    right: '10px',
  },
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

const ProductDetails = () => {
  const [productLoading, setProductLoading] = useState(true);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const { id } = useParams();
  const isFavourite = useAppSelector((state) =>
    selectIsFavourite(state, product?._id as IProduct['_id']),
  );

  const cartItem = useAppSelector((state) =>
    state.cart.items.find(
      (item) => item.product === (product?._id as IProduct['_id']),
    ),
  );
  const { status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const discountAmount =
    product &&
    hasDiscount &&
    product?.price - (product?.discount / 100) * product?.price;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        const product = res.data;
        setProduct(product);
        const relatedProductRes = await axios.get(
          `/api/products/?category=${
            (product.category as unknown as any).name
          }&limit=4`,
        );
        setRelatedProducts(relatedProductRes.data.products);
        setHasDiscount(!!product.discount);
        setCurrentImage(product.mainPic);
      } catch (e) {
        console.log(errorHandler(e));
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();

    // const fetchRelatedItems = async () => {
    //   try {
    //     const product = res.data;
    //     setProduct(product);
    //   } catch (e) {
    //     console.log(errorHandler(e));
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchRelatedItems();
  }, [id]);

  const addQuantity = () => {
    dispatch(
      updateQuantity({
        productId: product?._id as IProduct['_id'],
        quantity: (cartItem?.quantity || 1 + 1) as number,
      }),
    );
  };
  const subtractQuantity = () => {
    dispatch(
      updateQuantity({
        productId: product?._id as IProduct['_id'],
        quantity: (cartItem?.quantity || 1 - 1) as number,
      }),
    );
  };

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href={'/'}>Home</Link>
        <Link href={'/products'}>Products</Link>
        <Typography>{product?.name || ''}</Typography>
      </Breadcrumbs>
      {product && !productLoading && (
        <Stack spacing={2} marginBottom={2}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 7 }}>
              <Stack
                display={{ xs: 'none', sm: 'flex' }}
                direction={'row'}
                height={'100%'}
                spacing={1}
              >
                <Stack spacing={1}>
                  <ImageContainter height='25%' width='50px'>
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
                  {product.otherImages.map((img, i) => (
                    <ImageContainter key={i} height='25%' width='50px'>
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        objectFit='contain'
                        style={{
                          padding: '8px',
                        }}
                      />
                    </ImageContainter>
                  ))}
                </Stack>
                <ImageContainter flex={2} height={'100%'} width={'auto'}>
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    objectFit='contain'
                  />
                </ImageContainter>
              </Stack>
              <Box display={{ xs: 'block', sm: 'none' }}>
                <CarouselComponent product={product} />
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 5 }}>
              <Stack gap={1} position={'relative'}>
                <Typography variant='h6'>{product.name}</Typography>
                <Typography>
                  Category: {(product.category as unknown as any).name}
                </Typography>
                <Divider />
                {hasDiscount && discountAmount ? (
                  <Stack direction='row' spacing={1} alignItems={'center'}>
                    <Typography variant='h6'>
                      ${discountAmount.toFixed(2)}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ textDecoration: 'line-through' }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='primary'
                      bgcolor={'secondary.main'}
                      p={0.5}
                      borderRadius={1}
                      sx={{}}
                    >
                      - {product.discount}%
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant='h6'>
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
                <Typography
                  variant='body2'
                  color={product.stock ? 'success' : 'error'}
                >
                  {product.stock
                    ? `${product.stock} units left`
                    : 'Out of Stock'}
                </Typography>
                <Stack direction='row' gap={1} alignItems='center'>
                  <Rating
                    precision={0.5}
                    defaultValue={product.rating || 0}
                    size='small'
                    readOnly
                  />
                  <Typography variant='body2'>
                    ({product.reviews.length} Reviews)
                  </Typography>
                  <FavouriteButton
                    onClick={() => dispatch(toggleFavourite(product._id))}
                  >
                    {isFavourite ? (
                      <Favorite color='error' />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </FavouriteButton>
                </Stack>
                {status !== 'idle' && (
                  <Box display={{ xs: 'none', sm: 'block' }}>
                    {cartItem ? (
                      <Stack direction='row'>
                        <QuantityChangeButton
                          disabled={
                            cartItem.quantity <= 1 || status === 'loading'
                          }
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
                          }}
                        >
                          <Typography>{cartItem.quantity}</Typography>
                        </Box>
                        <QuantityChangeButton
                          disabled={
                            cartItem.quantity >= product.stock ||
                            status === 'loading'
                          }
                          onClick={addQuantity}
                        >
                          <Add />
                        </QuantityChangeButton>
                      </Stack>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleCart(product._id));
                        }}
                        fullWidth
                        startIcon={<AddShoppingCart />}
                        variant='contained'
                      >
                        Add to cart
                      </Button>
                    )}
                  </Box>
                )}
              </Stack>
            </Grid2>
          </Grid2>
          <Stack spacing={2}>
            <Typography variant='h6'>Product details</Typography>
            <Typography variant='body1'>{product.description}</Typography>
          </Stack>
          {status !== 'idle' && (
            <ButtonWrapper>
              {cartItem ? (
                <Stack direction='row'>
                  <QuantityChangeButton
                    disabled={cartItem.quantity <= 1 || status === 'loading'}
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
                    }}
                  >
                    <Typography>{cartItem.quantity}</Typography>
                  </Box>
                  <QuantityChangeButton
                    disabled={
                      cartItem.quantity >= product.stock || status === 'loading'
                    }
                    onClick={addQuantity}
                  >
                    <Add />
                  </QuantityChangeButton>
                </Stack>
              ) : (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleCart(product._id));
                  }}
                  fullWidth
                  startIcon={<AddShoppingCart />}
                  variant='contained'
                >
                  Add to cart
                </Button>
              )}
            </ButtonWrapper>
          )}
        </Stack>
      )}

      {productLoading && <PageDetailsSkeleton />}
      {!product && !productLoading && (
        <Typography textAlign={'center'} sx={{ margin: '16px 0' }}>
          No item found
        </Typography>
      )}

      {relatedProducts.length && (
        <Section title='' subtitle='Related Item'>
          {relatedProducts.map((product, i) => (
            <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
              <Product key={product._id.toString()} product={product} />
            </Grid2>
          ))}
        </Section>
      )}
    </Stack>
  );
};

export default ProductDetails;
