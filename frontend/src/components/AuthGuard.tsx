'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './ui/PageLoader';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push('/'); // Redirect to a safe page if role mismatch
      }
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
