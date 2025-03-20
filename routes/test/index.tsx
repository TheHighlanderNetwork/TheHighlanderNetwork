// src/routes/index.tsx
import FirestoreQuery from "../../islands/FirestoreQuery.tsx";

export default function Home() {
  return (
    <div>
      <h1>Search test</h1>
      <FirestoreQuery />
    </div>
  );
}
