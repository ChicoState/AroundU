import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import SignUpDialog from './SignUpDialog';

export default function SignUpButton({
  refetchSession,
}: {
  refetchSession: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="h-fit w-fit" asChild>
        <Button className="bg-blue-500 hover:bg-blue-400">Sign Up</Button>
      </DialogTrigger>
      <DialogContent>
        <SignUpDialog
          refetchSession={refetchSession}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
