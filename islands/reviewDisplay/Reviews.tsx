import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ReviewIsland from "../reviewDisplay/Review.tsx";
import { fetchMatchedData } from "../../utils/firebase/docRetrieval/retrieve.ts";

export default function ReviewsIsland(
  { query }: { query: Record<string, unknown> },
) {
  const reviews = useSignal<Record<string, typeof String>[]>([]);
  const totalScore = useSignal<number>(0);

  useEffect(() => {
    async function fetchReviews() {
      console.log("Fetching reviews with query:", query);

      const reviewData = await fetchMatchedData("reviews", query);
      console.log("Fetched reviews:", reviewData);

      totalScore.value = reviewData.reduce((acc, review) => {
        return acc + (review.rating || 0);
      }, 0);

      reviews.value = reviewData;
    }

    fetchReviews();
  }, [query]);

  const numReviews = reviews.value.length;
  const average = numReviews > 0 ? totalScore.value / numReviews : 0;

  return (
    <div>
      <h2 class="text-2xl font-bold mt-6">Reviews</h2>

      {numReviews > 0
        ? (
          <>
            {/* Dynamic star rating using starcolor.svg & starnocolor.svg */}
            <StarRating rating={average} />

            {/* Render each review */}
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

/**
 * Renders a 5-star rating using starcolor.svg (filled) & starnocolor.svg (unfilled).
 * If rating has a decimal (e.g. 3.4), it partially fills the 4th star by 40%.
 */
function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const starValue = i;
    if (rating >= starValue) {
      // star fully filled
      stars.push(
        <img key={i} src="/starcolor.svg" alt="Star" class="w-6 h-6" />,
      );
    } else if (rating < starValue - 1) {
      // star fully unfilled
      stars.push(
        <img key={i} src="/starnocolor.svg" alt="Star" class="w-6 h-6" />,
      );
    } else {
      // partial fill star
      const fraction = rating - (starValue - 1); // e.g. 3.4 => 0.4 for star #4
      stars.push(<PartialStar key={i} fill={fraction} />);
    }
  }
  return <div class="flex items-center gap-1 mt-2 mb-4">{stars}</div>;
}

/**
 * A single star partially filled by clipping the colored star.
 * We layer starcolor.svg on top of starnocolor.svg,
 * using clip-path to reveal only fill% of the starcolor.
 */
function PartialStar({ fill }: { fill: number }) {
  // clamp fill to [0..1]
  const fraction = Math.min(Math.max(fill, 0), 1);
  // Convert fraction to a % for clip-path
  const percentage = fraction * 100;

  return (
    <div class="relative w-6 h-6">
      {/* Unfilled star behind */}
      <img
        src="/starnocolor.svg"
        alt="Star background"
        class="absolute inset-0 w-6 h-6"
      />
      {/* Filled star in front, clipped to fraction% width */}
      <img
        src="/starcolor.svg"
        alt="Star fill"
        class="absolute inset-0 w-6 h-6"
        style={{
          clipPath:
            `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`,
        }}
      />
    </div>
  );
}
