"use client";

import { Driver } from "@/lib/types";

interface DriverCardProps {
  driver: Driver;
  etaSeconds: number;
}

function formatEta(seconds: number): string {
  if (seconds <= 0) return "Arriving now";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins <= 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

export default function DriverCard({ driver, etaSeconds }: DriverCardProps) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
        {driver.photoInitials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-bold text-gray-900">{driver.name}</p>
          <div className="flex shrink-0 items-center gap-1 text-sm text-amber-500">
            <span>★</span>
            <span className="font-semibold">{driver.rating.toFixed(2)}</span>
          </div>
        </div>
        <p className="truncate text-sm text-gray-500">
          {driver.vehicleColor} {driver.vehicleMake} {driver.vehicleModel} ·{" "}
          {driver.licensePlate}
        </p>
      </div>
      <div className="shrink-0 rounded-xl bg-brand-600 px-3 py-2 text-center text-white">
        <p className="text-[10px] font-medium uppercase tracking-wide opacity-80">
          ETA
        </p>
        <p className="font-bold tabular-nums">{formatEta(etaSeconds)}</p>
      </div>
    </div>
  );
}
