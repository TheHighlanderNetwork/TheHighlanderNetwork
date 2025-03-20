import { useState } from "preact/hooks";
import { createReview } from "../utils/firebase/createReview.ts";
import { userSearch } from "../utils/firebase/search/search.ts";

export default async function ReviewIsland(
) {
  const [query, setQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<{ id: string; name: string; type: number } | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const all_entries = await userSearch(15, "");
  console.log("Retrieved all entries");
  // Function to filter entries based on query
  const filteredEntries = all_entries.filter((entry) =>
    entry.item.name.toLowerCase().includes(query.toLowerCase())
  );

// Handle form submission
async function handleSubmit(event: Event) {
  event.preventDefault();

  if (!selectedEntry) {
    alert("Please select an entry before submitting.");
    return;
  }

  const success = await createReview(
    selectedEntry.id,
    reviewText,
    rating,
    selectedEntry.type
  );

  if (success) {
    alert("Review submitted successfully!");
    setReviewText("");
    setSelectedEntry(null);
    setQuery("");
  } else {
    alert("Failed to submit review. Try again.");
  }
}

return (
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-xl font-bold mb-4">Submit a Review</h2>

    {/* Search Input */}
    <input
      type="text"
      value={query}
      onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      placeholder="Search for an entry..."
      className="w-full p-2 border border-gray-300 rounded mb-2"
    />

    {/* Dropdown List */}
    {query && filteredEntries.length > 0 && (
      <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-auto">
        {filteredEntries.map((entry) => (
          <li
            key={entry.item.id}
            onClick={() => {
              setSelectedEntry(entry.item);
              setQuery(entry.item.name);
            }}
            className="p-2 hover:bg-gray-200 cursor-pointer"
          >
            {entry.item.name}
          </li>
        ))}
      </ul>
    )}

    {/* Selected Entry Display */}
    {selectedEntry && (
      <p className="mt-2 text-gray-700">
        Selected: <strong>{selectedEntry.name}</strong>
      </p>
    )}

    {/* Review Textarea */}
    <textarea
      value={reviewText}
      onInput={(e) => setReviewText((e.target as HTMLTextAreaElement).value)}
      placeholder="Write your review here..."
      className="w-full p-2 border border-gray-300 rounded mt-2"
    />

    {/* Rating Input */}
    <div className="mt-2">
      <label className="block text-sm font-medium">Rating:</label>
      <input
        type="number"
        value={rating}
        onInput={(e) => setRating(Number((e.target as HTMLInputElement).value))}
        min="1"
        max="5"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Submit Button */}
    <button
      onClick={handleSubmit}
      className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
    >
      Submit Review
    </button>
  </div>
);
}