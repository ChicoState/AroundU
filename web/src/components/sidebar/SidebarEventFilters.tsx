import { EventCategory } from '@aroundu/shared';
import React from 'react';

import FilterIcon from '@/assets/filter.svg';
// import SearchIcon from '@/assets/search.svg';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import RadiusSlider from './RadiusSlider';
// import { Button } from './ui/button';

type SidebarEventFiltersProps = {
  radius: number;
  setRadius: (radius: number) => void;
  categoryFilter: EventCategory;
  setCategoryFilter: (category: EventCategory) => void;
};

export default function SidebarEventFilters({
  radius,
  setRadius,
  categoryFilter,
  setCategoryFilter,
}: SidebarEventFiltersProps) {
  return (
    <Card className="flex gap-3 pt-3">
      <RadiusSlider radius={radius} setRadius={setRadius} />
      <Select
        value={categoryFilter}
        onValueChange={(value: EventCategory) => setCategoryFilter(value)}
      >
        <SelectTrigger className="flex w-fit gap-2">
          <FilterIcon className="h-[18px] w-[18px]" />
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Concert">Concert</SelectItem>
          <SelectItem value="Happy Hour">Happy Hour</SelectItem>
          <SelectItem value="Karaoke">Karaoke</SelectItem>
          <SelectItem value="Yard Sale">Yard Sale</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
      {/* <Button className="mt-[.3rem] h-fit rounded-full bg-transparent p-1 text-black shadow-none hover:bg-hover">
        <SearchIcon className="h-[18px] w-[18px]" />
      </Button> */}
    </Card>
  );
}
