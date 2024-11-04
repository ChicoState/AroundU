import { Document, ObjectId } from 'mongoose';

type EventCategory =
  | 'All'
  | 'Concert'
  | 'Happy Hour'
  | 'Karaoke'
  | 'Yard Sale'
  | 'Other';

type EventData = {
  name: string;
  date: Date;
  address: string;
  description?: string;
  category: EventCategory;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type EventModel = Document &
  EventData & {
    _id: string | ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

type EventQuery = {
  date?: Date | string;
  address?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  category?: EventCategory;
};

export type { EventModel, EventData, EventQuery, EventCategory };
