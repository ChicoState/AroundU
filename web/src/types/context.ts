import { EventCategory, EventModel } from '@aroundu/shared';

type SessionContext = {
  isAuthenticated: boolean;
  refetchSession: () => void;
};

type UserLocationContext = {
  userLocation: {
    lat: number;
    lng: number;
  } | null;
};

type EventsQueryContext = {
  events: EventModel[];
  loading: boolean;
  error: string | null;
  refetchEvents: () => void;
};

type EventsFiltersContext = {
  radius: number;
  setRadius: (radius: number) => void;
  categoryFilter: EventCategory;
  setCategoryFilter: (category: EventCategory) => void;
  searchFilter: string;
  setSearchFilter: (search: string) => void;
};

type EventsContext = EventsQueryContext &
  EventsFiltersContext & {
    selectedEventId: { id: string | null; triggerCount: number };
    setSelectedEventId: (selection: {
      id: string | null;
      triggerCount: number;
    }) => void;
  };

type HomeContextState = SessionContext & UserLocationContext & EventsContext;

export default HomeContextState;
