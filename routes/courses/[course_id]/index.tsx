import CourseInfo from "../../../islands/CourseInfo.tsx";
import ReviewsIsland from "../../../islands/Reviews.tsx";

export default function CoursePage(
  { params }: { params: { course_id: string } },
) {
  return (
    <div class="max-w-3xl mx-auto p-6">
      {/* Course Info Island */}
      <CourseInfo course_id={params.course_id} />

      {/* Reviews Island */}
      <ReviewsIsland
        query={{ class: params.course_id, type: 2 }}
      />
    </div>
  );
}
