import CourseInfo from "../../../islands/CourseInfo.tsx";
import ReviewsIsland from "../../../islands/Reviews.tsx";
import CourseInfo from "../../../islands/reviewDisplay/CourseInfo.tsx";
import ReviewsIsland from "../../../islands/reviewDisplay/Reviews.tsx";


export default function CoursePage(
  { params }: { params: { course_id: string } },
) {
  return (
    <div class="max-w-3xl mx-auto p-6">
      {/* Course Info Island */}
      <CourseInfo course_id={params.course_id} />

      {/* Reviews Island */}
      <ReviewsIsland course_id={params.course_id} />
    </div>
  );
}

      <ReviewsIsland
        query={{ reviewee: params.course_id, type: 2 }}
      />
    </div>
  );
}
