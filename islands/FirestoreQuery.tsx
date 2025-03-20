import { useState } from "preact/hooks";
import {
  retrieveDocFromSearch,
  userSearch,
} from "../utils/firebase/search/search.ts";

function FirestoreQuery() {
  const [data, setData] = useState<unknown[]>([]);
  const [query, setQuery] = useState("");
  const [bitfield, setBitfield] = useState(0b1100);

  const handleSearch = async () => {
    const result = await retrieveDocFromSearch(
      await userSearch(bitfield, query),
    );
    setData([result]);
  };

  const toggleBit = (position: number) => {
    setBitfield((prev) => prev ^ (1 << position));
  };

  return (
    <div>
      <h1>Firestore Data</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder="Enter search query"
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={(bitfield & 0b1000) !== 0}
            onChange={() => toggleBit(3)}
          />{" "}
          Professors
        </label>
        <label>
          <input
            type="checkbox"
            checked={(bitfield & 0b0100) !== 0}
            onChange={() => toggleBit(2)}
          />{" "}
          Courses
        </label>
        <label>
          <input
            type="checkbox"
            checked={(bitfield & 0b0010) !== 0}
            onChange={() => toggleBit(1)}
          />{" "}
          Businesses
        </label>
        <label>
          <input
            type="checkbox"
            checked={(bitfield & 0b0001) !== 0}
            onChange={() => toggleBit(0)}
          />{" "}
          Clubs
        </label>
      </div>
      <button type="submit" onClick={handleSearch}>Search</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {JSON.stringify(item, null, 2).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FirestoreQuery;

