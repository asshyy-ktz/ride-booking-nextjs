"use client";

import { SavedPlace } from "@/lib/types";

interface SavedPlaceChipProps {
  place: SavedPlace;
  onSelect: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

const TYPE_ICON: Record<SavedPlace["type"], string> = {
  home: "🏠",
  work: "💼",
  custom: "📍",
};

export default function SavedPlaceChip({
  place,
  onSelect,
  onEdit,
  onRemove,
}: SavedPlaceChipProps) {
  return (
    <div className="group flex items-center gap-1 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-2 text-sm shadow-sm">
      <button
        type="button"
        onClick={onSelect}
        className="flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>{TYPE_ICON[place.type]}</span>
        <span>{place.label}</span>
      </button>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${place.label}`}
          className="rounded-full px-1.5 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          ✎
        </button>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${place.label}`}
          className="rounded-full px-1.5 py-1 text-xs text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
