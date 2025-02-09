import { IProduct } from '@/models/Product.model';
import { Stack, Typography, Grid2, Box } from '@mui/material';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}
const Section = ({ children, title, subtitle }: SectionProps) => {
  return (
    <Stack spacing={2}>
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Box
          sx={{
            height: '32px',
            width: '16px',
            backgroundColor: 'primary.main',
            borderRadius: '4px',
          }}
        ></Box>
        <Typography variant='body2' color='primary'>
          {subtitle}
        </Typography>
      </Stack>
      <Typography variant='h6'>{title}</Typography>
      <Grid2 container spacing={2}>
        {children}
      </Grid2>
    </Stack>
  );
};

export default Section;
