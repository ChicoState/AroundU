'use client';

import SidebarEventFilters from '@/components/sidebar/SidebarEventFilters';
import SidebarEventList from '@/components/sidebar/SidebarEventList';
import SidebarHeader from '@/components/sidebar/SidebarHeader';
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
    searchFilter,
    setSearchFilter,
  } = useHomeContext();

  return (
    <Card className="flex max-h-[700px] flex-col rounded-xl p-3">
      <SidebarHeader />
      <SidebarEventFilters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        radius={radius}
        setRadius={setRadius}
      />
      <SidebarEventList
        radius={radius}
        events={events}
        loading={loading}
        error={error}
        categoryFilter={categoryFilter}
        searchFilter={searchFilter}
      />
    </Card>
  );
}
