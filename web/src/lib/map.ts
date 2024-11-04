import { EventCategory } from '@aroundu/shared';

const libraries: 'places'[] = ['places'];

const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const categoryIconMap: Record<EventCategory | string, string> = {
  Concert: '/icons/drums.svg',
  HappyHour: '/icons/martini.svg',
  Karaoke: '/icons/microphone.svg',
  YardSale: '/icons/shop.svg',
  Other: '/icons/location.svg',
};

export { categoryIconMap, libraries, mapContainerStyle, mapStyles };
