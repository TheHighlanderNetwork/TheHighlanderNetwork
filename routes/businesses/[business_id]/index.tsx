import CourseInfo from "../../../islands/reviewDisplay/BusinessInfo.tsx";
import ReviewsIsland from "../../../islands/reviewDisplay/Reviews.tsx";

export default function CoursePage(
  { params }: { params: { business_id: string } },
) {
  return (
    <div class="max-w-3xl mx-auto p-6">
      {/* Course Info Island */}
      <CourseInfo business_id={params.business_id} />

      {/* Reviews Island */}
      <ReviewsIsland
        query={{ reviewee: params.business_id, type: 3 }}
      />
    </div>
  );
}
