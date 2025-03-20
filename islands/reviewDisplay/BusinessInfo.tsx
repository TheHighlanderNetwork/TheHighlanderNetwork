import { useEffect, useState } from "preact/hooks";
import { retrieveDocument } from "../../utils/firebase/docRetrieval/retrieve.ts";

export default function ClubInfo({ business_id }: { business_id: string }) {
  const [business, setBusiness] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetch_business() {
      console.log("Retrieving clubs's info");
      const data = await retrieveDocument("businesses", business_id);

      console.log(data);

      setBusiness(data);
    }
    fetch_business();
  }, [business_id]);

  if (!business) return <p>Loading business information...</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{business.name ? business.name : ""}</h2>
      <p className="text-gray-600">{business.description ? business.description : ""}</p>
      <p className="text-gray-600">{business.location ? business.location : ""}</p>
    </div>
  );
}
