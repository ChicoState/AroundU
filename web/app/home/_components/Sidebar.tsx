'use client';

import SidebarEventFilters from '@/components/SidebarEventFilters';
import SidebarEventList from '@/components/SidebarEventList';
import SidebarHeader from '@/components/SidebarHeader';
import { Card } from '@/components/ui/card';
import { useHomeContext } from '@/providers/HomeProvider';

export default function Sidebar() {
  const {
    radius,
    setRadius,
    events,
    loading,
    error,
    categoryFilter,
    setCategoryFilter,
  } = useHomeContext();

  return (
    <Card className="flex max-h-[700px] flex-col rounded-xl p-3">
      <SidebarHeader />
      <SidebarEventFilters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        radius={radius}
        setRadius={setRadius}
      />
      <SidebarEventList
        radius={radius}
        events={events}
        loading={loading}
        error={error}
        categoryFilter={categoryFilter}
      />
    </Card>
  );
}
