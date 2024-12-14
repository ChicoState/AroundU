'use client';

import { useState } from 'react';

type UseSignOutReturn = {
  signOut: () => Promise<void>;
  loading: boolean;
};

export default function useSignOut(): UseSignOutReturn {
  const [loading, setLoading] = useState<boolean>(false);

  const signOut = async () => {
    setLoading(true);
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
        const res = await response.json();
        throw new Error(res.message || 'Failed to sign out');
      }
    } catch (err) {
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading };
}
