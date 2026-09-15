"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRideStore } from "@/store/rideStore";
import RatingModal from "@/components/RatingModal";
import { RideStatus } from "@/lib/types";

const STATUS_STYLES: Record<RideStatus, string> = {
  requested: "bg-blue-50 text-blue-600",
  driver_assigned: "bg-blue-50 text-blue-600",
  en_route: "bg-blue-50 text-blue-600",
  arrived: "bg-blue-50 text-blue-600",
  in_progress: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function ReceiptPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const ride = useRideStore((s) => s.getHistoryById(params.id));
  const submitRating = useRideStore((s) => s.submitRating);
  const [showRatingModal, setShowRatingModal] = useState(false);

  if (!ride) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">Receipt not found</h1>
        <button
          type="button"
          onClick={() => router.push("/history")}
          className="btn-primary mt-6"
        >
          Back to history
        </button>
      </div>
    );
  }

  const date = new Date(ride.date);
  const formattedDate = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  function handleSubmitRating(stars: number, comment: string) {
    submitRating({
      rideId: ride!.id,
      stars,
      comment: comment || undefined,
      submittedAt: new Date().toISOString(),
    });
    setShowRatingModal(false);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <button
        type="button"
        onClick={() => router.push("/history")}
        className="mb-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        ← Back to history
      </button>

      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Ride receipt</h1>
            <p className="text-sm text-gray-500">
              {formattedDate} · {formattedTime}
            </p>
          </div>
          <span className={`badge ${STATUS_STYLES[ride.status]}`}>
            {ride.status.replace("_", " ")}
          </span>
        </div>

        <div className="mt-5 space-y-3 border-y border-dashed border-gray-200 py-5">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="my-1 h-8 w-px bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-gray-400">Pickup</p>
                <p className="text-sm font-medium text-gray-800">
                  {ride.pickupLabel}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Drop-off</p>
                <p className="text-sm font-medium text-gray-800">
                  {ride.dropoffLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {ride.driver.photoInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">
                {ride.driver.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {ride.driver.vehicleColor} {ride.driver.vehicleMake}{" "}
                {ride.driver.vehicleModel} · {ride.driver.licensePlate}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold capitalize text-gray-500">
              {ride.rideType}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-1 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Base fare</span>
            <span>${ride.fare.baseFare.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Distance ({ride.fare.distanceKm} km)</span>
            <span>${ride.fare.distanceFare.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Time ({ride.fare.durationMin} min)</span>
            <span>${ride.fare.timeFare.toFixed(2)}</span>
          </div>
          {ride.fare.surgeMultiplier > 1 ? (
            <div className="flex justify-between text-amber-600">
              <span>Surge x{ride.fare.surgeMultiplier}</span>
              <span>
                +$
                {(ride.fare.total - ride.fare.subtotal).toFixed(2)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
            <span>Total paid</span>
            <span>${ride.fareTotal.toFixed(2)}</span>
          </div>
        </div>

        {ride.rating ? (
          <div className="mt-5 rounded-xl border border-gray-100 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Your rating
            </p>
            <div className="mt-1 text-amber-400">
              {"★".repeat(ride.rating.stars)}
              <span className="text-gray-200">
                {"★".repeat(5 - ride.rating.stars)}
              </span>
            </div>
            {ride.rating.comment ? (
              <p className="mt-1 text-sm text-gray-600">
                &ldquo;{ride.rating.comment}&rdquo;
              </p>
            ) : null}
          </div>
        ) : ride.status === "completed" ? (
          <button
            type="button"
            onClick={() => setShowRatingModal(true)}
            className="btn-secondary mt-5 w-full"
          >
            Rate this ride
          </button>
        ) : null}
      </div>

      <RatingModal
        open={showRatingModal}
        driverName={ride.driver.name}
        onSubmit={handleSubmitRating}
        onClose={() => setShowRatingModal(false)}
      />
    </div>
  );
}
