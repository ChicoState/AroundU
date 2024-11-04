'use client';

import { EventData } from '@aroundu/shared';
import { useState } from 'react';

type UseCreateEventReturn = {
  createEvent: (eventData: Omit<EventData, 'location'>) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function useCreateEvent(): UseCreateEventReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (eventData: Omit<EventData, 'location'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || 'Failed to create event');
        throw new Error(resData.message || 'Failed to create event');
      }
    } catch (err) {
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, error };
}
