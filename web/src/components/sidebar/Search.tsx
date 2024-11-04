import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHomeContext } from '@/providers/HomeProvider';

export default function LiveSearch() {
  const { radius, events, loading, error, categoryFilter } = useHomeContext();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events
    .filter((event) =>
      categoryFilter ? event.category === categoryFilter : true,
    )
    .filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container p-4">
      <Input
        className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="results mt-4 space-y-4 overflow-y-auto">
        {loading && <p>Loading events...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && filteredEvents.length === 0 && (
          <p>No events found within {radius} km.</p>
        )}
        {filteredEvents.map((event) => (
          <Card key={event._id.toString()} className="result-item">
            <CardContent>
              <h3 className="font-semibold">{event.name}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.address}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
