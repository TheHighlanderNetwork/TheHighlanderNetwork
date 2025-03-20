"use client";
import { useEffect, useState } from "preact/hooks";
import { retrieveDocument } from "../utils/firebase/docRetrieval/retrieve.ts";
import { getCollectionFromType } from "../utils/firebase/search/search.ts";

// Example item shape
export interface SearchItem {
  name?: string;
  department?: string;
  classes?: string[];
  courseNames?: string[];
  [key: string]: unknown;
}

export default function SearchIsland(
  { id, type }: { id: string; type: number },
) {
  const [info, setInfo] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      const data = await retrieveDocument(getCollectionFromType(type), id);
      console.log("Info:", data);
      setInfo(data);
    }

    fetchCourse();
  }, [id, type]);

  const handleRedirect = () => {
    const currentUrl = globalThis.location.origin;
    const collection = getCollectionFromType(type);
    const redirectTo = `${currentUrl}/${collection}/${id}`; // Modify this URL as needed
    globalThis.location.href = redirectTo;
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">
      </p>
      {info
        ? (
          <div
            className="bg-white p-2 rounded-md shadow-sm cursor-pointer"
            onClick={handleRedirect}
          >
            <div className="bg-white p-4 rounded-md shadow-sm">
              {/* Example usage of fields */}
              <p className="font-bold text-sm">
                {type == 2
                  ? `${info.courseCode || "Unnamed Course"}: ${
                    info.title || "Unnamed Title"
                  }`
                  : `${info.name || "Unnamed Entry"}`}
              </p>
              {info.department && (
                <p className="text-xs text-gray-600">
                  Dept: {info.department}
                </p>
              )}
              {info.courseNames && (
                <p className="text-xs text-blue-600 mt-1">
                  Courses: {info.courseNames.join(", ")}
                </p>
              )}
            </div>
          </div>
        )
        : ""}
    </div>
  );
}
