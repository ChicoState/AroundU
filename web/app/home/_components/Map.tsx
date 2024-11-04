'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

import { Card } from '@/components/ui/card';
import {
  categoryIconMap,
  libraries,
  mapContainerStyle,
  mapStyles,
} from '@/lib/map';
import { useHomeContext } from '@/providers/HomeProvider';

export default function Map() {
  const { userLocation, events, categoryFilter, selectedEventId } =
    useHomeContext();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [mapZoom, setMapZoom] = useState(12);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (userLocation && !selectedEventId.id) {
      setMapCenter(userLocation);
      setMapZoom(15);
      if (mapRef.current) {
        mapRef.current.setCenter(userLocation);
        mapRef.current.setZoom(15);
      }
    }
  }, [selectedEventId.id, userLocation]);

  useEffect(() => {
    if (selectedEventId.id) {
      const selectedEvent = events.find(
        (event) => event._id === selectedEventId.id,
      );
      if (selectedEvent) {
        const { coordinates } = selectedEvent.location;
        const newCenter = { lat: coordinates[1], lng: coordinates[0] };
        setMapCenter(newCenter);
        setMapZoom(16);
        if (mapRef.current) {
          mapRef.current.setCenter(newCenter);
          mapRef.current.setZoom(16);
        }
      }
    }
  }, [selectedEventId, events]);

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
    <Card className="h-full min-h-[600px] rounded-xl p-4">
      <GoogleMap
        zoom={mapZoom}
        center={mapCenter}
        mapContainerStyle={mapContainerStyle}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
        }}
        onLoad={handleMapLoad}
      >
        {userLocation && (
          <Marker
            icon={{
              url: '/icons/house.svg',
              scaledSize: new google.maps.Size(40, 40),
            }}
            position={userLocation}
            title="Your Location"
          />
        )}
        {events
          .filter((event) =>
            categoryFilter !== 'All' ? event.category === categoryFilter : true,
          )
          .map((event) => {
            const lat = event.location.coordinates[1];
            const lng = event.location.coordinates[0];
            if (typeof lat === 'number' && typeof lng === 'number') {
              return (
                <Marker
                  icon={{
                    url: categoryIconMap[event.category.replaceAll(' ', '')],
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                  key={event._id.toString()}
                  position={{ lat, lng }}
                />
              );
            }
            return null;
          })}
      </GoogleMap>
    </Card>
  );
}
