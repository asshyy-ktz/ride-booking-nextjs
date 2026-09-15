"use client";

import { useRideStore } from "@/store/rideStore";
import RideHistoryItem from "@/components/RideHistoryItem";

export default function HistoryPage() {
  const history = useRideStore((s) => s.history);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Ride history</h1>
      <p className="mt-1 text-sm text-gray-500">
        {history.length} ride{history.length === 1 ? "" : "s"} total
      </p>

      <div className="mt-5 space-y-3">
        {history.length === 0 ? (
          <div className="card p-8 text-center text-sm text-gray-500">
            No rides yet. Book your first ride to see it here.
          </div>
        ) : (
          history.map((ride) => <RideHistoryItem key={ride.id} ride={ride} />)
        )}
      </div>
    </div>
  );
}
