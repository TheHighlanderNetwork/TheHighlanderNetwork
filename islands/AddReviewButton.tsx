"use client";
import { useState } from "preact/hooks";
import AddProfessorReview from "./AddProfessorReview.tsx";

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
        <AddProfessorReview
          onClose={handleClose}
        />
      )}
    </>
  );
}
