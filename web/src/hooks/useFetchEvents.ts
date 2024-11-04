import { EventModel } from '@aroundu/shared';
import { useCallback, useEffect, useState } from 'react';

type UseFetchEventsReturn = {
  events: EventModel[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export default function useFetchEvents(
  radius: number,
  userLocation: { lat: number; lng: number } | null,
): UseFetchEventsReturn {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!userLocation) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/events?radius=${radius}&lat=${userLocation.lat}&lng=${userLocation.lng}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || 'Failed to fetch events');
      }
      const { data } = await response.json();
      setEvents(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [radius, userLocation]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
