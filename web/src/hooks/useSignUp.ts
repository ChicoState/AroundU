'use client';

import { useState } from 'react';

type UseSignUpReturn = {
  signUp: (signUpParams: {
    username: string;
    password: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function useSignUp(): UseSignUpReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (signUpParams: {
    username: string;
    password: string;
  }) => {
    const { username, password } = signUpParams;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || 'Failed to sign up');
        throw new Error(resData.message || 'Failed to sign up');
      }
    } catch (err) {
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}
