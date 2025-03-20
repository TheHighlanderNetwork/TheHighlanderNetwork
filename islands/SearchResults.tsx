"use client";
import { useEffect, useState } from "preact/hooks";

// Example item shape
export interface SearchItem {
  name?: string;
  department?: string;
  classes?: string[];
  courseNames?: string[];
  // ... any other fields you expect
  [key: string]: unknown;
}

interface SearchResultsProps {
  data: SearchItem[];
}

export default function SearchResults({ data }: SearchResultsProps) {
  const [localData, setLocalData] = useState<SearchItem[]>(data);

  useEffect(() => {
    console.log("SearchResults got new data:", data);
    setLocalData(data);
  }, [data]);

  // Only show the first 10 items
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
      {shownData.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded-md shadow-sm">
          {/* Example usage of fields */}
          <p className="font-bold text-sm">
            {item.name || "Unnamed Entry"}
          </p>
          {item.department && (
            <p className="text-xs text-gray-600">
              Dept: {item.department}
            </p>
          )}
          {item.courseNames && (
            <p className="text-xs text-blue-600 mt-1">
              Courses: {item.courseNames.join(", ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
