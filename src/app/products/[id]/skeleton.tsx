import { Skeleton, Stack } from "@mui/material";

const PageDetailsSkeleton = () => (
  <Stack direction={{ xs: 'column', sm: 'row' }}>
    <Skeleton height={'70vh'} />
  </Stack>
);

export default PageDetailsSkeleton;
