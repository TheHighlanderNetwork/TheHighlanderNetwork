import { useEffect, useState } from "preact/hooks";
import { retrieveDocument } from "../../utils/firebase/docRetrieval/retrieve.ts";

export default function CourseInfo({ course_id }: { course_id: string }) {
  const [course, setCourse] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      const data = await retrieveDocument("courses", course_id);
      setCourse(data);
    }

    fetchCourse();
  }, [course_id]);

  if (!course) return <p>Loading course information...</p>;

  return (
    <div>
      <h2>{course.courseCode} : {course.title}</h2>
      <p>{course.description}</p>
    </div>
  );
}
