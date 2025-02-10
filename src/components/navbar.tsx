'use client';

import {
  FavoriteBorderOutlined,
  ShoppingCartOutlined,
  Menu as MenuIcon,
  Home,
  Info,
  Login,
  Details,
  Person,
  ShoppingBag,
  Logout,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  styled,
  SwipeableDrawer,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { fetchFavourite } from '@/redux/favouriteSlice';
import { fetchCategories } from '@/redux/categorySlice';
import { fetchTags } from '@/redux/tagSlice';

interface NavbarProps {
  mode: 'light' | 'dark';
  setMode: Dispatch<SetStateAction<'light' | 'dark'>>;
}

interface DrawerProps extends NavbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigations = [
  { name: 'Home', url: '/', icon: <Home /> },
  { name: 'Contact', url: '/contact', icon: <Details /> },
  { name: 'About', url: '/about', icon: <Info /> },
  { name: 'Signup', url: '/signup', icon: <Login /> },
];

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const Actions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const Links = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const ActiveLink = styled(Typography)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.text.secondary}`,
}));

const ModeSwitch = styled(Switch)(({ theme }) => ({
  width: 54,
  height: 26,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 24,
    height: 24,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

const Drawer = ({ open, setOpen, mode, setMode }: DrawerProps) => (
  <SwipeableDrawer
    anchor='left'
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    sx={{ display: { xs: 'block', sm: 'none' } }}
  >
    <Box width={250} onClick={() => setOpen(false)}>
      <List>
        {navigations.map(({ name, icon, url }) => (
          <ListItem key={url} disablePadding>
            <Link href={url}>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        <ListItem>
          <FormControlLabel
            control={
              <ModeSwitch
                sx={{ m: 1 }}
                checked={mode === 'dark'}
                onChange={() => {
                  setMode((prev) => {
                    localStorage.setItem(
                      'mode',
                      prev === 'light' ? 'dark' : 'light',
                    );
                    return prev === 'light' ? 'dark' : 'light';
                  });
                }}
              />
            }
            label={`${mode} mode`}
          />
        </ListItem>
      </List>
    </Box>
  </SwipeableDrawer>
);

const Navbar = ({ mode, setMode }: NavbarProps) => {
  const session = useSession();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { status, products } = useAppSelector((state) => state.favourite);

  const menuOpen = Boolean(anchorEl);

  const user = session.data?.user;

  useEffect(() => {
    user && status === 'idle' && dispatch(fetchFavourite());
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
  }, []);

  const handleMenuOpen = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='sticky' elevation={1}>
      <StyledToolbar>
        <Stack direction='row' alignItems={'center'}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer open={open} setOpen={setOpen} mode={mode} setMode={setMode} />
          <Typography variant='h6'>Exclusive</Typography>
        </Stack>
        <Links>
          {navigations.map(({ name, url }) => (
            <Link key={url} href={url}>
              {url === pathname ? (
                <ActiveLink variant='body1'>{name}</ActiveLink>
              ) : (
                <Typography variant='body1' component={'h6'}>
                  {name}
                </Typography>
              )}
            </Link>
          ))}
          <ModeSwitch
            checked={mode === 'dark'}
            onChange={() => {
              setMode((prev) => {
                localStorage.setItem(
                  'mode',
                  prev === 'light' ? 'dark' : 'light',
                );
                return prev === 'light' ? 'dark' : 'light';
              });
            }}
          />
        </Links>
        <Actions>
          <Link href={'/favourite'}>
            <Badge badgeContent={products.length} color='primary'>
              <FavoriteBorderOutlined />
            </Badge>
          </Link>
          <Link href={'/cart'}>
            <Badge badgeContent={4} color='primary'>
              <ShoppingCartOutlined />
            </Badge>
          </Link>
          {user && (
            <Avatar onClick={handleMenuOpen} sx={{ width: 30, height: 30 }} />
          )}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link href={'/profile'}>
                <Person fontSize='small' /> Manage My Account
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href={'/orders'}>
                <ShoppingBag fontSize='small' /> My Order
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut({ redirectTo: '/login' });
                handleMenuClose();
              }}
            >
              <Logout fontSize='small' /> Logout
            </MenuItem>
          </Menu>
        </Actions>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
