import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import SignInDialog from './SignInDialog';

export default function SignInButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="h-fit w-fit" asChild>
        <Button className="bg-blue-500 hover:bg-blue-400">Sign In</Button>
      </DialogTrigger>
      <DialogContent>
        <SignInDialog onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
