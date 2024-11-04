'use client';

import { EventCategory, EventModel } from '@aroundu/shared';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import useFetchEvents from '@/hooks/useFetchEvents';

type HomeContextState = {
  radius: number;
  setRadius: (radius: number) => void;
  userLocation: {
    lat: number;
    lng: number;
  } | null;
  events: EventModel[];
  loading: boolean;
  error: string | null;
  refetchEvents: () => void;
  categoryFilter: EventCategory;
  setCategoryFilter: (category: EventCategory) => void;
  selectedEventId: { id: string | null; triggerCount: number };
  setSelectedEventId: (selection: {
    id: string | null;
    triggerCount: number;
  }) => void;
};

const HomeContext = createContext<HomeContextState | undefined>(undefined);

export function HomeProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [radius, setRadius] = useState<number>(3);
  const { events, loading, error, refetch } = useFetchEvents(
    radius,
    userLocation,
  );

  const [categoryFilter, setCategoryFilter] = useState<EventCategory>('All');
  const [selectedEventId, setSelectedEventId] = useState<{
    id: string | null;
    triggerCount: number;
  }>({ id: null, triggerCount: 0 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setUserLocation(null);
        },
      );
    } else {
      setUserLocation(null);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      userLocation,
      radius,
      setRadius,
      events,
      loading,
      error,
      refetchEvents: refetch,
      categoryFilter,
      setCategoryFilter,
      selectedEventId,
      setSelectedEventId,
    }),
    [
      userLocation,
      radius,
      events,
      loading,
      error,
      refetch,
      categoryFilter,
      selectedEventId,
    ],
  );

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
}

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};
