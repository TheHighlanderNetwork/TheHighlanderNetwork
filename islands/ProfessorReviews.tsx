// professorreviews.tsx
"use client";
import { useEffect, useState } from "preact/hooks";
import { userSearch, getCollectionFromType } from "../utils/firebase/search/search.ts";
import { retrieveDocument } from "../utils/firebase/docRetrieval/retrieve.ts";
import ProfessorSearchBox from "./ProfessorSearchBox.tsx";
import ProfessorResults, { ProfessorDoc } from "./ProfessorResults.tsx";

export default function ProfessorReviews() {
  // State for query, page, filter
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [bitfield, setBitfield] = useState(0b1000); // default to “professors only”
  // The entire fuse results
  const [fuseArray, setFuseArray] = useState<{ id: string; score: number }[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [maxPage, setMaxPage] = useState(1);

  // The doc data for the current page
  const [professors, setProfessors] = useState<ProfessorDoc[]>([]);

  // On mount, parse the URL
  useEffect(() => {
    const url = new URL(globalThis.location.href);
    const qParam = url.searchParams.get("query") || "";
    const pParam = Number(url.searchParams.get("page") || 1);
    const fParam = Number(url.searchParams.get("filter") || 0b1000);

    setQuery(qParam);
    setPage(pParam);
    setBitfield(fParam);

    doSearch(qParam, pParam, fParam);
  }, []);

  // The main search function
  async function doSearch(q: string, p: number, bf: number) {
    try {
      // 1) userSearch => fuse results
      const fuseData = await userSearch(bf, q);
      const results = fuseData.map((r) => ({ id: r.item.id, score: r.score }));
      setFuseArray(results);
      setTotalResults(results.length);

      // 2) pagination
      const pageSize = 10;
      const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
      const clampedPage = Math.min(Math.max(p, 1), totalPages);
      setMaxPage(totalPages);
      setPage(clampedPage);

      // slice for the current page
      const startIndex = (clampedPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageSlice = results.slice(startIndex, endIndex);

      // 3) retrieve docs from Firestore
      const docs: ProfessorDoc[] = [];
      for (const r of pageSlice) {
        // if your fuse results store item.type, you can do getCollectionFromType(r.item.type)
        // but if it’s only professors, we can do type=1 => “professors”
        const data = await retrieveDocument(getCollectionFromType(1), r.id);
        docs.push({ id: r.id, ...data });
      }
      setProfessors(docs);

      // 4) update the URL
      updateUrl(q, clampedPage, bf);
    } catch (err) {
      console.error("Error searching professors:", err);
    }
  }

  // Update the address bar to reflect query, page, filter
  function updateUrl(q: string, p: number, bf: number) {
    const encoded = encodeURIComponent(q);
    const newUrl = `/reviewprofessors?query=${encoded}&page=${p}&filter=${bf}`;
    globalThis.history.pushState({}, "", newUrl);
  }

  // Called when user changes the query from the search box
  function handleSearchBox(newQuery: string) {
    // reset page=1
    doSearch(newQuery, 1, bitfield);
  }

  // Toggling bits for filter
  function toggleBit(position: number) {
    const newBF = bitfield ^ (1 << position);
    doSearch(query, 1, newBF);
  }

  function nextPage() {
    if (page < maxPage) {
      doSearch(query, page + 1, bitfield);
    }
  }

  function prevPage() {
    if (page > 1) {
      doSearch(query, page - 1, bitfield);
    }
  }

  return (
    <div className="font-oswald w-screen bg-grey-light flex flex-col">
      {/* Top bar (optional) */}
      <div className="bg-white px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-bold">Professor Reviews</h1>
      </div>

      <div className="flex flex-1">
        {/* LEFT SIDEBAR: Search + Filter */}
        <aside className="w-64 bg-white p-6 shadow-sm flex flex-col gap-4">
          <ProfessorSearchBox
            onSearch={handleSearchBox}
            initialQuery={query}
          />
        </aside>

        {/* MAIN CONTENT: no internal scroll, we rely on pagination */}
        <main className="flex-1 p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {query ? `Results for "${query}"` : "All Professors"}
            </p>
            <p className="text-xs text-gray-400">
              {totalResults} result{totalResults !== 1 && "s"}
            </p>
          </div>

          {/* The docs for this page */}
          <ProfessorResults profs={professors} />

          {/* Pagination controls */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button onClick={prevPage} disabled={page <= 1}>
              <img src="/left.svg" alt="Prev" width="20" height="20" />
            </button>
            <span className="text-sm">
              Page {page} of {maxPage}
            </span>
            <button onClick={nextPage} disabled={page >= maxPage}>
              <img src="/right.svg" alt="Next" width="20" height="20" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
