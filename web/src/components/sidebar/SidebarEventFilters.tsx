import { EventCategory } from '@aroundu/shared';
import React from 'react';

import FilterIcon from '@/assets/filter.svg';
import SearchIcon from '@/assets/search.svg';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '../ui/input';
import RadiusSlider from './RadiusSlider';

type SidebarEventFiltersProps = {
  radius: number;
  setRadius: (radius: number) => void;
  categoryFilter: EventCategory;
  setCategoryFilter: (category: EventCategory) => void;
  searchFilter: string;
  setSearchFilter: (search: string) => void;
};

export default function SidebarEventFilters({
  radius,
  setRadius,
  categoryFilter,
  setCategoryFilter,
  searchFilter,
  setSearchFilter,
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
      <Card className="relative w-full">
        <SearchIcon className="absolute left-[.65rem] top-[1.125rem] h-[18px] w-[18px] -translate-y-1/2 transform text-muted-foreground" />
        <Input
          className="w-full rounded border border-input p-2 pl-9 placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
          placeholder="Search..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </Card>
    </Card>
  );
}
