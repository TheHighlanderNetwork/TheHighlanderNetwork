import CourseInfo from "../../../islands/reviewDisplay/ClubInfo.tsx";
import ReviewsIsland from "../../../islands/reviewDisplay/Reviews.tsx";

export default function CoursePage(
  { params }: { params: { club_id: string } },
) {
  return (
    <div class="max-w-3xl mx-auto p-6">
      {/* Course Info Island */}
      <CourseInfo club_id={params.club_id} />

      {/* Reviews Island */}
      <ReviewsIsland
        query={{ reviewee: params.club_id, type: 4 }}
      />
    </div>
  );
}
