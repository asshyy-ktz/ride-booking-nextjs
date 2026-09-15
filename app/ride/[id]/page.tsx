"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRideStore } from "@/store/rideStore";
import MapPlaceholder from "@/components/MapPlaceholder";
import DriverCard from "@/components/DriverCard";
import StatusStepper from "@/components/StatusStepper";
import CancelDialog from "@/components/CancelDialog";
import RatingModal from "@/components/RatingModal";

export default function RideTrackingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rideId = params.id;

  const activeRide = useRideStore((s) => s.activeRide);
  const advanceStatus = useRideStore((s) => s.advanceStatus);
  const tickEta = useRideStore((s) => s.tickEta);
  const cancelRide = useRideStore((s) => s.cancelRide);
  const submitRating = useRideStore((s) => s.submitRating);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingDismissed, setRatingDismissed] = useState(false);

  const ride = activeRide && activeRide.id === rideId ? activeRide : null;

  useEffect(() => {
    if (!ride || ride.status === "completed" || ride.status === "cancelled") {
      return;
    }
    const statusTimer = setInterval(() => {
      advanceStatus();
    }, 4000);
    return () => clearInterval(statusTimer);
  }, [ride, advanceStatus]);

  useEffect(() => {
    if (!ride || ride.status === "completed" || ride.status === "cancelled") {
      return;
    }
    const etaTimer = setInterval(() => {
      tickEta();
    }, 1000);
    return () => clearInterval(etaTimer);
  }, [ride, tickEta]);

  useEffect(() => {
    if (ride && ride.status === "completed" && !ratingDismissed && !ride.rating) {
      setShowRatingModal(true);
    }
  }, [ride, ratingDismissed]);

  if (!ride) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">Ride not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          This ride is no longer active. Check your ride history instead.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="btn-primary mt-6"
        >
          Book a new ride
        </button>
      </div>
    );
  }

  function handleConfirmCancel() {
    cancelRide(ride!.id);
    setShowCancelDialog(false);
    router.push("/");
  }

  function handleSubmitRating(stars: number, comment: string) {
    submitRating({
      rideId: ride!.id,
      stars,
      comment: comment || undefined,
      submittedAt: new Date().toISOString(),
    });
    setShowRatingModal(false);
  }

  const canCancel = ride.status !== "completed" && ride.status !== "cancelled";
  const isCompleted = ride.status === "completed";

  return (
    <div className="mx-auto max-w-6xl px-0 pb-10 sm:px-6 sm:py-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="h-64 w-full sm:h-[420px]">
          <MapPlaceholder
            variant="tracking"
            driverLabel={`${ride.driver.name} is on the way`}
            className="h-full rounded-none sm:rounded-2xl"
          />
        </div>

        <div className="space-y-4 px-4 sm:px-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isCompleted ? "Ride completed" : "Tracking your ride"}
            </h1>
            <p className="text-sm text-gray-500">
              {ride.pickup.label} → {ride.dropoff.label}
            </p>
          </div>

          <StatusStepper status={ride.status} />

          <DriverCard driver={ride.driver} etaSeconds={ride.etaSeconds} />

          <div className="card p-4">
            <h2 className="mb-2 text-sm font-bold text-gray-900">
              Fare breakdown
            </h2>
            <div className="space-y-1 text-sm text-gray-500">
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
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
                <span>Total</span>
                <span>${ride.fare.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {canCancel ? (
            <button
              type="button"
              onClick={() => setShowCancelDialog(true)}
              className="w-full rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Cancel ride
            </button>
          ) : null}

          {isCompleted && !ride.rating ? (
            <button
              type="button"
              onClick={() => setShowRatingModal(true)}
              className="btn-secondary w-full"
            >
              Rate this ride
            </button>
          ) : null}

          {isCompleted ? (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-primary w-full"
            >
              Book another ride
            </button>
          ) : null}
        </div>
      </div>

      <CancelDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleConfirmCancel}
      />

      <RatingModal
        open={showRatingModal}
        driverName={ride.driver.name}
        onSubmit={handleSubmitRating}
        onClose={() => {
          setShowRatingModal(false);
          setRatingDismissed(true);
        }}
      />
    </div>
  );
}
