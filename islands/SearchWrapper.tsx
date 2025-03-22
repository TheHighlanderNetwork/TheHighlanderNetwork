"use client";
import { useEffect, useState } from "preact/hooks";
import UsernameHeader from "./UsernameHeader.tsx";
import SearchBox from "./SearchBox.tsx";
import FiltersVertical from "./FiltersVertical.tsx";
import SearchResults from "./SearchResults.tsx";
import { userSearch } from "../utils/firebase/search/search.ts";

interface SearchIslandProps {
  initialQuery: string;
  initialPage: number;
  initialFilter: number;
}

export default function SearchWrapper(
  { initialQuery, initialPage, initialFilter }: SearchIslandProps,
) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [results, setResults] = useState<
    { item: { id: string; name: string; type: number }; score: number }[]
  >([]);
  const [maxPage, setMaxPage] = useState(0);
  const [bitfield, setBitfield] = useState(initialFilter);

  const [numResults, setNumResults] = useState(0);

  useEffect(() => {
    ensurePageParam();
    doSearch(query, bitfield);
  }, [page, query, bitfield]);

  async function doSearch(q: string, b: number) {
    try {
      const data = await userSearch(b, q);
      setMaxPage(Math.ceil(data.length / 10));
      setNumResults(data.length);

      if (page > Math.ceil(data.length / 10)) {
        setPage(Math.ceil(data.length / 10));
      }

      setResults(data.slice(10 * (page - 1), 10 + 10 * (page - 1)));
    } catch (err) {
      console.error("Error fetching data in SearchWrapper:", err);
    }
  }

  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    setPage(1);
    doSearch(newQuery, bitfield);
    updateUrl(newQuery, 1, bitfield);
  }

  function handleFilterChange(newBitfield: number) {
    setBitfield(newBitfield);
    doSearch(query, newBitfield);
    updateUrl(query, page, bitfield);
  }

  function nextPage() {
    if (page < maxPage) {
      const newPage = page + 1;
      setPage(newPage);
      updateUrl(query, newPage, bitfield);
    }
  }

  function prevPage() {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      updateUrl(query, newPage, bitfield);
    }
  }

  function updateUrl(q: string, p: number, filter: number) {
    const encodedQuery = encodeURIComponent(q);
    globalThis.history.pushState(
      {},
      "",
      `/searchwrapper?query=${encodedQuery}&page=${p}&filter=${filter}`,
    );
  }

  function ensurePageParam() {
    const url = new URL(globalThis.location.href);
    if (!url.searchParams.get("page")) {
      url.searchParams.set("page", "1");
      globalThis.history.replaceState({}, "", url.toString());
    }
  }

  return (
    <div className="font-oswald w-screen bg-grey-light flex flex-col">
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
            <div className="mt-4">
              <a
                href="/reviewCreation"
                className="text-blue hover:underline text-sm"
              >
                <button
                  type="button"
                  className="bg-blue text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Add Review
                </button>
              </a>
            </div>
            <UsernameHeader />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {query ? `Results for \"${query}\"` : "Results for"}
          </p>
          <p className="text-xs text-gray-400">
            {numResults} result{numResults !== 1 && "s"}
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
        </aside>

        <main className="flex-1 px-4 py-6 overflow-auto">
          {results.length
            ? results.map((result) => (
              <SearchResults
                key={result.item.id}
                id={result.item.id}
                type={result.item.type}
              />
            ))
            : "No results found."}
        </main>
      </div>

      <footer className="bg-white px-8 py-2 shadow-sm flex items-center justify-center gap-6">
        <button type="button" onClick={prevPage}>
          <img src="/left.svg" alt="Prev" width="20" height="20" />
        </button>
        <span className="text-sm">Page {page} of {maxPage}</span>
        <button type="button" onClick={nextPage}>
          <img src="/right.svg" alt="Next" width="20" height="20" />
        </button>
      </footer>
    </div>
  );
}
