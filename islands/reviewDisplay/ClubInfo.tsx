import { useEffect, useState } from "preact/hooks";
import { retrieveDocument } from "../../utils/firebase/docRetrieval/retrieve.ts";

export default function ClubInfo({ club_id }: { club_id: string }) {
  const [club, setClub] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchClub() {
      console.log("Retrieving clubs's info");
      const data = await retrieveDocument("clubs", club_id);

      console.log(data);

      setClub(data);
    }
    fetchClub();
  }, [club_id]);

  if (!club) return <p>Loading club information...</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{club.name ? club.name : ""}</h2>
      <p className="text-gray-600">{club.description ? club.description : ""}</p>
      <p className="text-gray-600">{club.location ? club.location : ""}</p>
    </div>
  );
}
