'use client';

import {
  FavoriteBorderOutlined,
  ShoppingCartOutlined,
  Menu as MenuIcon,
  Person,
  ShoppingBag,
  Logout,
  SupervisorAccount,
  KeyboardArrowRight,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Stack,
  styled,
  SwipeableDrawer,
  Switch,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  MouseEvent,
} from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { fetchFavourite } from '@/redux/favouriteSlice';
import { fetchCart } from '@/redux/cartSlice';
import { fetchBrands } from '@/redux/brandSlice';
import { FraganceFamily } from '@/lib/perfumeDetails';

interface NavbarProps {
  mode: 'light' | 'dark';
  setMode: Dispatch<SetStateAction<'light' | 'dark'>>;
}

interface DrawerProps extends NavbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const parseStringToParams = ({
  title,
  value,
  field,
}: {
  title: string;
  value: string;
  field: string;
}) => {
  const params = new URLSearchParams();
  params.append('field', field);
  params.append('value', value);
  params.append('title', title);
  return params.toString();
};

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    pr: 1,
  },
}));

const Actions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

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

// Drawer component with nested view and right arrow for items with children.
const DrawerComponent = ({ open, setOpen, mode, setMode }: DrawerProps) => {
  const handleModeToggle = useCallback(() => {
    setMode((prev) => {
      const nextMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('mode', nextMode);
      return nextMode;
    });
  }, [setMode]);

  const router = useRouter();
  const { brands } = useAppSelector((state) => state.brand);

  // The items variable uses nested children.
  const items = [
    { name: 'All Perfume', url: '/products' },
    {
      name: 'All brands',
      children: brands.map((brand) => ({
        name: brand.name,
        url: `/collections/brands/${brand.name}`,
      })),
    },
    {
      name: 'Find your fragrance',
      children: FraganceFamily.map((fragrance) => ({
        name: fragrance,
        url: `/collections/fragrance-family/${fragrance}`,
      })),
    },
    {
      name: 'New fragrance',
      url: `/collections?${parseStringToParams({
        title: 'New fragrance',
        field: 'sort',
        value: 'date',
      })}`,
    },
    {
      name: 'Best selling',
      url: `/collections?${parseStringToParams({
        title: 'Best selling',
        field: 'sales',
        value: 'desc',
      })}`,
    },
  ];

  // State for handling the nested (child) view.
  const [nestedItems, setNestedItems] = useState<
    { name: string; url: string }[] | null
  >(null);
  const [nestedTitle, setNestedTitle] = useState('');

  const handleParentClick = (
    item:
      | {
          name: string;
          url: string;
          children?: undefined;
        }
      | {
          name: string;
          children: {
            name: string;
            url: string;
          }[];
          url?: undefined;
        },
  ) => {
    if (item.children) {
      setNestedItems(item.children);
      setNestedTitle(item.name);
    } else {
      setOpen(false);
      router.push(item.url);
    }
  };

  return (
    <SwipeableDrawer
      anchor='left'
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          top: '64px', // adjust to your Navbar height
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <Box
        width={250}
        position='relative'
        height='100%'
        bgcolor='background.default'
      >
        <List>
          {items.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton onClick={() => handleParentClick(item)}>
                <ListItemText primary={item.name} />
                {item.children && <KeyboardArrowRight />}
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem>
            <FormControlLabel
              control={
                <ModeSwitch
                  sx={{ m: 1 }}
                  checked={mode === 'dark'}
                  onChange={handleModeToggle}
                />
              }
              label={`${mode} mode`}
            />
          </ListItem>
        </List>

        {/* Nested view overlay with slide animation */}
        <Slide
          direction='left'
          in={Boolean(nestedItems)}
          mountOnEnter
          unmountOnExit
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 250,
              height: '100%',
              backgroundColor: 'background.default',
              zIndex: 10,
              boxShadow: 3,
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setNestedItems(null)}>
                  <ListItemIcon>
                    <ArrowBackIcon />
                  </ListItemIcon>
                  <ListItemText primary={nestedTitle} />
                </ListItemButton>
              </ListItem>
              {nestedItems?.map((child) => (
                <ListItem
                  key={child.name}
                  disablePadding
                  onClick={() => setOpen(false)}
                >
                  <ListItemButton component={Link} href={child.url}>
                    <ListItemText primary={child.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Slide>
      </Box>
    </SwipeableDrawer>
  );
};

// Navbar component with search area behavior.
const Navbar = ({ mode, setMode }: NavbarProps) => {
  const { data: session, status: sessionStatus } = useSession();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const { status: favStatus, products: favorites } = useAppSelector(
    (state) => state.favourite,
  );
  const { status: cartStatus, items: cart } = useAppSelector(
    (state) => state.cart,
  );
  const user = session?.user;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Search state (used for both desktop and mobile)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  // For mobile: when the search icon is clicked, show a full-screen search overlay.
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  // Dummy search results logic: filter a dummy list by searchQuery.
  const dummyData = ['Red Roses', 'Blue Ocean', 'Green Forest', 'Yellow Sun'];
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = dummyData.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (sessionStatus !== 'unauthenticated' && favStatus === 'idle') {
      dispatch(fetchFavourite());
    }
    if (sessionStatus !== 'unauthenticated' && cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [dispatch, sessionStatus, favStatus, cartStatus]);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleMenuOpen = useCallback((e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <AppBar position='sticky' elevation={1}>
      <StyledToolbar>
        <Stack direction='row' gap={1}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ alignItems: 'center', p: 0 }}
            aria-label='Open navigation menu'
          >
            <MenuIcon />
          </IconButton>
          <DrawerComponent
            open={drawerOpen}
            setOpen={setDrawerOpen}
            mode={mode}
            setMode={setMode}
          />
          <Typography variant='h6'>Exclusive</Typography>
        </Stack>
        {/* Desktop Search Area */}
        {!isMobile && (
          <Box
            sx={{
              position: 'relative',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              width: '50%',
            }}
          >
            <TextField
              placeholder='Search...'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 1,
                width: '100%',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {showSearchResults && searchResults.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  zIndex: 100,
                  mt: 1,
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {searchResults.map((result, idx) => (
                  <Typography key={idx} variant='body2' sx={{ py: 1 }}>
                    {result}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        )}
        {/* Mobile: Show only search icon */}
        <Actions>
          {isMobile && (
            <IconButton
              sx={{ px: 0 }}
              onClick={() => setMobileSearchActive(true)}
              color='inherit'
            >
              <SearchIcon />
            </IconButton>
          )}
          <Link href='/favourite' passHref>
            <Badge badgeContent={favorites.length} color='primary'>
              <FavoriteBorderOutlined />
            </Badge>
          </Link>
          <Link href='/cart' passHref>
            <Badge badgeContent={cart.length} color='primary'>
              <ShoppingCartOutlined />
            </Badge>
          </Link>
          {user?.isAdmin && (
            <IconButton
              component={Link}
              href='/admin'
              sx={{
                p: 0,
              }}
            >
              <SupervisorAccount />
            </IconButton>
          )}
          {user && (
            <Avatar
              onClick={handleMenuOpen}
              sx={{ width: 30, height: 30, cursor: 'pointer' }}
              alt='User avatar'
            />
          )}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              href='/profile'
            >
              <Person fontSize='small' />
              &nbsp;Manage My Account
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} href='/orders'>
              <ShoppingBag fontSize='small' />
              &nbsp;My Order
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut({ redirectTo: '/login' });
                handleMenuClose();
              }}
            >
              <Logout fontSize='small' />
              &nbsp;Logout
            </MenuItem>
          </Menu>
        </Actions>
      </StyledToolbar>
      {/* Mobile Search Overlay */}
      {isMobile && mobileSearchActive && (
        <Box
          sx={{
            position: 'absolute',
            top: '64px', // adjust based on your navbar height
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            zIndex: 200,
            p: 2,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1} mb={2}>
            <IconButton onClick={() => setMobileSearchActive(false)}>
              <ArrowBackIcon />
            </IconButton>
            <TextField
              fullWidth
              placeholder='Search...'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          {searchQuery && searchResults.length > 0 && (
            <Box>
              {searchResults.map((result, idx) => (
                <Typography key={idx} variant='body2' sx={{ py: 1 }}>
                  {result}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
