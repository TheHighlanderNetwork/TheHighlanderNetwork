"use client";
import { useEffect, useState } from "preact/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";
import { userSearch } from "../utils/firebase/search/search.ts";
import { createReview } from "../utils/firebase/createReview.ts";
import { Status, useStatus } from "./Status.tsx";

interface Entry {
  id: string;
  name: string;
  type: number;
}

export default async function AddBusinessReview() {
  const mockBusinesses: { id: string; name: string; type: number }[] =
    (await userSearch(15, "")).map((result) => result.item);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const initialBusiness = mockBusinesses[0];
  const [selectedBusiness, setSelectedBusiness] = useState<Entry>(
    initialBusiness,
  );
  const [searchTerm, setSearchTerm] = useState(selectedBusiness.name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { status, showStatus } = useStatus();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: unknown) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!isSignedIn) {
      showStatus("error", "You must be signed in to submit a review.");
      return;
    }
    await createReview(
      selectedBusiness.id,
      reviewText,
      rating,
      selectedBusiness.type,
    );
    showStatus("success", "Review Submitted!");
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

  const filteredBusiness = mockBusinesses.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSelectBusiness(prof: Entry) {
    setSelectedBusiness(prof);
    setSearchTerm(prof.name);
    setDropdownOpen(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4">Add Review</h2>
        <div className="mb-4 relative">
          <label className="block mb-2 font-medium">
            Search Entry
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
          {dropdownOpen && filteredBusiness.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border shadow-md max-h-60 overflow-auto z-10">
              {filteredBusiness.map((prof) => (
                <li
                  key={prof.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectBusiness(prof)}
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
          {status && <Status type={status.type} message={status.message} />}
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
