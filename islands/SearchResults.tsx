import { useEffect, useState } from "preact/hooks";
import { userSearch } from "../utils/firebase/search/search.ts";
import SearchIsland from "./Search.tsx";

interface SearchIslandProps {
  initialQuery: string;
  initialPage: number;
}

export default function SearchResults(
  { initialQuery, initialPage }: SearchIslandProps,
) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [results, setResults] = useState<
    { item: { id: string; name: string; type: number }; score: number }[]
  >([]);
  const [maxPage, setMaxPage] = useState(0);

  // Fetch search results whenever query or page changes
  useEffect(() => {
    const fetchData = async () => {
      const data = await userSearch(0b1100, query); // Adjust bitfield as needed
      setMaxPage(Math.ceil(data.length / 10));
      console.log("Max page:", maxPage);

      if (page > Math.ceil(data.length / 10)) {
        setPage(Math.ceil(data.length / 10)); // Adjust page if it exceeds maxPage
      }

      console.log("set results");
      setResults(data.slice(10 * (page - 1), 10 + 10 * (page - 1)));
    };
    fetchData();
  }, [query, page]);

  // Update the URL and perform search
  const handleSearch = (e: Event) => {
    e.preventDefault();
    const newUrl = `/search?query=${encodeURIComponent(query)}&page=1`;
    globalThis.history.pushState({}, "", newUrl);
    setPage(1);
  };

  // Pagination handler
  const goToPage = (newPage: number) => {
    const newUrl = `/search?query=${encodeURIComponent(query)}&page=${newPage}`;
    globalThis.history.pushState({}, "", newUrl);
    setPage(newPage);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Enter search query"
        />
        <button type="submit">Search</button>
      </form>

      <h2>Results:</h2>
      <ul>
        {results.map((result) => (
          <SearchIsland
            key={result.item.id}
            id={result.item.id}
            type={result.item.type}
          />
        ))}
      </ul>

      <div>
        {page > 1 && (
          <button type="button" onClick={() => goToPage(page - 1)}>
            Previous
          </button>
        )}
        <span>Page {page} of {maxPage}</span>
        {page < maxPage && (
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
