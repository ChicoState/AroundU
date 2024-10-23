'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import useFetchEvents from '@/hooks/useFetchEvents';
import { EventType } from '@/types/Event';

type HomeContextState = {
  radius: number;
  setRadius: (radius: number) => void;
  userLocation: {
    lat: number;
    lng: number;
  } | null;
  events: EventType[];
  loading: boolean;
  error: string | null;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
};

const HomeContext = createContext<HomeContextState | undefined>(undefined);

export function HomeProvider({ children }: { children: ReactNode }) {
  const [radius, setRadius] = useState<number>(50);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { events, loading, error } = useFetchEvents(radius, userLocation);

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
      radius,
      setRadius,
      userLocation,
      events,
      loading,
      error,
      categoryFilter,
      setCategoryFilter,
    }),
    [radius, userLocation, events, loading, error, categoryFilter],
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
