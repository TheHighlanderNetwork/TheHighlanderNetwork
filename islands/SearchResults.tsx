"use client";
import { useEffect, useState } from "preact/hooks";

interface SearchItem {
  name?: string;
  rating?: number;
  professors?: string[]; // or an array of objects
  courseNames?: string[];
  [key: string]: unknown; // allow extra fields
}

export default function SearchResults({ data = [] }: { data?: SearchItem[] }) {
  const [localData, setLocalData] = useState<SearchItem[]>(data);

  useEffect(() => {
    console.log("SearchResults got new data:", data);
    setLocalData(data);
  }, [data]);

  const shownData = localData.slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        {localData.length === 0
          ? "No results yet."
          : `Showing ${shownData.length} of ${localData.length} result${
            localData.length !== 1 ? "s" : ""
          }`}
      </p>
      {shownData.map((item, idx) => <ItemCard key={idx} item={item} />)}
    </div>
  );
}

function ItemCard({ item }: { item: SearchItem }) {
  // For example, if item looks like:
  // {
  //   name: "A&O SCI 99",
  //   rating: 4.5,
  //   professors: ["Suzanne Poulson", ...],
  //   courseNames: ["A&O SCI 19", "A&O SCI 99"]
  // }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      {/* Course or item name */}
      <h2 className="text-md font-bold mb-1">
        {item.name || "Untitled Entry"}
      </h2>

      {/* Example: show courseNames if present */}
      {item.courseNames && item.courseNames.length > 0 && (
        <p className="text-sm text-blue-600 font-semibold">
          {item.courseNames.join(", ")}
        </p>
      )}

      {/* Example: show rating */}
      {item.rating !== undefined && (
        <p className="text-xs text-gray-500">Rating: {item.rating}</p>
      )}

      {/* Example: show professors if we have them */}
      {item.professors && item.professors.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 font-bold">Professors:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.professors.map((prof, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md"
              >
                {prof}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
