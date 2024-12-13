import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useSignIn from '@/hooks/useSignIn';

type SignInDialogProps = {
  onClose: () => void;
};

export default function SignInDialog({ onClose }: SignInDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({
        username,
        password,
      });
      toast.success('Signed in successfully');
      onClose();
    } catch {
      toast.error(`Failed to sign in: ${error}`);
    }
  };

  return (
    <>
      <DialogTitle>Sign In</DialogTitle>
      <DialogDescription className="mt-2 text-sm text-gray-600">
        Fill in the details below to sign in.
      </DialogDescription>
      <form onSubmit={handleSubmit} className="mt-1 space-y-4">
        <div>
          <Label>Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Enter password"
          />
        </div>
        <Button
          className="ml-auto flex space-x-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </>
  );
}
