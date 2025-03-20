'use client';

import { formatNumber } from '@/lib/formatNumber';
import { IProduct } from '@/models/Product.model';
import {
  Stack,
  Typography,
  Box,
  styled,
  Paper,
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
      onClick={() => router.push(`/admin/products/${product._id}`)}
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
        {product.discount > 0 && (
          <Badge>
            <Typography variant="body1" color="primary.contrastText">
              - {product.discount}%
            </Typography>
          </Badge>
        )}
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
