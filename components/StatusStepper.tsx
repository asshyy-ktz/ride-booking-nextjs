"use client";

import { RIDE_STATUS_ORDER, RideStatus } from "@/lib/types";

const STATUS_LABELS: Record<RideStatus, string> = {
  requested: "Requested",
  driver_assigned: "Driver assigned",
  en_route: "En route",
  arrived: "Arrived",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface StatusStepperProps {
  status: RideStatus;
}

export default function StatusStepper({ status }: StatusStepperProps) {
  const currentIndex = RIDE_STATUS_ORDER.indexOf(status);

  if (status === "cancelled") {
    return (
      <div className="card flex items-center gap-2 p-4 text-red-600">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="font-semibold">Ride cancelled</span>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <ol className="flex items-start justify-between">
        {RIDE_STATUS_ORDER.map((step, idx) => {
          const done = idx < currentIndex;
          const active = idx === currentIndex;
          return (
            <li key={step} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={`h-0.5 flex-1 ${
                    idx === 0 ? "opacity-0" : done || active ? "bg-brand-500" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    done
                      ? "border-brand-600 bg-brand-600 text-white"
                      : active
                      ? "border-brand-600 bg-white text-brand-600"
                      : "border-gray-200 bg-white text-gray-300"
                  }`}
                >
                  {done ? "✓" : idx + 1}
                </div>
                <div
                  className={`h-0.5 flex-1 ${
                    idx === RIDE_STATUS_ORDER.length - 1
                      ? "opacity-0"
                      : done
                      ? "bg-brand-500"
                      : "bg-gray-200"
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-center text-[10px] font-semibold leading-tight sm:text-xs ${
                  active ? "text-brand-700" : done ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
