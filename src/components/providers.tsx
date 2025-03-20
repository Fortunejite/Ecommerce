'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { useState, useEffect } from 'react';
import Navbar from './navbar';
import store from '@/redux/store';

const Proividers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const defaultMode = localStorage.getItem('mode');
    if (defaultMode && (defaultMode === 'light' || defaultMode === 'dark')) {
      setMode(defaultMode);
    }
  }, []);

  return (
    <Provider store={store}>
      <SessionProvider>
        <ThemeProvider theme={theme(mode)}>
          <CssBaseline />
          <Navbar mode={mode} setMode={setMode} />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  );
};

export default Proividers;
