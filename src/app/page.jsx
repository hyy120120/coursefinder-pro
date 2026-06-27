'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/dashboard' : '/auth/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <div className="spinner spinner-lg mx-auto mb-4" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
