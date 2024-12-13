'use client';

import { useState } from 'react';

type UseSignInReturn = {
  signIn: (signInParams: {
    username: string;
    password: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function useSignIn(): UseSignInReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (signInParams: {
    username: string;
    password: string;
  }) => {
    const { username, password } = signInParams;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || 'Failed to sign in');
        throw new Error(resData.message || 'Failed to sign in');
      }
    } catch (err) {
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
}
