import { HomeProvider } from '@/providers/HomeProvider';

import Home from './home/Home';

export default function RootPage() {
  return (
    <HomeProvider>
      <Home />
    </HomeProvider>
  );
}
