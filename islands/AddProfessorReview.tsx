"use client";
import { useEffect, useState } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

export default function AddReviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  function openModal(e: Event) {
    e.preventDefault();
    if (!isSignedIn) {
      alert("You must be signed in to add a review.");
      return;
    }
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    // Underscored remove underscore if being used.
    // If not being used with backend please delete to keep code clean.
    // Delete this comment once you made that decision.
    const _data = { rating, reviewText };
    alert(`Review submitted!\nRating: ${rating}\nReview: ${reviewText}`);
    // Replace with your actual submission logic (API call, DB insert, etc.)
    closeModal();
  }

  function renderStars() {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, i) => i + 1).map((star) => {
      let starColor = "text-gray-300";
      if (star <= hoverRating) {
        starColor = "text-yellow";
      } else if (star <= rating) {
        starColor = "text-yellow";
      }
      return (
        <span
          key={star}
          className={`cursor-pointer text-2xl transition-colors duration-200 ${starColor}`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      );
    });
  }

  return (
    <>
      <button 
      type="button"
      onClick={openModal}
      className="text-blue hover:underline">
        Add review
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Review for [Name]</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Rating</label>
              <div className="flex items-center">{renderStars()}</div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Write a Review (optional)
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-md"
                rows={5}
                value={reviewText}
                onInput={(e) =>
                  setReviewText((e.target as HTMLTextAreaElement).value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
