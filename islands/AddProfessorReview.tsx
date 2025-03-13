"use client";
import { useEffect, useState } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";

interface Professor {
  id: number;
  name: string;
}

const mockProfessors: Professor[] = [
  { id: 1, name: "Professor Alice" },
  { id: 2, name: "Professor Bob" },
  { id: 3, name: "Professor Carol" },
  { id: 4, name: "Professor Dave" },
];

export default function AddProfessorReview({
  professorId,
  onClose,
}: {
  professorId: number;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const initialProfessor = mockProfessors.find((p) => p.id === professorId) ||
    mockProfessors[0];
  const [selectedProfessor, setSelectedProfessor] = useState<Professor>(
    initialProfessor,
  );

  const [searchTerm, setSearchTerm] = useState(selectedProfessor.name);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Ask for confirmation if there's typed text
  function handleClose() {
    if (reviewText.trim() !== "") {
      const confirmClose = confirm(
        "You have typed some text in the review. Close anyway?",
      );
      if (!confirmClose) {
        return; // If user cancels, do not close
      }
    }
    setIsOpen(false);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    onClose();
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!isSignedIn) {
      alert("You must be signed in to add a review.");
      return;
    }
    alert(
      `Review submitted!\nProfessor: ${selectedProfessor.name}\nRating: ${rating}\nReview: ${reviewText}`,
    );
    // Insert real submission logic here (Firebase, API, etc.)
    handleClose();
  }

  function renderStars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let starColor = "text-gray-300";
      if (i <= hoverRating) {
        starColor = "text-yellow";
      } else if (i <= rating) {
        starColor = "text-yellow";
      }
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-2xl ${starColor}`}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(i)}
        >
          ★
        </span>,
      );
    }
    return <div className="flex mb-2">{stars}</div>;
  }

  if (!isOpen) return null;

  const filteredProfessors = mockProfessors.filter((prof) =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSelectProfessor(prof: Professor) {
    setSelectedProfessor(prof);
    setSearchTerm(prof.name);
    setDropdownOpen(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Add Review</h2>

        <div className="mb-4 relative">
          <label className="block mb-2 font-medium">
            Search / Select Professor
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Type a name..."
            value={searchTerm}
            onFocus={() => setDropdownOpen(true)}
            onInput={(e) => {
              setSearchTerm((e.target as HTMLInputElement).value);
              setDropdownOpen(true);
            }}
          />
          {dropdownOpen && filteredProfessors.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border shadow-md max-h-60 overflow-auto z-10">
              {filteredProfessors.map((prof) => (
                <li
                  key={prof.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectProfessor(prof)}
                >
                  {prof.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Rating</label>
          {renderStars()}
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
            onClick={handleClose}
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
  );
}
