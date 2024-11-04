'use client';

import CreateEventButton from '@/components/CreateEventButton';
import { Card, CardTitle } from '@/components/ui/card';

export default function SidebarHeader() {
  return (
    <Card className="flex h-fit">
      <CardTitle className="text-lg font-bold">Events Around You</CardTitle>
      <CreateEventButton />
    </Card>
  );
}
