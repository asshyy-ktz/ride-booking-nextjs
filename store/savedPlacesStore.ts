import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SavedPlace } from "@/lib/types";

interface SavedPlacesState {
  places: SavedPlace[];
  addPlace: (place: Omit<SavedPlace, "id">) => void;
  updatePlace: (id: string, updates: Partial<Omit<SavedPlace, "id">>) => void;
  removePlace: (id: string) => void;
}

const DEFAULT_PLACES: SavedPlace[] = [
  {
    id: "home",
    label: "Home",
    address: "2001 Union Street, Cow Hollow",
    type: "home",
    lat: 37.7973,
    lng: -122.4359,
  },
  {
    id: "work",
    label: "Work",
    address: "1200 Market Street, Downtown",
    type: "work",
    lat: 37.7793,
    lng: -122.4193,
  },
];

export const useSavedPlacesStore = create<SavedPlacesState>()(
  persist(
    (set, get) => ({
      places: DEFAULT_PLACES,
      addPlace: (place) => {
        const id = `place-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        set({ places: [...get().places, { ...place, id }] });
      },
      updatePlace: (id, updates) => {
        set({
          places: get().places.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        });
      },
      removePlace: (id) => {
        set({ places: get().places.filter((p) => p.id !== id) });
      },
    }),
    {
      name: "ride-booking-saved-places",
    }
  )
);
