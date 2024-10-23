'use client';

import { Card, CardContent } from '@/components/ui/card';

import Map from './_components/Map';
import Sidebar from './_components/Sidebar';

export default function Home() {
  return (
    <Card className="flex min-h-screen items-center justify-center">
      <Card className="flex w-full max-w-6xl flex-row">
        <CardContent className="flex-none">
          <Sidebar />
        </CardContent>
        <CardContent className="w-2/3 flex-1">
          <Map />
        </CardContent>
      </Card>
    </Card>
  );
}
