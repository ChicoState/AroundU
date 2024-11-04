'use client';

import { useState } from 'react';

import { Card, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

type RadiusSliderProps = {
  radius: number;
  setRadius: (radius: number) => void;
};

export default function RadiusSlider({ radius, setRadius }: RadiusSliderProps) {
  const [tempRadius, setTempRadius] = useState(radius);
  return (
    <Card>
      <CardDescription className="mb-1 text-sm font-semibold text-black">
        Radius: {tempRadius} km
      </CardDescription>
      <Slider
        value={[tempRadius]}
        onValueChange={(value) => setTempRadius(value[0])}
        onValueCommit={(value) => setRadius(value[0])}
        min={1}
        max={25}
        step={1}
        className="w-full pb-6"
      />
    </Card>
  );
}
