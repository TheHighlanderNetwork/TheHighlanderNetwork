import { Timestamp } from "firestore";
export default function ReviewIsland(
  { review }: { review: Record<string, string | Timestamp> },
) {
  // Convert Firebase Timestamp to a readable date
  const formatTimestamp = (time: Timestamp): string => {
    if (typeof time === "object" && time !== null && "seconds" in time) {
      // If it's a Firestore Timestamp object
      return new Date(time.seconds * 1000).toLocaleDateString();
    } else if (typeof time === "number") {
      // If it's a Unix timestamp (milliseconds)
      return new Date(time).toLocaleDateString();
    }
    return "Invalid Date";
  };

  return (
    <div class="review">
      <p>
        <em>Rating: {review.rating}/5</em>
      </p>
      {review.class && (
        <p>
          <em>Class: {review.class}</em>
        </p>
      )}
      <p>
        <em>Description: {review.review}</em>
      </p>
      <p>
        <em>{formatTimestamp(review.time)}</em>
      </p>
    </div>
  );
}
