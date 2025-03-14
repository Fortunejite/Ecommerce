'use client';

import { Add, ShoppingCart, Category, Store } from '@mui/icons-material';
import { Paper, Grid2, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) return null;
  const { user } = session;

  const actions = [
    {
      label: 'Add New Perfume',
      icon: <Add sx={{ fontSize: 48 }} />,
      onClick: () => router.push('/admin/new-product'),
    },
    {
      label: 'Manage Products',
      icon: <Category sx={{ fontSize: 48 }} />,
      onClick: () => router.push('/admin/products'),
    },
    {
      label: 'Manage Brands',
      icon: <Store sx={{ fontSize: 48 }} />,
      onClick: () => router.push('/admin/brands'),
    },
    {
      label: 'Manage Orders',
      icon: <ShoppingCart sx={{ fontSize: 48 }} />,
      onClick: () => router.push('/admin/orders'),
    },
  ];

  return (
    <Stack p={{ xs: 2, sm: 4 }} spacing={3}>
      <Typography variant="h4" fontWeight="bold">
        Welcome, {user.name}
      </Typography>
      <Typography variant="subtitle1" textAlign="center" color="text.secondary">
        What would you like to do today?
      </Typography>
      <Grid2 container spacing={3}>
        {actions.map((action, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={action.onClick}
            >
              {action.icon}
              <Typography variant="subtitle1" mt={1}>
                {action.label}
              </Typography>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
};

export default Dashboard;
