'use client';

import { useState } from 'react';

type UseSignOutReturn = {
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function useSignOut(): UseSignOutReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        credentials: 'include',
      });
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || 'Failed to sign out');
        throw new Error(resData.message || 'Failed to sign out');
      }
    } catch (err) {
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading, error };
}
