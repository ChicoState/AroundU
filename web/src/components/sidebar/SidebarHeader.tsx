import CreateEventButton from '@/components/sidebar/CreateEventButton';
import { Card, CardTitle } from '@/components/ui/card';

export default function SidebarHeader() {
  return (
    <Card className="flex h-fit">
      <CardTitle className="text-lg font-bold">Nearby Events</CardTitle>
      <CreateEventButton />
    </Card>
  );
}
