'use client';

import Section from '@/components/section';
import { errorHandler } from '@/lib/errorHandler';
import { IProduct } from '@/models/Product.model';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid2,
  IconButton,
  Rating,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, MouseEvent } from 'react';
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
import Product from '@/components/product';
import { formatNumber } from '@/lib/formatNumber';

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'none',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
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
    top: 0,
    right: 10,
  },
}));

const QuantityChangeButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 4,
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

// Reusable quantity control block
const QuantityControls = ({
  cartItem,
  productStock,
  onAdd,
  onSubtract,
  status,
}: {
  cartItem: { quantity: number };
  productStock: number;
  onAdd: (e: MouseEvent) => void;
  onSubtract: (e: MouseEvent) => void;
  status: string;
}) => (
  <Stack direction="row">
    <QuantityChangeButton
      disabled={cartItem.quantity <= 1 || status === 'loading'}
      onClick={onSubtract}
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
      disabled={cartItem.quantity >= productStock || status === 'loading'}
      onClick={onAdd}
    >
      <Add />
    </QuantityChangeButton>
  </Stack>
);

const ProductDetails = () => {
  const [productLoading, setProductLoading] = useState(true);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const isFavourite = useAppSelector((state) =>
    selectIsFavourite(state, product?._id as IProduct['_id'])
  );
  const cartItem = useAppSelector((state) =>
    state.cart.items.find(
      (item) => (item.product as IProduct)._id === (product?._id as IProduct['_id'])
    )
  );
  const { status } = useAppSelector((state) => state.cart);

  const discountAmount =
    product && hasDiscount
      ? product.price - (product.discount / 100) * product.price
      : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        const prod = res.data;
        setProduct(prod);
        setHasDiscount(!!prod.discount);
        setCurrentImage(prod.mainPic);
        // Fetch related products based on the product category
        const relatedRes = await axios.get(
          `/api/products/?category=${
            (prod.category as { _id: string })._id
          }&limit=4`
        );
        setRelatedProducts(relatedRes.data.products);
      } catch (e) {
        console.error(errorHandler(e));
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (e: MouseEvent) => {
    e.stopPropagation();
    if (product) dispatch(toggleCart(product._id));
  };

  const handleAddQuantity = (e: MouseEvent) => {
    e.stopPropagation();
    if (product)
      dispatch(
        updateQuantity({
          productId: product._id,
          quantity: (cartItem?.quantity || 1) + 1,
        })
      );
  };

  const handleSubtractQuantity = (e: MouseEvent) => {
    e.stopPropagation();
    if (product)
      dispatch(
        updateQuantity({
          productId: product._id,
          quantity: (cartItem?.quantity || 1) - 1,
        })
      );
  };

  const handleToggleFavourite = (e: MouseEvent) => {
    e.stopPropagation();
    if (product) dispatch(toggleFavourite(product._id));
  };

  if (productLoading) return <PageDetailsSkeleton />;
  if (!product)
    return (
      <Typography textAlign="center" sx={{ my: 2 }}>
        No item found
      </Typography>
    );

  return (
    <Stack p={{ xs: 1, sm: 4 }} spacing={2}>
      <Breadcrumbs>
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>
      <Stack spacing={2} mb={2}>
        <Grid2 container spacing={2}>
          {/* Image Section */}
          <Grid2 size={{ xs: 12, sm: 7 }}>
            {/* Desktop thumbnails */}
            <Stack
              direction="row"
              spacing={1}
              display={{ xs: 'none', sm: 'flex' }}
              height="100%"
            >
              <Stack spacing={1}>
                <ImageContainer
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(product.mainPic);
                  }}
                  sx={{ height: '25%', width: '50px' }}
                >
                  <Image
                    src={product.mainPic}
                    alt={product.name}
                    fill
                    objectFit="contain"
                    style={{ padding: 8 }}
                  />
                </ImageContainer>
                {product.otherImages.map((img) => (
                  <ImageContainer
                    key={img}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(img);
                    }}
                    sx={{ height: '25%', width: '50px' }}
                  >
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      objectFit="contain"
                      style={{ padding: 8 }}
                    />
                  </ImageContainer>
                ))}
              </Stack>
              <ImageContainer sx={{ flex: 2, height: '100%', width: 'auto' }}>
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  objectFit="contain"
                />
              </ImageContainer>
            </Stack>
            {/* Mobile Carousel */}
            <Box display={{ xs: 'block', sm: 'none' }}>
              <CarouselComponent product={product} />
            </Box>
          </Grid2>
          {/* Product Info Section */}
          <Grid2 size={{ xs: 12, sm: 5 }}>
            <Stack gap={1} position="relative">
              <Typography variant="h6">{product.name}</Typography>
              <Typography>
                Category:{' '}
                {((product.category as unknown as { _id: string; name: string }).name) || ''}
              </Typography>
              <Divider />
              {hasDiscount && discountAmount ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">
                    ₦{formatNumber(discountAmount.toFixed(2))}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₦{formatNumber(product.price.toFixed(2))}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    bgcolor="secondary.main"
                    p={0.5}
                    borderRadius={1}
                  >
                    - {product.discount}%
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="h6">
                  ₦{formatNumber(product.price.toFixed(2))}
                </Typography>
              )}
              <Typography
                variant="body2"
                color={product.stock ? 'success' : 'error'}
              >
                {product.stock
                  ? `${product.stock} units left`
                  : 'Out of Stock'}
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                {product.variation && (
                  <Typography>Variation: {product.variation}</Typography>
                )}
                {product.volume && (
                  <Typography>Volume: {product.volume}</Typography>
                )}
              </Stack>
              <Stack direction="row" gap={1} alignItems="center">
                <Rating
                  precision={0.5}
                  value={product.rating || 0}
                  size="small"
                  readOnly
                />
                <Typography variant="body2">
                  ({product.reviews.length} Reviews)
                </Typography>
                <FavouriteButton onClick={handleToggleFavourite}>
                  {isFavourite ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </FavouriteButton>
              </Stack>
              {/* Desktop Add-to-Cart Controls */}
              <Box display={{ xs: 'none', sm: 'block' }}>
                {cartItem ? (
                  <QuantityControls
                    cartItem={cartItem}
                    productStock={product.stock}
                    onAdd={handleAddQuantity}
                    onSubtract={handleSubtractQuantity}
                    status={status}
                  />
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    fullWidth
                    startIcon={<AddShoppingCart />}
                    variant="contained"
                  >
                    Add to cart
                  </Button>
                )}
              </Box>
            </Stack>
          </Grid2>
        </Grid2>
        <Stack spacing={2}>
          <Typography variant="h6">Product details</Typography>
          <Typography variant="body1">{product.description}</Typography>
        </Stack>
        {/* Mobile Add-to-Cart Controls */}
        <ButtonWrapper>
          {cartItem ? (
            <QuantityControls
              cartItem={cartItem}
              productStock={product.stock}
              onAdd={handleAddQuantity}
              onSubtract={handleSubtractQuantity}
              status={status}
            />
          ) : (
            <Button
              onClick={handleAddToCart}
              fullWidth
              startIcon={<AddShoppingCart />}
              variant="contained"
            >
              Add to cart
            </Button>
          )}
        </ButtonWrapper>
      </Stack>
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <Box mt={2}>
          <Section title="" subtitle="Related Item">
            {relatedProducts.map((relProd) => (
              <Grid2 key={relProd._id.toString()} size={{ xs: 6, sm: 3 }}>
                <Product product={relProd} />
              </Grid2>
            ))}
          </Section>
        </Box>
      )}
    </Stack>
  );
};

export default ProductDetails;
