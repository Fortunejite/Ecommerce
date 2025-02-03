'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

const Proividers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme('dark')} defaultMode='system'>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Proividers;
