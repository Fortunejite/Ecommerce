'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { formatNumber } from '@/lib/formatNumber';
import { IProduct } from '@/models/Product.model';
import { selectInCart, toggleCart } from '@/redux/cartSlice';
import { selectIsFavourite, toggleFavourite } from '@/redux/favouriteSlice';
import {
  Favorite,
  FavoriteBorderOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Stack,
  Typography,
  Box,
  styled,
  IconButton,
  Paper,
  Button,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductProps {
  product: IProduct;
}

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '200px',
  width: 'auto',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Icons = styled(Box)({
  position: 'absolute',
  top: 10,
  right: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const IconsButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const Badge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  left: 10,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 4,
  padding: '0 8px',
}));

const PriceSection = ({ product }: { product: IProduct }) => {
  if (product.discount > 0) {
    const discountAmount =
      product.price - (product.discount / 100) * product.price;
    return (
      <Stack direction="row" spacing={1}>
        <Typography variant="subtitle1" component='p' color="primary">
          ₦{formatNumber(discountAmount.toFixed(0))}
        </Typography>
        <Typography variant="subtitle1" sx={{ textDecoration: 'line-through' }}>
          ₦{formatNumber(product.price.toFixed(0))}
        </Typography>
      </Stack>
    );
  }
  return (
    <Typography variant="subtitle1" component='p' color="primary">
      ₦{formatNumber(product.price.toFixed(0))}
    </Typography>
  );
};

const Product = ({ product }: ProductProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isFavourite = useAppSelector((state) =>
    selectIsFavourite(state, product._id)
  );
  const inCart = useAppSelector((state) => selectInCart(state, product._id));

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavourite(product._id));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCart(product._id));
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product._id}`);
  };

  return (
    <Paper
      sx={{
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        '&:hover .addToCartBtn': {
          display: 'flex',
        },
      }}
      onClick={() => router.push(`/products/${product._id}`)}
    >
      <ImageContainer>
        <Box sx={{ position: 'relative', width: '70%', height: '100%' }}>
          <Image
            src={product.mainPic}
            alt={product.name}
            fill
            objectFit="contain"
          />
        </Box>
        <Icons>
          <IconsButton
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            onClick={handleFavourite}
          >
            {isFavourite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorderOutlined fontSize="small" />
            )}
          </IconsButton>
          <IconsButton
            aria-label="View product"
            onClick={handleViewProduct}
          >
            <VisibilityOutlined fontSize="small" />
          </IconsButton>
        </Icons>
        {product.discount > 0 && (
          <Badge>
            <Typography variant="body1" color="primary.contrastText">
              - {product.discount}%
            </Typography>
          </Badge>
        )}
        <Button
          className="addToCartBtn"
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            display: 'none',
            backgroundColor: 'text.secondary',
            color: 'background.default',
          }}
          size="small"
          variant="contained"
          disabled={inCart}
          onClick={handleAddToCart}
        >
          Add{inCart && 'ed'} to cart
        </Button>
      </ImageContainer>
      <Stack p={1}>
        <Typography variant="subtitle1">{product.name}</Typography>
        <Stack direction="column" spacing={1}>
          <PriceSection product={product} />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Product;
