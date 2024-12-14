'use client';

import { useState } from 'react';

type UseSignUpReturn = {
  signUp: (signUpParams: {
    username: string;
    password: string;
  }) => Promise<void>;
  loading: boolean;
};

export default function useSignUp(): UseSignUpReturn {
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async (signUpParams: {
    username: string;
    password: string;
  }) => {
    const { username, password } = signUpParams;
    setLoading(true);
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
        const res = await response.json();
        throw new Error(res.message || 'Failed to sign up');
      }
    } catch (err) {
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
}
