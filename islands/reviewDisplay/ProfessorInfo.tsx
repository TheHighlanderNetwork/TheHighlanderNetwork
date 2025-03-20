import { useEffect, useState } from "preact/hooks";
import { retrieveDocument } from "../../utils/firebase/docRetrieval/retrieve.ts";

export default function ProfessorInfo({ netid }: { netid: string }) {
  const [professor, setProfessor] = useState<Record<string, unknown>>(null);
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProfessor() {
      console.log("Retrieving professor's info");
      const data = await retrieveDocument("professors", netid);

      console.log(data);

      setProfessor(data);
      const all_courses = await retrieveDocument("all_entries", "courses");

      const courseNames: string[] = data.classes.map((id: string) =>
        all_courses[id] || "Unknown Course"
      ).sort();
      setClasses(courseNames);
    }
    fetchProfessor();
  }, [netid]);

  if (!professor) return <p>Loading professor information...</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{professor.name}</h2>
      <p className="text-gray-600">{professor.department}</p>
      <h3 className="mt-2 font-semibold">Recent Classes:</h3>
      <ul className="list-disc pl-5">
        {classes.length > 0
          ? (
            classes.map((course, index) => <li key={index}>{course}</li>)
          )
          : <li>No classes found.</li>}
      </ul>
    </div>
  );
}
