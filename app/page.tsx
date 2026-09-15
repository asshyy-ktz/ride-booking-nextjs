"use client";

import MapPlaceholder from "@/components/MapPlaceholder";
import BookingForm from "@/components/BookingForm";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-0 pb-24 sm:px-6 sm:pb-10">
      <div className="grid gap-6 sm:grid-cols-2 sm:py-6">
        <div className="hidden h-[560px] sm:block">
          <MapPlaceholder variant="booking" className="h-full" />
        </div>
        <div className="sm:hidden">
          <div className="h-52 w-full">
            <MapPlaceholder variant="booking" className="h-full rounded-none" />
          </div>
        </div>

        <div className="sm:card sm:h-[560px] sm:overflow-y-auto sm:p-6">
          <div className="rounded-t-3xl border border-b-0 border-gray-100 bg-white p-5 shadow-sheet sm:hidden">
            <BookingForm />
          </div>
          <div className="hidden sm:block">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
