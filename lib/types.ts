export type RideTypeId = "economy" | "comfort" | "xl";

export interface RideType {
  id: RideTypeId;
  name: string;
  description: string;
  capacity: number;
  etaMinutes: number;
  baseFare: number;
  perKm: number;
  perMin: number;
  icon: "car" | "car-premium" | "van";
}

export type RideStatus =
  | "requested"
  | "driver_assigned"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export const RIDE_STATUS_ORDER: RideStatus[] = [
  "requested",
  "driver_assigned",
  "en_route",
  "arrived",
  "in_progress",
  "completed",
];

export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  photoInitials: string;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  subtotal: number;
  total: number;
  distanceKm: number;
  durationMin: number;
}

export interface AddressSuggestion {
  id: string;
  label: string;
  subLabel: string;
  lat: number;
  lng: number;
}

export interface SavedPlace {
  id: string;
  label: string;
  address: string;
  type: "home" | "work" | "custom";
  lat: number;
  lng: number;
}

export interface RatingSubmission {
  rideId: string;
  stars: number;
  comment?: string;
  submittedAt: string;
}

export interface Ride {
  id: string;
  status: RideStatus;
  rideType: RideTypeId;
  pickup: AddressSuggestion;
  dropoff: AddressSuggestion;
  fare: FareBreakdown;
  driver: Driver;
  etaSeconds: number;
  requestedAt: string;
  completedAt?: string;
  rating?: RatingSubmission;
}

export interface RideHistoryEntry {
  id: string;
  date: string;
  fareTotal: number;
  pickupLabel: string;
  dropoffLabel: string;
  status: RideStatus;
  rideType: RideTypeId;
  driver: Driver;
  fare: FareBreakdown;
  rating?: RatingSubmission;
}
