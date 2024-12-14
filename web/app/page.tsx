import Header from '@/components/header/Header';
import HomeProvider from '@/providers/HomeProvider';

import Home from './home/Home';

export default function RootPage() {
  return (
    <HomeProvider>
      <Header />
      <Home />
    </HomeProvider>
  );
}
