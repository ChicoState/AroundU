'use client';

import { EventCategory } from '@aroundu/shared';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import useFetchEvents from '@/hooks/useFetchEvents';
import HomeContextState from '@/types/context';

const HomeContext = createContext<HomeContextState | undefined>(undefined);

function HomeProvider({ children }: { children: ReactNode }) {
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

const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};

export { useHomeContext };
export default HomeProvider;
