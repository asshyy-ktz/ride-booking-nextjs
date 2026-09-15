"use client";

import { useState } from "react";

interface RatingModalProps {
  open: boolean;
  driverName: string;
  onSubmit: (stars: number, comment: string) => void;
  onClose: () => void;
}

export default function RatingModal({
  open,
  driverName,
  onSubmit,
  onClose,
}: RatingModalProps) {
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");

  if (!open) return null;

  function handleSubmit() {
    onSubmit(stars, comment.trim());
    setComment("");
    setStars(5);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Rate your ride</h2>
        <p className="mt-1 text-sm text-gray-500">
          How was your trip with {driverName}?
        </p>
        <div className="mt-4 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStars(value)}
              onMouseEnter={() => setHoverStars(value)}
              onMouseLeave={() => setHoverStars(0)}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              className="p-1 text-3xl transition"
            >
              <span
                className={
                  (hoverStars || stars) >= value
                    ? "text-amber-400"
                    : "text-gray-200"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave an optional comment"
          rows={3}
          className="mt-4 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-brand-400"
        />
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary flex-1"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
