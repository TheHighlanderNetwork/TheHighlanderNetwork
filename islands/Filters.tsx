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
    <div className="flex flex-row gap-4 mb-4 justify-center text-lg">
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={(bitfield & 0b1000) !== 0}
          onChange={() => toggleBit(3)}
        />
        Professors
      </label>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={(bitfield & 0b0100) !== 0}
          onChange={() => toggleBit(2)}
        />
        Classes
      </label>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={(bitfield & 0b0010) !== 0}
          onChange={() => toggleBit(1)}
        />
        Businesses
      </label>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={(bitfield & 0b0001) !== 0}
          onChange={() => toggleBit(0)}
        />
        Clubs
      </label>
    </div>
  );
}
