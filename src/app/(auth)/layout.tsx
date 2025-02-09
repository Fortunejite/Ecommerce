'use client';
import {
  Grid2,
} from '@mui/material';
import Image from 'next/image';
import React, { ReactNode } from 'react';

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <Grid2 container flexDirection={{xs: 'column-reverse', sm: 'row'}}>
      <Grid2 size={{xs: 12, sm: 6}} height={{xs: '40vh', sm: '90vh'}} sx={{ position: 'relative' }}>
        <Image
          src={'/authPic.png'}
          alt='pic'
          fill
          objectFit='contain'
          objectPosition='left'
          priority
        />
      </Grid2>
      
        {children}
    </Grid2>
  );
};
export default Layout;
