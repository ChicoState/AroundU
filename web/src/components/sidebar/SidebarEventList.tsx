import { EventCategory, EventModel } from '@aroundu/shared';

import { Card, CardContent } from '@/components/ui/card';
import { useHomeContext } from '@/providers/HomeProvider';

type SidebarEventListProps = {
  radius: number;
  events: EventModel[];
  loading: boolean;
  error: string | null;
  categoryFilter: EventCategory;
};

export default function SidebarEventList({
  radius,
  events,
  loading,
  error,
  categoryFilter,
}: SidebarEventListProps) {
  const { setSelectedEventId, selectedEventId } = useHomeContext();

  return (
    <Card className="overflow-scroll">
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && events.length === 0 && (
        <p>No events found within {radius} km.</p>
      )}
      {events
        .filter((event) =>
          categoryFilter !== 'All' ? event.category === categoryFilter : true,
        )
        .map((event) => (
          <Card
            key={event._id.toString()}
            className="result-item mb-4 cursor-pointer rounded-xl border p-3 shadow"
            onClick={() =>
              setSelectedEventId({
                id: event._id.toString(),
                triggerCount:
                  selectedEventId.id === event._id
                    ? selectedEventId.triggerCount + 1
                    : 0,
              })
            }
          >
            <CardContent>
              <h3 className="font-semibold">{event.name}</h3>
              <p>{new Date(event.date).toUTCString()}</p>
              <p>{event.address}</p>
              <p>{event.description}</p>
              <p>{event.category}</p>
            </CardContent>
          </Card>
        ))}
    </Card>
  );
}
