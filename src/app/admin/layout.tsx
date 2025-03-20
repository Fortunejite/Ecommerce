'use client';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { notFound, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const isAdmin = session?.user?.isAdmin;
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?callback=/admin');
    }
    if (sessionStatus === 'authenticated' && !isAdmin) return notFound();
  }, [sessionStatus, session, router]);

  return children;
};

export default Layout;
