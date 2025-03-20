import ProfessorInfo from "../../../islands/reviewDisplay/ProfessorInfo.tsx";
import ReviewsIsland from "../../../islands/reviewDisplay/Reviews.tsx";

export default function CoursePage(
  { params }: { params: { net_id: string } },
) {
  return (
    <div class="max-w-3xl mx-auto p-6">
      {/* Course Info Island */}
      <ProfessorInfo netid={params.net_id} />

      {/* Reviews Island */}
      <ReviewsIsland
        query={{ reviewee: params.net_id, type: 1 }}
      />
    </div>
  );
}
