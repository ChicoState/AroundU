import { useCallback, useEffect, useState } from 'react';

type UseFetchSessionReturn = {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export default function useFetchSession(): UseFetchSessionReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || 'Failed to fetch session');
      }
      const { data } = await response.json();
      setIsAuthenticated(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { isAuthenticated, loading, error, refetch: fetchSession };
}
