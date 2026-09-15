"use client";

import { RideType } from "@/lib/types";

interface RideTypeCardProps {
  rideType: RideType;
  fareTotal: number | null;
  selected: boolean;
  onSelect: () => void;
}

const ICONS: Record<RideType["icon"], string> = {
  car: "🚗",
  "car-premium": "🚙",
  van: "🚐",
};

export default function RideTypeCard({
  rideType,
  fareTotal,
  selected,
  onSelect,
}: RideTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
        selected
          ? "border-brand-600 bg-brand-50"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-2xl">
        {ICONS[rideType.icon]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-gray-900">
            {rideType.name}
          </p>
          <p className="shrink-0 font-bold text-gray-900">
            {fareTotal !== null ? `$${fareTotal.toFixed(2)}` : "--"}
          </p>
        </div>
        <p className="truncate text-xs text-gray-500">
          {rideType.description} · {rideType.etaMinutes} min away · up to{" "}
          {rideType.capacity}
        </p>
      </div>
    </button>
  );
}
