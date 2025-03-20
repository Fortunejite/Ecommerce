import { Paper, Skeleton, Stack } from '@mui/material';

const ProductSkeleton = () => (
  <Paper>
    <Skeleton variant='rectangular' height={200} width='auto' />
    <Stack p={1}>
      <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
      <Stack direction='column' spacing={1}>
        <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
        <Stack direction='row' spacing={1}>
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
        </Stack>
      </Stack>
    </Stack>
  </Paper>
);

export default ProductSkeleton;
