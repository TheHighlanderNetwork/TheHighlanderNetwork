// src/components/FirestoreQuery.tsx
import { useEffect, useState } from "preact/hooks";
import { userSearch } from "../utils/firebase/search/search.ts";
function FirestoreQuery() {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    const search = async () => {
      setData([await userSearch(0b1100, "cs10c")]);
    };

    search();
  }, []);

  return (
    <div>
      <h1>Firestore Data</h1>
      <ul>
        {data.map((item, index) => <li key={index}>{JSON.stringify(item)}</li>)}
      </ul>
    </div>
  );
}

export default FirestoreQuery;
