import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const theme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#DB4444',
        dark: '#DB4444',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: mode === 'light' ? '#F5F5F5' : '#1e1e1e',
        dark: mode === 'dark' ? '#F5F5F5' : '#1e1e1e',
        contrastText: mode === 'light' ? '#212121' : '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212', // Neutral Light or Dark
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E', // Card/Modal Background
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#FFFFFF', // Adjust for light/dark mode
        secondary: mode === 'light' ? '#757575' : '#BDBDBD', // Less prominent text
      },
      error: {
        main: '#D32F2F', // Error Red
      },
      warning: {
        main: '#FFC107', // Warning Yellow
      },
      success: {
        main: '#4CAF50', // Success Green
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
        color: mode === 'light' ? '#212121' : '#FFFFFF',
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: mode === 'light' ? '#212121' : '#FFFFFF',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        color: mode === 'light' ? '#212121' : '#FFFFFF',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        color: mode === 'light' ? '#757575' : '#BDBDBD',
      },
      button: {
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8, // Rounded corners
            padding: '8px 16px', // Comfortable padding
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
          },
        },
      },
    },
  });

export default theme;
