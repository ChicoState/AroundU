'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useHomeContext } from '@/providers/HomeProvider';

const libraries: 'places'[] = ['places'];

const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function Map() {
  const { userLocation, events, categoryFilter } = useHomeContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const center = useMemo(
    () => userLocation || { lat: 37.7749, lng: -122.4194 },
    [userLocation],
  );

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  return (
    <Card className="h-full min-h-[600px] w-full p-4">
      <CardContent className="relative h-full w-full">
        <GoogleMap
          zoom={12}
          center={center}
          mapContainerStyle={mapContainerStyle}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
          }}
        >
          {userLocation && <Marker position={center} title="Your Location" />}
          {events
            .filter(
              (event) => !categoryFilter || event.category === categoryFilter,
            )
            .map((event) => {
              const point = event.coordinates;
              const lat = point.coordinates[1];
              const lng = point.coordinates[0];
              if (typeof lat === 'number' && typeof lng === 'number') {
                return <Marker key={event._id} position={{ lat, lng }} />;
              }
              return null;
            })}
        </GoogleMap>
      </CardContent>
    </Card>
  );
}
