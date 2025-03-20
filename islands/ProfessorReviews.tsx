"use client";
import { useState } from "preact/hooks";
import AddProfessorReview from "../islands/AddProfessorReview.tsx";

type Review = {
  user: string;
  rating: number;
  text: string;
};

type Professor = {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviews: Review[];
};

export default function ProfessorReviews() {
  const mockProfessors: Professor[] = [
    {
      id: 1,
      name: "Professor Alice",
      description: "Teaches Intro to Biology",
      rating: 4,
      reviews: [
        { user: "StudentA", rating: 5, text: "Great explanations!" },
        { user: "StudentB", rating: 3, text: "Decent, but moves quickly." },
      ],
    },
    {
      id: 2,
      name: "Professor Bob",
      description: "Teaches Advanced Mathematics",
      rating: 5,
      reviews: [
        { user: "StudentC", rating: 5, text: "Best professor I've had." },
      ],
    },
    {
      id: 3,
      name: "Professor Carol",
      description: "Teaches English Literature",
      rating: 2,
      reviews: [
        { user: "StudentD", rating: 2, text: "Lectures could be clearer." },
        { user: "StudentE", rating: 3, text: "Interesting reading list." },
      ],
    },
    {
      id: 4,
      name: "Professor Dave",
      description: "Teaches Computer Science",
      rating: 3,
      reviews: [
        { user: "StudentF", rating: 4, text: "Learned a lot, tough exams." },
      ],
    },
  ];

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);

  function openModal(prof: Professor) {
    setSelectedProfessor(prof);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedProfessor(null);
    setModalOpen(false);
    setShowAddReview(false);
  }

  function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow" : "text-gray-300"}>
          ★
        </span>,
      );
    }
    return <div className="text-2xl flex">{stars}</div>;
  }

  function renderReviews(reviews: Review[]) {
    if (reviews.length === 0) {
      return <p className="text-sm text-gray-600">No reviews yet.</p>;
    }
    return (
      <ul className="flex flex-col gap-2">
        {reviews.map((r, i) => (
          <li key={i} className="border-b pb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">{r.user}:</span>
              {renderStars(r.rating)}
            </div>
            <p className="text-sm text-gray-700 ml-6">{r.text}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-1 px-8 pb-8 gap-8">
      <div className="w-1/4 bg-white rounded-md shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Name</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Professor"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Categories</label>
          <select className="w-full px-4 py-2 border rounded-md">
            <option value="">All</option>
            <option value="humanities">Humanities</option>
            <option value="sciences">Sciences</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Sorting</label>
          <select className="w-full px-4 py-2 border rounded-md">
            <option value="alphabetical">Alphabetical</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-md shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Name</h2>
        <div className="flex flex-col gap-6">
          {mockProfessors.map((prof) => (
            <div
              key={prof.id}
              className="flex gap-4 items-start cursor-pointer"
              onClick={() => openModal(prof)}
            >
              <div className="w-20 h-20 bg-gray-300 rounded-md" />
              <div>
                <h3 className="font-bold text-lg">{prof.name}</h3>
                <p className="text-gray-600">{prof.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && selectedProfessor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedProfessor.name}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              {selectedProfessor.description}
            </p>
            <div className="flex items-center gap-2 mb-4">
              {renderStars(selectedProfessor.rating)}
              <span className="text-sm text-gray-600">
                {selectedProfessor.rating} / 5
              </span>
            </div>
            <h3 className="font-medium mb-2">Reviews:</h3>
            {renderReviews(selectedProfessor.reviews)}

            {/* Add Review button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAddReview(true)}
                className="bg-blue text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Add Review
              </button>
            </div>

            {/* Show the AddProfessorReview if showAddReview is true */}
            {showAddReview && (
              <AddProfessorReview
                professorId={selectedProfessor.id} // Pass the ID
                onClose={() => setShowAddReview(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
