"use client";
import { useState } from "preact/hooks";

interface FiltersProps {
  onFilterChange: (bitfield: number) => void;
  initialBitfield?: number;
}

export default function Filters({
  onFilterChange,
  initialBitfield = 0b1100,
}: FiltersProps) {
  const [bitfield, setBitfield] = useState(initialBitfield);

  function toggleBit(position: number) {
    const newBitfield = bitfield ^ (1 << position);
    setBitfield(newBitfield);
    onFilterChange(newBitfield);
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm">
        <input
          type="checkbox"
          className="mr-2"
          checked={(bitfield & 0b1000) !== 0}
          onChange={() => toggleBit(3)}
        />
        Professors
      </label>
      <label className="text-sm">
        <input
          type="checkbox"
          className="mr-2"
          checked={(bitfield & 0b0100) !== 0}
          onChange={() => toggleBit(2)}
        />
        Classes
      </label>
      <label className="text-sm">
        <input
          type="checkbox"
          className="mr-2"
          checked={(bitfield & 0b0010) !== 0}
          onChange={() => toggleBit(1)}
        />
        Businesses
      </label>
      <label className="text-sm">
        <input
          type="checkbox"
          className="mr-2"
          checked={(bitfield & 0b0001) !== 0}
          onChange={() => toggleBit(0)}
        />
        Clubs
      </label>
    </div>
  );
}
