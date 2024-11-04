'use client';

import { useState } from 'react';

import PlusIcon from '@/assets/plus.svg';
import CreateEventDialog from '@/components/CreateEventDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function CreateEventButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="h-fit w-fit" asChild>
        <Button className="ml-auto rounded-xl bg-transparent p-1 text-black shadow-none hover:bg-hover">
          <PlusIcon className="h-[18px] w-[18px]" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CreateEventDialog onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
