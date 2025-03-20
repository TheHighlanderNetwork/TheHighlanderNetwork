"use client";
import { useEffect, useState } from "preact/hooks";

interface SearchBoxProps {
  // Parent function that receives the typed query
  onResults?: (query: string) => void;
  // Pre-fill the text input with this value
  initialQuery?: string;
}

export default function SearchBox({
  onResults = () => {},
  initialQuery = "",
}: SearchBoxProps) {
  // Local states
  const [query, setQuery] = useState(initialQuery);
  const [_bitfield, setBitfield] = useState(0b1100);

  // Whenever the parent changes initialQuery, update our local text input
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Called when the user clicks the magnifying glass or the Search button
  function handleSearch() {
    try {
      onResults(query);
    } catch (err) {
      console.error("Error performing search:", err);
    }
  }

  function _toggleBit(position: number) {
    setBitfield((prev) => prev ^ (1 << position));
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Enter search query"
          style={{
            width: "100%",
            padding: "10px 40px 10px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            outline: "none",
            fontSize: "14px",
            backgroundColor: "#f9f9f9",
          }}
        />
        <span
          onClick={handleSearch}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#5a5a5a",
          }}
        >
          <img src="/search.svg" width="25" height="25" alt="Search icon" />
        </span>
      </div>
    </div>
  );
}
