"use client";

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-context';
import { Skeleton } from "@/components/ui/skeleton";

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-64 w-full mt-4" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
