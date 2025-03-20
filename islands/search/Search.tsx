import { useEffect, useState } from "preact/hooks";
import { retrieveDocument } from "../../utils/firebase/docRetrieval/retrieve.ts";
import { getCollectionFromType } from "../../utils/firebase/search/search.ts";

export default function SearchIsland(
  { id, type }: { id: string; type: number },
) {
  const [info, setInfo] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      const data = await retrieveDocument(getCollectionFromType(type), id);
      setInfo(data);
    }

    fetchCourse();
  }, [id, type]);

  if (!info) return <p>Loading course information...</p>;

  return (
    <div>
      <h2>{info.courseCode} : {info.title}</h2>
      <p>{info.description}</p>
    </div>
  );
}
