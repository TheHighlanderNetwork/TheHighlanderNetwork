// islands/ProfessorResults.tsx
"use client";
import { useState } from "preact/hooks";

/** The inline interface for each professor document. */
export interface ProfessorDoc {
  id: string;
  name?: string;
  description?: string;
  rating?: number;
  [key: string]: unknown;
}

interface ProfessorResultsProps {
  profs: ProfessorDoc[];           // array of professor docs
  onSelect?: (prof: ProfessorDoc) => void; // optional callback if user clicks
}

/**
 * Renders a list of professors, each clickable to redirect to their page.
 */
export default function ProfessorResults({ profs, onSelect }: ProfessorResultsProps) {
  // Called when user clicks a professor card
  function handleClickProfessor(prof: ProfessorDoc) {
    // If you want a callback for other logic, call it here:
    onSelect?.(prof);

    // Then redirect to e.g. /professors/<id>
    // Adjust the route path as needed for your app.
    const baseUrl = globalThis.location.origin;
    const redirectUrl = `${baseUrl}/professors/${prof.id}`;
    globalThis.location.href = redirectUrl;
  }

  return (
    <div className="flex flex-col gap-4">
      {profs.length === 0
        ? <p>No professors found.</p>
        : profs.map((prof) => (
            <div
              key={prof.id}
              className="bg-white p-4 rounded-md shadow-sm cursor-pointer"
              onClick={() => handleClickProfessor(prof)}
            >
              <p className="font-bold text-lg">
                {prof.name || `Professor ${prof.id}`}
              </p>
              {prof.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {prof.description}
                </p>
              )}

              {typeof prof.rating === "number" && (
                <div className="mt-2 flex items-center gap-2">
                  {renderStars(prof.rating)}
                  <span className="text-sm text-gray-600">
                    {prof.rating}/5
                  </span>
                </div>
              )}
            </div>
          ))}
    </div>
  );
}

/** Renders 5 stars, partial fill if rating is fractional. */
function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <img key={i} src="/starcolor.svg" alt="★" className="w-4 h-4" />
      );
    } else if (rating < i - 1) {
      stars.push(
        <img key={i} src="/starnocolor.svg" alt="☆" className="w-4 h-4" />
      );
    } else {
      const fraction = rating - (i - 1);
      stars.push(<PartialStar key={i} fill={fraction} />);
    }
  }
  return <div className="flex gap-1">{stars}</div>;
}

/**
 * PartialStar uses a clipPath trick to show only
 * a fraction of starcolor.svg over starnocolor.svg.
 */
function PartialStar({ fill }: { fill: number }) {
  const fraction = Math.min(Math.max(fill, 0), 1);
  const percentage = fraction * 100;
  return (
    <div className="relative w-4 h-4">
      {/* The empty star as background */}
      <img
        src="/starnocolor.svg"
        alt="Star background"
        className="absolute inset-0 w-4 h-4"
      />
      {/* The colored star, clipped to fraction */}
      <img
        src="/starcolor.svg"
        alt="Star fill"
        className="absolute inset-0 w-4 h-4"
        style={{
          clipPath: `polygon(
            0 0,
            ${percentage}% 0,
            ${percentage}% 100%,
            0 100%
          )`,
        }}
      />
    </div>
  );
}
