import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ReviewIsland from "../reviewDisplay/Review.tsx"; // Your individual review island component
import { fetchMatchedData } from "../../utils/firebase/docRetrieval/retrieve.ts";
export default function ReviewsIsland(
  { query }: { query: Record<string, unknown> },
) {
  // Signal to store reviews
  const reviews = useSignal<Record<string, string>[]>([]);
  const totalScore = useSignal<number>(0);
  // Fetch reviews when the course_id changes
  useEffect(() => {
    async function fetchReviews() {
      console.log("Fetching reviews with query: ", query);

      // Fetch reviews from Firestore
      const reviewData = await fetchMatchedData("reviews", query);
      console.log("Fetched reviews:", reviewData);

      console.log("calculating totalscore: ", totalScore.value);
      totalScore.value = reviewData.reduce((acc, review) => {
        return acc + (review.rating || 0); // Add the rating to the accumulator
      }, 0);

      console.log("totalscore: ", totalScore.value);
      // Set the fetched reviews into the signal
      reviews.value = reviewData;
    }

    fetchReviews();
  }, [query]); // Run effect when course_id changes

  return (
    <div>
      <h2 class="text-2xl font-bold mt-6">Reviews</h2>
      {reviews.value.length > 0
        ? (
          <>
            <p class="text-sm text-gray-600">
              Rating: {(totalScore.value / reviews.value.length).toFixed(2)} / 5
              {" "}
              {/* Display the average score with 2 decimal places */}
            </p>
            {/* Map over the reviews and render each one as a separate island */}
            {reviews.value.map((review) => (
              <div key={review.id} className="review-island-wrapper">
                <ReviewIsland review={review} />
              </div>
            ))}
          </>
        )
        : <p>No reviews yet.</p>}
    </div>
  );
}
