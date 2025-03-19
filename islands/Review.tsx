export default function ReviewIsland(
  { review }: { review: Record<string, unknown> },
) {
  return (
    <div class="review">
      <p>
        <em>Rating: {review.rating}/5</em>
      </p>
      <p>
        <em>Description: {review.review}</em>
      </p>
    </div>
  );
}
