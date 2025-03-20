'use client';

import React, { ReactNode } from 'react';
import { Grid2 } from '@mui/material';
import Image from 'next/image';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Grid2
      container
      flexDirection={{ xs: 'column-reverse', sm: 'row' }}
      sx={{ minHeight: '100vh' }}
    >
      {/* Image Section */}
      <Grid2
        size={{ xs: 12, sm: 6 }}
        sx={{
          position: 'relative',
          height: { xs: '40vh', sm: '90vh' },
        }}
      >
        <Image
          src='/authPic.png'
          alt='Authentication Illustration'
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'left',
          }}
          priority
        />
      </Grid2>

      {/* Content Section */}
      {children}
    </Grid2>
  );
};

export default Layout;
