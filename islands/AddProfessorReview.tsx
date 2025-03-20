/** @jsxImportSource preact */
"use client";
import { useState } from "preact/hooks";

type AddProfessorReviewProps = {
  professorId: number;
  onClose: () => void;
};

export default function AddProfessorReview({ professorId, onClose }: AddProfessorReviewProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (rating === 0 || reviewText.trim() === "") {
      setMessage("⚠️ Please provide a rating and review text.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage("✅ Review submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("❌ Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Review</h2>
        <p className="text-sm text-gray-600 mb-4">Professor ID: {professorId}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Rating */}
          <div>
            <label className="block font-medium mb-2">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number((e.target as HTMLSelectElement).value))}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="0">Select Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
              <option value="4">⭐⭐⭐⭐ - Very Good</option>
              <option value="3">⭐⭐⭐ - Average</option>
              <option value="2">⭐⭐ - Below Average</option>
              <option value="1">⭐ - Poor</option>
            </select>
          </div>

          {/* Review Text */}
          <div>
            <label className="block font-medium mb-2">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText((e.target as HTMLTextAreaElement).value)}
              className="w-full px-4 py-2 border rounded-md resize-none"
              rows={4}
              placeholder="Write your review here..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>

          {/* Error / Success Message */}
          {message && <p className="text-sm text-center">{message}</p>}
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
