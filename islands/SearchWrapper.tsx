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

  // We'll store a page number in state
  const [page, setPage] = useState(1);

  // Ensure URL has &page=1 if missing
  useEffect(() => {
    ensurePageParam();
    doSearch(query, bitfield);
  }, []);

  async function doSearch(q: string, b: number) {
    try {
      console.log("Performing search with bitfield:", b, "and query:", q);
      const fuseResults = await userSearch(b, q);
      const docData = await retrieveDocFromSearch(fuseResults);
      const finalData = Array.isArray(docData) ? docData : [docData];

      let typedData: SearchItem[] = finalData.map((item) => item as SearchItem);

      // Convert classes[] → courseNames[]
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

  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    // Reset to page=1 for a new query
    setPage(1);

    doSearch(newQuery, bitfield);
    updateUrl(newQuery, 1);
  }

  function handleFilterChange(newBitfield: number) {
    setBitfield(newBitfield);
    doSearch(query, newBitfield);
  }

  function nextPage() {
    const newPage = page + 1;
    setPage(newPage);
    updateUrl(query, newPage);
    // If you want to do actual paging, call doSearch(query, bitfield, newPage)
  }

  function prevPage() {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      updateUrl(query, newPage);
      // doSearch(query, bitfield, newPage)
    }
  }

  // Updates the browser URL with &page=...
  function updateUrl(q: string, p: number) {
    const encodedQuery = encodeURIComponent(q);
    globalThis.history.pushState(
      {},
      "",
      `/searchwrapper?query=${encodedQuery}&page=${p}`,
    );
  }

  // Checks the current URL for a "page" param; if missing, append &page=1
  function ensurePageParam() {
    const url = new URL(globalThis.location.href);
    if (!url.searchParams.get("page")) {
      url.searchParams.set("page", "1");
      globalThis.history.replaceState({}, "", url.toString());
    }
  }

  return (
    <div className="font-oswald w-screen h-screen bg-grey-light flex flex-col">
      {/* Header */}
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
              <SearchBox onResults={handleSearch} initialQuery={query} />
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

      {/* Main Layout */}
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

      {/* Footer with pagination controls */}
      <footer className="bg-white px-8 py-2 shadow-sm flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={prevPage}
          className="flex items-center gap-1"
        >
          <img src="/left.svg" alt="Prev" width="20" height="20" />
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          type="button"
          onClick={nextPage}
          className="flex items-center gap-1"
        >
          <img src="/right.svg" alt="Next" width="20" height="20" />
        </button>
      </footer>
    </div>
  );
}
