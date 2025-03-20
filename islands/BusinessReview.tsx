"use client";
import { useState } from "preact/hooks";
import AddBusinessReview from "../islands/AddBusinessReview.tsx";

type Review = {
  user: string;
  rating: number;
  text: string;
};

type Business = {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviews: Review[];
};

export default function BusinessReviews() {
  const mockBusinesses: Business[] = [
    {
      id: 1,
      name: "Coffee Haven",
      description: "Local coffee shop with specialty brews",
      rating: 4,
      reviews: [
        { user: "Alice", rating: 5, text: "Best coffee in town!" },
        { user: "Bob", rating: 3, text: "Good ambiance, slightly pricey." },
      ],
    },
    {
      id: 2,
      name: "Tech Solutions",
      description: "Computer repair and IT services",
      rating: 5,
      reviews: [
        { user: "Charlie", rating: 5, text: "Fixed my laptop in no time!" },
      ],
    },
    {
      id: 3,
      name: "Book Nook",
      description: "Cozy bookstore with a large selection",
      rating: 2,
      reviews: [
        { user: "Diana", rating: 2, text: "Limited hours, could be better." },
        { user: "Eli", rating: 3, text: "Friendly staff, small collection." },
      ],
    },
    {
      id: 4,
      name: "Green Eats",
      description: "Vegetarian restaurant with organic options",
      rating: 3,
      reviews: [
        { user: "Frank", rating: 4, text: "Fresh food, healthy choices." },
      ],
    },
  ];

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);

  function openModal(biz: Business) {
    setSelectedBusiness(biz);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedBusiness(null);
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
            placeholder="Search Business"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Categories</label>
          <select className="w-full px-4 py-2 border rounded-md">
            <option value="">All</option>
            <option value="food">Food & Dining</option>
            <option value="retail">Retail</option>
            <option value="services">Services</option>
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
          {mockBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="flex gap-4 items-start cursor-pointer"
              onClick={() => openModal(biz)}
            >
              <div className="w-20 h-20 bg-gray-300 rounded-md" />
              <div>
                <h3 className="font-bold text-lg">{biz.name}</h3>
                <p className="text-gray-600">{biz.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedBusiness.name}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">{selectedBusiness.description}</p>
            <div className="flex items-center gap-2 mb-4">
              {renderStars(selectedBusiness.rating)}
              <span className="text-sm text-gray-600">
                {selectedBusiness.rating} / 5
              </span>
            </div>
            <h3 className="font-medium mb-2">Reviews:</h3>
            {renderReviews(selectedBusiness.reviews)}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAddReview(true)}
                className="bg-blue text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Add Review
              </button>
            </div>

            {showAddReview && (
              <AddBusinessReview
                businessId={selectedBusiness.id}
                onClose={() => setShowAddReview(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
