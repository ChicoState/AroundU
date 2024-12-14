import { EventCategory } from '@aroundu/shared';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useCreateEvent from '@/hooks/useCreateEvent';
import { useHomeContext } from '@/providers/HomeProvider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type CreateEventDialogProps = {
  onClose: () => void;
};

export default function CreateEventDialog({ onClose }: CreateEventDialogProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Omit<EventCategory, 'All'>>('Other');
  const { createEvent, loading } = useCreateEvent();
  const { refetchEvents } = useHomeContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateObj = new Date(date);
      await createEvent({
        name,
        date: dateObj,
        address,
        description: description || undefined,
        category: category as Partial<EventCategory>,
      });
      toast.success('Event created successfully');
      refetchEvents();
      onClose();
    } catch (error) {
      toast.error(`Failed to create event: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <DialogTitle>Create Event</DialogTitle>
      <DialogDescription className="mt-2 text-sm text-gray-600">
        Fill in the details below to create a new event.
      </DialogDescription>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <Label>Event Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter event name"
          />
        </div>
        <div>
          <Label>Date and Time</Label>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter event address"
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description (optional)"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={(value: EventCategory) => setCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Concert">Concert</SelectItem>
              <SelectItem value="Happy Hour">Happy Hour</SelectItem>
              <SelectItem value="Karaoke">Karaoke</SelectItem>
              <SelectItem value="Yard Sale">Yard Sale</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="ml-auto flex space-x-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </form>
    </>
  );
}
