import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ReviewIsland from "./Review.tsx"; // Your individual review island component
import { fetchMatchedData } from "../utils/firebase/docRetrieval/retrieve.ts";

export default function ReviewsIsland({ course_id }: { course_id: string }) {
  // Signal to store reviews
  const reviews = useSignal<Record<string, string>[]>([]);

  // Fetch reviews when the course_id changes
  useEffect(() => {
    async function fetchReviews() {
      console.log("Fetching reviews for course:", course_id);

      // Define your query here
      const query = { class: course_id, type: 2 }; // Adjust your query as needed

      // Fetch reviews from Firestore
      const reviewData = await fetchMatchedData("reviews", query);
      console.log("Fetched reviews:", reviewData);

      // Set the fetched reviews into the signal
      reviews.value = reviewData;
    }

    fetchReviews();
  }, [course_id]); // Run effect when course_id changes

  return (
    <div>
      <h2 class="text-2xl font-bold mt-6">Reviews</h2>
      {reviews.value.length > 0
        ? (
          // Map over the reviews and render each one as a separate island
          reviews.value.map((review) => (
            <ReviewIsland key={review.id} review={review} />
          ))
        )
        : <p>No reviews yet.</p>}
    </div>
  );
}