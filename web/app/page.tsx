import Navigation from '@/components/navigation/Navigation';
import HomeProvider from '@/providers/HomeProvider';

import Home from './home/Home';

export default function RootPage() {
  return (
    <HomeProvider>
      <Navigation />
      <Home />
    </HomeProvider>
  );
}
