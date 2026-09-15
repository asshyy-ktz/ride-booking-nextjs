"use client";

import Link from "next/link";
import { RideHistoryEntry, RideStatus } from "@/lib/types";

const STATUS_STYLES: Record<RideStatus, string> = {
  requested: "bg-blue-50 text-blue-600",
  driver_assigned: "bg-blue-50 text-blue-600",
  en_route: "bg-blue-50 text-blue-600",
  arrived: "bg-blue-50 text-blue-600",
  in_progress: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<RideStatus, string> = {
  requested: "Requested",
  driver_assigned: "Driver assigned",
  en_route: "En route",
  arrived: "Arrived",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface RideHistoryItemProps {
  ride: RideHistoryEntry;
}

export default function RideHistoryItem({ ride }: RideHistoryItemProps) {
  const date = new Date(ride.date);
  const formattedDate = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/history/${ride.id}`}
      className="card flex items-center justify-between gap-3 p-4 transition hover:border-brand-200 hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">
            {formattedDate}
          </p>
          <span className="text-xs text-gray-400">{formattedTime}</span>
          <span className={`badge ${STATUS_STYLES[ride.status]}`}>
            {STATUS_LABELS[ride.status]}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">
          {ride.pickupLabel} → {ride.dropoffLabel}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-bold text-gray-900">
          ${ride.fareTotal.toFixed(2)}
        </p>
        <p className="text-xs capitalize text-gray-400">{ride.rideType}</p>
      </div>
    </Link>
  );
}
