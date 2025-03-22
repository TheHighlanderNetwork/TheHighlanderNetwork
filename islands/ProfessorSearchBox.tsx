// islands/ProfessorSearchBox.tsx
"use client";
import { useEffect, useState } from "preact/hooks";

interface ProfessorSearchBoxProps {
  onSearch: (newQuery: string) => void;
  initialQuery?: string;
}

export default function ProfessorSearchBox({
  onSearch,
  initialQuery = "",
}: ProfessorSearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);

  // If the parent changes initialQuery, update local input
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function handleSearchClick() {
    onSearch(query);
  }

  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder="Search professors"
        className="w-full px-4 py-2 border rounded-md"
      />
      <span
        onClick={handleSearchClick}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
      >
        <img src="/search.svg" alt="Search" width={20} height={20} />
      </span>
    </div>
  );
}
