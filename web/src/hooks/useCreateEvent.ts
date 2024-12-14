'use client';

import { EventData } from '@aroundu/shared';
import { useState } from 'react';

type UseCreateEventReturn = {
  createEvent: (eventData: Omit<EventData, 'location'>) => Promise<void>;
  loading: boolean;
};

export default function useCreateEvent(): UseCreateEventReturn {
  const [loading, setLoading] = useState<boolean>(false);

  const createEvent = async (
    eventData: Omit<EventData, 'location'>,
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include',
      });
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Failed to create event');
      }
    } catch (err) {
      throw new Error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading };
}
