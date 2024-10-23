'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useCreateEvent from '@/hooks/useCreateEvent';

type CreateEventDialogProps = {
  onClose: () => void;
};

export default function CreateEventDialog({ onClose }: CreateEventDialogProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const { createEvent, loading, error } = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        name,
        date,
        address,
        description: description || undefined,
        category,
      });
      toast.success('Event created successfully');
      onClose();
    } catch {
      toast.error(`Failed to create event: ${error}`);
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
          <Label>Date</Label>
          <Input
            type="date"
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
        <Label htmlFor="event-category">Category</Label>
        <select
          id="event-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full rounded-md border p-2"
        >
          <option value="Concert">Concert</option>
          <option value="Happy Hour">Happy Hour</option>
          <option value="Karaoke">Karaoke</option>
          <option value="Yard Sale">Yard Sale</option>
          <option value="Other">Other</option>
        </select>
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </>
  );
}
