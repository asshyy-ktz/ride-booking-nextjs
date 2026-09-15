import {
  AddressSuggestion,
  Driver,
  FareBreakdown,
  RideHistoryEntry,
  RideType,
} from "./types";

export const RIDE_TYPES: RideType[] = [
  {
    id: "economy",
    name: "Economy",
    description: "Affordable, everyday rides",
    capacity: 4,
    etaMinutes: 3,
    baseFare: 2.5,
    perKm: 0.9,
    perMin: 0.18,
    icon: "car",
  },
  {
    id: "comfort",
    name: "Comfort",
    description: "Newer cars, extra legroom",
    capacity: 4,
    etaMinutes: 5,
    baseFare: 4.0,
    perKm: 1.25,
    perMin: 0.25,
    icon: "car-premium",
  },
  {
    id: "xl",
    name: "XL",
    description: "Bigger cars for groups up to 6",
    capacity: 6,
    etaMinutes: 7,
    baseFare: 6.5,
    perKm: 1.6,
    perMin: 0.32,
    icon: "van",
  },
];

export const MOCK_ADDRESS_POOL: AddressSuggestion[] = [
  {
    id: "addr-1",
    label: "1200 Market Street",
    subLabel: "Downtown, Civic Center",
    lat: 37.7793,
    lng: -122.4193,
  },
  {
    id: "addr-2",
    label: "455 Golden Gate Ave",
    subLabel: "Tenderloin",
    lat: 37.7807,
    lng: -122.4177,
  },
  {
    id: "addr-3",
    label: "1 Ferry Building",
    subLabel: "Embarcadero",
    lat: 37.7955,
    lng: -122.3937,
  },
  {
    id: "addr-4",
    label: "2001 Union Street",
    subLabel: "Cow Hollow",
    lat: 37.7973,
    lng: -122.4359,
  },
  {
    id: "addr-5",
    label: "3630 20th Street",
    subLabel: "Mission District",
    lat: 37.7592,
    lng: -122.4207,
  },
  {
    id: "addr-6",
    label: "55 Music Concourse Drive",
    subLabel: "Golden Gate Park",
    lat: 37.7699,
    lng: -122.4661,
  },
  {
    id: "addr-7",
    label: "899 North Point Street",
    subLabel: "Fisherman's Wharf",
    lat: 37.8064,
    lng: -122.4204,
  },
  {
    id: "addr-8",
    label: "701 Illinois Street",
    subLabel: "Dogpatch",
    lat: 37.7597,
    lng: -122.3878,
  },
];

export function searchAddresses(query: string): AddressSuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];
  return MOCK_ADDRESS_POOL.filter(
    (addr) =>
      addr.label.toLowerCase().includes(trimmed) ||
      addr.subLabel.toLowerCase().includes(trimmed)
  ).slice(0, 5);
}

const DRIVER_POOL: Driver[] = [
  {
    id: "drv-1",
    name: "Marcus Webb",
    rating: 4.92,
    vehicleMake: "Toyota",
    vehicleModel: "Camry",
    vehicleColor: "Silver",
    licensePlate: "7XKT291",
    photoInitials: "MW",
  },
  {
    id: "drv-2",
    name: "Priya Nair",
    rating: 4.98,
    vehicleMake: "Honda",
    vehicleModel: "Accord",
    vehicleColor: "Black",
    licensePlate: "9DGH120",
    photoInitials: "PN",
  },
  {
    id: "drv-3",
    name: "Diego Alvarez",
    rating: 4.85,
    vehicleMake: "Kia",
    vehicleModel: "Carnival",
    vehicleColor: "White",
    licensePlate: "3RTS884",
    photoInitials: "DA",
  },
  {
    id: "drv-4",
    name: "Sarah Kim",
    rating: 4.96,
    vehicleMake: "Tesla",
    vehicleModel: "Model 3",
    vehicleColor: "Blue",
    licensePlate: "5LMP773",
    photoInitials: "SK",
  },
];

export function pickRandomDriver(): Driver {
  return DRIVER_POOL[Math.floor(Math.random() * DRIVER_POOL.length)];
}

export function computeDistanceKm(
  a: AddressSuggestion,
  b: AddressSuggestion
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  const distance = R * c;
  return Math.max(distance, 0.8);
}

export function computeFare(
  rideTypeId: string,
  distanceKm: number,
  surgeMultiplier = 1
): FareBreakdown {
  const rideType = RIDE_TYPES.find((r) => r.id === rideTypeId) ?? RIDE_TYPES[0];
  const durationMin = Math.round((distanceKm / 28) * 60 + 4);
  const baseFare = rideType.baseFare;
  const distanceFare = Number((distanceKm * rideType.perKm).toFixed(2));
  const timeFare = Number((durationMin * rideType.perMin).toFixed(2));
  const subtotal = Number((baseFare + distanceFare + timeFare).toFixed(2));
  const total = Number((subtotal * surgeMultiplier).toFixed(2));
  return {
    baseFare,
    distanceFare,
    timeFare,
    surgeMultiplier,
    subtotal,
    total,
    distanceKm: Number(distanceKm.toFixed(2)),
    durationMin,
  };
}

export const MOCK_RIDE_HISTORY: RideHistoryEntry[] = [
  {
    id: "ride-hist-1",
    date: "2026-09-10T18:24:00.000Z",
    fareTotal: 18.42,
    pickupLabel: "1200 Market Street",
    dropoffLabel: "1 Ferry Building",
    status: "completed",
    rideType: "comfort",
    driver: DRIVER_POOL[1],
    fare: computeFare("comfort", 4.1, 1),
    rating: {
      rideId: "ride-hist-1",
      stars: 5,
      comment: "Smooth ride, great music!",
      submittedAt: "2026-09-10T18:55:00.000Z",
    },
  },
  {
    id: "ride-hist-2",
    date: "2026-09-08T08:03:00.000Z",
    fareTotal: 11.2,
    pickupLabel: "3630 20th Street",
    dropoffLabel: "701 Illinois Street",
    status: "completed",
    rideType: "economy",
    driver: DRIVER_POOL[0],
    fare: computeFare("economy", 3.2, 1),
    rating: {
      rideId: "ride-hist-2",
      stars: 4,
      submittedAt: "2026-09-08T08:20:00.000Z",
    },
  },
  {
    id: "ride-hist-3",
    date: "2026-09-02T21:47:00.000Z",
    fareTotal: 32.75,
    pickupLabel: "899 North Point Street",
    dropoffLabel: "55 Music Concourse Drive",
    status: "completed",
    rideType: "xl",
    driver: DRIVER_POOL[2],
    fare: computeFare("xl", 6.8, 1.2),
  },
  {
    id: "ride-hist-4",
    date: "2026-08-29T13:10:00.000Z",
    fareTotal: 9.6,
    pickupLabel: "2001 Union Street",
    dropoffLabel: "455 Golden Gate Ave",
    status: "cancelled",
    rideType: "economy",
    driver: DRIVER_POOL[3],
    fare: computeFare("economy", 2.4, 1),
  },
];
