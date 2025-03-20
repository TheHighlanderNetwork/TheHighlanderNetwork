import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ReviewIsland from "../reviewDisplay/Review.tsx";
import { fetchMatchedData } from "../../utils/firebase/docRetrieval/retrieve.ts";

interface ReviewsIslandProps {
  query: Record<string, unknown>;
}

export default function ReviewsIsland({ query }: ReviewsIslandProps) {
  const reviews = useSignal<Record<string, typeof useSignal>[]>([]);
  const totalScore = useSignal<number>(0);

  useEffect(() => {
    async function fetchReviews() {
      const reviewData = await fetchMatchedData("reviews", query);
      totalScore.value = reviewData.reduce(
        (acc, review) => acc + (review.rating || 0),
        0,
      );
      reviews.value = reviewData;
    }

    fetchReviews();
  }, [query]);

  const numReviews = reviews.value.length;
  const averageRating = numReviews > 0 ? totalScore.value / numReviews : 0;

  return (
    <div>
      <h2 class="text-2xl font-bold mt-6">Reviews</h2>
      {numReviews > 0
        ? (
          <>
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <StarRating rating={averageRating} maxStars={5} />
              <span>({averageRating.toFixed(2)})</span>
            </div>
            {reviews.value.map((review) => (
              <ReviewIsland key={review.id} review={review} />
            ))}
          </>
        )
        : <p>No reviews yet.</p>}
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  maxStars: number;
}

function StarRating({ rating, maxStars }: StarRatingProps) {
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const fill = clamp(rating - (i - 1), 0, 1);
    stars.push(<Star key={i} fill={fill} />);
  }
  return <div class="flex items-center">{stars}</div>;
}

interface StarProps {
  fill: number;
}

function Star({ fill }: StarProps) {
  return (
    <span class="relative inline-block w-5 h-5 text-xl overflow-hidden">
      <span
        class="absolute left-0 top-0 text-yellow-500 overflow-hidden whitespace-nowrap"
        style={{ width: `${fill * 100}%` }}
      >
        ★
      </span>
      <span class="text-gray-300">★</span>
    </span>
  );
}

function clamp(val: number, min: number, max: number) {
  return val < min ? min : val > max ? max : val;
}
