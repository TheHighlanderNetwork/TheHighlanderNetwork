"use client";
import { useEffect, useState } from "preact/hooks";
import UsernameHeader from "./UsernameHeader.tsx";
import SearchBox from "./SearchBox.tsx";
import FiltersVertical from "./FiltersVertical.tsx";
import SearchResults, { SearchItem } from "./SearchResults.tsx";
import {
  retrieveDocFromSearch,
  userSearch,
} from "../utils/firebase/search/search.ts";
import { retrieveDocument } from "../utils/firebase/docRetrieval/retrieve.ts";

interface SearchWrapperProps {
  initialQuery?: string;
}

export default function SearchWrapper(
  { initialQuery = "" }: SearchWrapperProps,
) {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [bitfield, setBitfield] = useState(0b1100);
  const [query, setQuery] = useState(initialQuery);

  // Perform Firestore search
  async function doSearch(q: string, b: number) {
    try {
      console.log("Performing search with bitfield:", b, "and query:", q);

      const fuseResults = await userSearch(b, q);
      const docData = await retrieveDocFromSearch(fuseResults);
      const finalData = Array.isArray(docData) ? docData : [docData];

      let typedData: SearchItem[] = finalData.map((item) => item as SearchItem);

      const allCourses = await retrieveDocument("all_entries", "courses");
      typedData = typedData.map((item) => {
        if (item.classes && Array.isArray(item.classes)) {
          const courseNames = item.classes
            .map((id) => allCourses[id] || "Unknown Course")
            .sort();
          return { ...item, courseNames };
        }
        return item;
      });

      setResults(typedData);
      setLoaded(true);
    } catch (err) {
      console.error("Error fetching data in SearchWrapper:", err);
    }
  }

  // On mount, do an initial search with initialQuery + bitfield
  useEffect(() => {
    doSearch(query, bitfield);
  }, []);

  // Called by SearchBox when user clicks search icon/button
  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    doSearch(newQuery, bitfield);

    // Update the URL query param (without reloading the page)
    const encoded = encodeURIComponent(newQuery);
    globalThis.history.pushState({}, "", `/searchwrapper?query=${encoded}`);
  }

  // Called by FiltersVertical
  function handleFilterChange(newBitfield: number) {
    setBitfield(newBitfield);
    doSearch(query, newBitfield);
  }

  return (
    <div className="font-oswald w-screen h-screen bg-grey-light flex flex-col">
      <div className="bg-white px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/">
              <div className="flex text-2xl font-bold">
                <h1 className="text-yellow">The Highlander&nbsp;</h1>
                <h1 className="text-blue">Network</h1>
              </div>
            </a>
            <div className="flex-1 min-w-[300px] max-w-2xl">
              {
                /*
                Pass handleSearch to SearchBox.
                Now the child can call onResults(query),
                and we update the URL + doSearch.
              */
              }
              <SearchBox
                onResults={handleSearch}
                initialQuery={query}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-blue hover:underline text-sm">
              Add Review
            </a>
            <UsernameHeader />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {query ? `Results for "${query}"` : "Results for"}
          </p>
          <p className="text-xs text-gray-400">
            {results.length} result{results.length !== 1 && "s"}
          </p>
        </div>
      </div>

      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          <FiltersVertical
            onFilterChange={handleFilterChange}
            initialBitfield={bitfield}
          />
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Sorting</label>
            <select className="w-full border rounded px-2 py-1 text-sm">
              <option>By Rating</option>
              <option>Alphabetical</option>
            </select>
          </div>
          <div className="text-sm mt-6">
            <p className="text-gray-500">Can't find my class</p>
            <p className="text-xs text-gray-400">ADS</p>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 overflow-auto">
          {loaded
            ? <SearchResults data={results} />
            : <p className="text-sm text-gray-500">Loading data...</p>}
        </main>
      </div>
    </div>
  );
}
