"use client";
import { useEffect, useState } from "preact/hooks";

interface SearchBoxProps {
  onResults?: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBox({
  onResults = () => {},
  initialQuery = "",
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  // Keep your bitfield for filters
  const [_bitfield, setBitfield] = useState(0b1100);

  // Update local text input whenever the parent changes initialQuery
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Called when user clicks the icon or the button
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
      {/* Text Input + Magnifying Glass Icon */}
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
