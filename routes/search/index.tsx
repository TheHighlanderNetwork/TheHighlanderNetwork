import SearchResults from "../../islands/search/SearchResults.tsx";

export default function SearchPage(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("query") || "";
  const searchPage = Number(url.searchParams.get("page")) || 1;

  return (
    <div>
      <h1>Search Page</h1>
      <SearchResults initialQuery={searchQuery} initialPage={searchPage} />
    </div>
  );
}
