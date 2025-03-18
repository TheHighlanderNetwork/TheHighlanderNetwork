"use client";
import { useState } from "preact/hooks";
import AddBusinessReview from "./AddBusinessReview.tsx";

export default function AddReviewButton() {
  const [showAddReview, setShowAddReview] = useState(false);

  function handleClose() {
    setShowAddReview(false);
  }

  return (
    <>
      <button
        type="button"
        className="bg-blue text-white rounded-md px-4 py-2 text-sm font-medium"
        onClick={() => setShowAddReview(true)}
      >
        Add Review
      </button>
      {showAddReview && (
        <AddBusinessReview
          businessId={1}
          onClose={handleClose}
        />
      )}
    </>
  );
}