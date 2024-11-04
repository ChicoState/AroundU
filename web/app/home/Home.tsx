import { Card, CardContent } from '@/components/ui/card';

import Map from './_components/Map';
import Sidebar from './_components/Sidebar';

export default function Home() {
  return (
    <Card className="flex min-h-screen items-center justify-center">
      <Card className="flex min-h-[700px] w-full max-w-6xl flex-row">
        <CardContent className="w-2/3 flex-1 rounded-xl rounded-r-none border border-gray-200 shadow">
          <Map />
        </CardContent>
        <CardContent className="w-1/3 flex-none rounded-xl rounded-l-none border-b border-r border-t border-gray-200 shadow">
          <Sidebar />
        </CardContent>
      </Card>
    </Card>
  );
}
