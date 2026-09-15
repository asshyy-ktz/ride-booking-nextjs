import { create } from "zustand";
import {
  AddressSuggestion,
  FareBreakdown,
  RatingSubmission,
  Ride,
  RideHistoryEntry,
  RIDE_STATUS_ORDER,
  RideStatus,
  RideTypeId,
} from "@/lib/types";
import {
  MOCK_RIDE_HISTORY,
  computeDistanceKm,
  computeFare,
  pickRandomDriver,
} from "@/lib/mockData";

interface RideState {
  activeRide: Ride | null;
  history: RideHistoryEntry[];
  pickup: AddressSuggestion | null;
  dropoff: AddressSuggestion | null;
  selectedRideType: RideTypeId;
  surgeMultiplier: number;
  setPickup: (addr: AddressSuggestion | null) => void;
  setDropoff: (addr: AddressSuggestion | null) => void;
  setSelectedRideType: (id: RideTypeId) => void;
  getFareEstimate: (rideType: RideTypeId) => FareBreakdown | null;
  requestRide: () => string | null;
  advanceStatus: () => void;
  tickEta: () => void;
  cancelRide: (rideId: string) => void;
  completeRide: () => void;
  submitRating: (rating: RatingSubmission) => void;
  getRideById: (id: string) => Ride | RideHistoryEntry | undefined;
  getHistoryById: (id: string) => RideHistoryEntry | undefined;
}

let rideCounter = 100;

export const useRideStore = create<RideState>((set, get) => ({
  activeRide: null,
  history: MOCK_RIDE_HISTORY,
  pickup: null,
  dropoff: null,
  selectedRideType: "economy",
  surgeMultiplier: 1,

  setPickup: (addr) => set({ pickup: addr }),
  setDropoff: (addr) => set({ dropoff: addr }),
  setSelectedRideType: (id) => set({ selectedRideType: id }),

  getFareEstimate: (rideType) => {
    const { pickup, dropoff, surgeMultiplier } = get();
    if (!pickup || !dropoff) return null;
    const distanceKm = computeDistanceKm(pickup, dropoff);
    return computeFare(rideType, distanceKm, surgeMultiplier);
  },

  requestRide: () => {
    const { pickup, dropoff, selectedRideType, surgeMultiplier } = get();
    if (!pickup || !dropoff) return null;
    const distanceKm = computeDistanceKm(pickup, dropoff);
    const fare = computeFare(selectedRideType, distanceKm, surgeMultiplier);
    rideCounter += 1;
    const id = `ride-${rideCounter}`;
    const ride: Ride = {
      id,
      status: "requested",
      rideType: selectedRideType,
      pickup,
      dropoff,
      fare,
      driver: pickRandomDriver(),
      etaSeconds: 4 * 60 + Math.floor(Math.random() * 120),
      requestedAt: new Date().toISOString(),
    };
    set({ activeRide: ride });
    return id;
  },

  advanceStatus: () => {
    const { activeRide } = get();
    if (!activeRide) return;
    const idx = RIDE_STATUS_ORDER.indexOf(activeRide.status);
    if (idx === -1 || idx >= RIDE_STATUS_ORDER.length - 1) return;
    const nextStatus: RideStatus = RIDE_STATUS_ORDER[idx + 1];
    set({ activeRide: { ...activeRide, status: nextStatus } });
    if (nextStatus === "completed") {
      get().completeRide();
    }
  },

  tickEta: () => {
    const { activeRide } = get();
    if (!activeRide || activeRide.etaSeconds <= 0) return;
    set({
      activeRide: {
        ...activeRide,
        etaSeconds: Math.max(0, activeRide.etaSeconds - 1),
      },
    });
  },

  cancelRide: (rideId) => {
    const { activeRide, history } = get();
    if (!activeRide || activeRide.id !== rideId) return;
    const entry: RideHistoryEntry = {
      id: activeRide.id,
      date: new Date().toISOString(),
      fareTotal: 0,
      pickupLabel: activeRide.pickup.label,
      dropoffLabel: activeRide.dropoff.label,
      status: "cancelled",
      rideType: activeRide.rideType,
      driver: activeRide.driver,
      fare: { ...activeRide.fare, total: 0 },
    };
    set({ activeRide: null, history: [entry, ...history] });
  },

  completeRide: () => {
    const { activeRide, history } = get();
    if (!activeRide) return;
    const entry: RideHistoryEntry = {
      id: activeRide.id,
      date: activeRide.requestedAt,
      fareTotal: activeRide.fare.total,
      pickupLabel: activeRide.pickup.label,
      dropoffLabel: activeRide.dropoff.label,
      status: "completed",
      rideType: activeRide.rideType,
      driver: activeRide.driver,
      fare: activeRide.fare,
    };
    set({
      activeRide: { ...activeRide, completedAt: new Date().toISOString() },
      history: [entry, ...history],
    });
  },

  submitRating: (rating) => {
    const { history, activeRide } = get();
    const updatedHistory = history.map((h) =>
      h.id === rating.rideId ? { ...h, rating } : h
    );
    set({
      history: updatedHistory,
      activeRide:
        activeRide && activeRide.id === rating.rideId
          ? { ...activeRide, rating }
          : activeRide,
    });
  },

  getRideById: (id) => {
    const { activeRide, history } = get();
    if (activeRide && activeRide.id === id) return activeRide;
    return history.find((h) => h.id === id);
  },

  getHistoryById: (id) => {
    return get().history.find((h) => h.id === id);
  },
}));
