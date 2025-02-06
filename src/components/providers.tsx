'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { useState } from 'react';
import Navbar from './navbar';

const Proividers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  return (
    <SessionProvider>
      <ThemeProvider theme={theme(mode)}>
        <CssBaseline />
        <Navbar mode={mode} setMode={setMode} />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Proividers;
