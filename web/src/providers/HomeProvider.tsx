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
import useFetchSession from '@/hooks/useFetchSession';
import HomeContextState from '@/types/context';

const HomeContext = createContext<HomeContextState | undefined>(undefined);

function HomeProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, refetch: refetchSession } = useFetchSession();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [radius, setRadius] = useState<number>(3);
  const {
    events,
    loading,
    error,
    refetch: refetchEvents,
  } = useFetchEvents(radius, userLocation);

  const [categoryFilter, setCategoryFilter] = useState<EventCategory>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
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
      isAuthenticated,
      refetchSession,
      userLocation,
      radius,
      setRadius,
      events,
      loading,
      error,
      refetchEvents,
      categoryFilter,
      setCategoryFilter,
      searchFilter,
      setSearchFilter,
      selectedEventId,
      setSelectedEventId,
    }),
    [
      isAuthenticated,
      refetchSession,
      userLocation,
      radius,
      events,
      loading,
      error,
      refetchEvents,
      categoryFilter,
      searchFilter,
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
