# RideBook — Ride Booking Demo (Next.js)

A fully mocked, production-shaped ride-booking application built with
Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, and TanStack
Query. There is no real backend or maps SDK — all data, geocoding, ETAs,
and driver assignment are simulated locally so the app runs entirely
client-side.

## Tech stack

- **Next.js 14** — App Router, React Server/Client Components
- **TypeScript** — strict mode
- **Tailwind CSS** — utility-first styling, mobile-first responsive layout
- **Zustand** — ride/booking state (`store/rideStore.ts`) and saved
  places with `localStorage` persistence (`store/savedPlacesStore.ts`)
- **TanStack Query** — `QueryClientProvider` is wired up in
  `app/providers.tsx` so the app is ready for real async data fetching
  (the demo's data is synchronous/local, but the provider tree, query
  client, and patterns are production-ready)

## Architecture

```
app/
  layout.tsx            Root layout, wraps the app in Providers + Header
  providers.tsx          TanStack Query client provider
  globals.css            Tailwind base + shared component classes
  page.tsx               Booking home (pickup/dropoff + ride type + CTA)
  ride/[id]/page.tsx      Live ride tracking screen
  history/page.tsx        Ride history list
  history/[id]/page.tsx   Ride receipt detail view

components/
  Header.tsx              Top nav (Book / History)
  MapPlaceholder.tsx       Stylized CSS/SVG map (booking + tracking variants)
  BookingForm.tsx          Address inputs, autocomplete, saved places, ride
                            type selector, fare estimate, request CTA
  RideTypeCard.tsx         Economy/Comfort/XL selectable card with fare
  DriverCard.tsx           Driver name/rating/vehicle + live ETA countdown
  StatusStepper.tsx        requested → driver_assigned → en_route →
                            arrived → in_progress → completed
  CancelDialog.tsx         Confirm-before-cancel modal
  RatingModal.tsx          Post-ride star rating + optional comment
  RideHistoryItem.tsx      Single row in the history list
  SavedPlaceChip.tsx       Home/Work/custom quick-select chip

store/
  rideStore.ts             Active ride lifecycle, fare estimation,
                            ETA countdown, cancellation, ride history,
                            rating submission
  savedPlacesStore.ts       Saved places CRUD, persisted to localStorage
                            via zustand/middleware `persist`

lib/
  types.ts                 Shared TypeScript types (Ride, Driver,
                            FareBreakdown, SavedPlace, etc.)
  mockData.ts               Mock address pool + autocomplete search,
                             mock driver pool, distance/fare calculation,
                             seeded ride history
```

## Mock data & state flow

1. **Address autocomplete** — `searchAddresses()` in `lib/mockData.ts`
   filters a small in-memory pool of addresses by substring match. No
   network request is made.
2. **Fare estimation** — `computeDistanceKm()` uses the haversine
   formula against the mock lat/lng pairs, then `computeFare()` applies
   each ride type's base fare, per-km rate, per-minute rate, and an
   optional surge multiplier to produce an itemized `FareBreakdown`.
3. **Requesting a ride** — `useRideStore.requestRide()` snapshots the
   selected pickup/dropoff/ride type into an `activeRide` object with a
   freshly picked mock `Driver` and a randomized initial ETA, then the
   booking page navigates to `/ride/[id]`.
4. **Live tracking** — the tracking page runs two client-side
   `setInterval` timers: one advances the ride through
   `RIDE_STATUS_ORDER` every 4 seconds, the other decrements
   `etaSeconds` every second. Both are cleaned up on unmount. When the
   ride reaches `completed`, it is appended to ride history and a
   rating prompt appears.
5. **Cancelling** — `CancelDialog` gates `cancelRide()`, which clears
   the active ride and logs a `cancelled` entry to history.
6. **Ride history & receipts** — `history` lives in the same
   `rideStore` (no separate fetch); `/history` lists entries and
   `/history/[id]` renders a full receipt, including any submitted
   rating.
7. **Ratings** — `RatingModal` collects a 1–5 star rating and optional
   comment, and `submitRating()` merges it onto the matching history
   entry (and the active ride, if still in memory).
8. **Saved places** — `savedPlacesStore` is wrapped in Zustand's
   `persist` middleware, so added/edited/removed places survive page
   reloads via `localStorage`.

## Responsive layout

- **Mobile** (default): single column, the map placeholder sits at the
  top and the booking form renders as a bottom-sheet-style panel with a
  rounded top edge and shadow.
- **Desktop** (`sm:` breakpoint and up): split view — map placeholder on
  the left, booking/tracking panel on the right inside a bordered card.

## Running locally

This is a source-only repository (no `node_modules`, lockfile, or build
output is checked in). To run it:

```bash
npm install
npm run dev
```

Then open http://localhost:3000. No environment variables, API keys, or
external services are required — everything is mocked.

## Notes

- All "network" delays, driver assignment, and map rendering are
  simulated; there is no real maps SDK or geocoding service involved.
- State resets on a full page reload except for saved places, which
  persist via `localStorage`.
