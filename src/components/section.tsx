'use client';

import { Stack, Typography, Grid2, Box, Divider } from '@mui/material';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const Section = ({ children, title, subtitle }: SectionProps) => {
  return (
    <Box component="section" my={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              height: 32,
              width: 16,
              backgroundColor: 'primary.main',
              borderRadius: 1,
            }}
          />
          <Typography variant="body2" color="primary">
            {subtitle}
          </Typography>
        </Stack>
        <Typography variant="h6">{title}</Typography>
        <Grid2 container spacing={2}>
          {children}
        </Grid2>
      </Stack>
      <Divider sx={{ my: 4 }} />
    </Box>
  );
};

export default Section;
