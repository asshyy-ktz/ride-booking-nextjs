"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRideStore } from "@/store/rideStore";
import { useSavedPlacesStore } from "@/store/savedPlacesStore";
import { searchAddresses } from "@/lib/mockData";
import { RIDE_TYPES } from "@/lib/mockData";
import { AddressSuggestion, SavedPlace } from "@/lib/types";
import RideTypeCard from "./RideTypeCard";
import SavedPlaceChip from "./SavedPlaceChip";

type Field = "pickup" | "dropoff";

export default function BookingForm() {
  const router = useRouter();
  const {
    pickup,
    dropoff,
    setPickup,
    setDropoff,
    selectedRideType,
    setSelectedRideType,
    getFareEstimate,
    requestRide,
    surgeMultiplier,
  } = useRideStore();

  const { places, addPlace, updatePlace, removePlace } = useSavedPlacesStore();

  const [pickupQuery, setPickupQuery] = useState("");
  const [dropoffQuery, setDropoffQuery] = useState("");
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [placeLabel, setPlaceLabel] = useState("");
  const [placeAddress, setPlaceAddress] = useState("");
  const [placeType, setPlaceType] = useState<SavedPlace["type"]>("custom");
  const [isRequesting, setIsRequesting] = useState(false);

  const pickupSuggestions = useMemo(
    () => searchAddresses(pickupQuery),
    [pickupQuery]
  );
  const dropoffSuggestions = useMemo(
    () => searchAddresses(dropoffQuery),
    [dropoffQuery]
  );

  function handleSelectSuggestion(field: Field, suggestion: AddressSuggestion) {
    if (field === "pickup") {
      setPickup(suggestion);
      setPickupQuery(suggestion.label);
    } else {
      setDropoff(suggestion);
      setDropoffQuery(suggestion.label);
    }
    setActiveField(null);
  }

  function handleSelectSavedPlace(place: SavedPlace) {
    const suggestion: AddressSuggestion = {
      id: place.id,
      label: place.label === "Home" || place.label === "Work" ? place.address : place.label,
      subLabel: place.address,
      lat: place.lat,
      lng: place.lng,
    };
    if (!pickup) {
      setPickup(suggestion);
      setPickupQuery(suggestion.label);
    } else {
      setDropoff(suggestion);
      setDropoffQuery(suggestion.label);
    }
  }

  function openAddPlaceForm() {
    setEditingPlaceId(null);
    setPlaceLabel("");
    setPlaceAddress("");
    setPlaceType("custom");
    setShowPlaceForm(true);
  }

  function openEditPlaceForm(place: SavedPlace) {
    setEditingPlaceId(place.id);
    setPlaceLabel(place.label);
    setPlaceAddress(place.address);
    setPlaceType(place.type);
    setShowPlaceForm(true);
  }

  function handleSavePlace() {
    if (!placeLabel.trim() || !placeAddress.trim()) return;
    if (editingPlaceId) {
      updatePlace(editingPlaceId, {
        label: placeLabel.trim(),
        address: placeAddress.trim(),
        type: placeType,
      });
    } else {
      addPlace({
        label: placeLabel.trim(),
        address: placeAddress.trim(),
        type: placeType,
        lat: 37.7749 + (Math.random() - 0.5) * 0.05,
        lng: -122.4194 + (Math.random() - 0.5) * 0.05,
      });
    }
    setShowPlaceForm(false);
  }

  const canRequest = Boolean(pickup && dropoff) && !isRequesting;

  function handleRequestRide() {
    if (!canRequest) return;
    setIsRequesting(true);
    const id = requestRide();
    if (id) {
      router.push(`/ride/${id}`);
    } else {
      setIsRequesting(false);
    }
  }

  const fareEstimate = getFareEstimate(selectedRideType);

  return (
    <div className="flex h-full flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Where to?</h1>
        <p className="text-sm text-gray-500">
          Enter a pickup and drop-off to see live fare estimates.
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Pickup
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            <input
              value={pickupQuery}
              onChange={(e) => {
                setPickupQuery(e.target.value);
                setActiveField("pickup");
                if (!e.target.value) setPickup(null);
              }}
              onFocus={() => setActiveField("pickup")}
              placeholder="Enter pickup address"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          {activeField === "pickup" && pickupSuggestions.length > 0 ? (
            <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              {pickupSuggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-gray-50"
                    onClick={() => handleSelectSuggestion("pickup", s)}
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {s.label}
                    </span>
                    <span className="text-xs text-gray-400">{s.subLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Drop-off
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
            <input
              value={dropoffQuery}
              onChange={(e) => {
                setDropoffQuery(e.target.value);
                setActiveField("dropoff");
                if (!e.target.value) setDropoff(null);
              }}
              onFocus={() => setActiveField("dropoff")}
              placeholder="Enter destination"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          {activeField === "dropoff" && dropoffSuggestions.length > 0 ? (
            <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              {dropoffSuggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-gray-50"
                    onClick={() => handleSelectSuggestion("dropoff", s)}
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {s.label}
                    </span>
                    <span className="text-xs text-gray-400">{s.subLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Saved places
          </span>
          <button
            type="button"
            onClick={openAddPlaceForm}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            + Add place
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {places.map((place) => (
            <SavedPlaceChip
              key={place.id}
              place={place}
              onSelect={() => handleSelectSavedPlace(place)}
              onEdit={() => openEditPlaceForm(place)}
              onRemove={() => removePlace(place.id)}
            />
          ))}
        </div>
        {showPlaceForm ? (
          <div className="mt-3 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex gap-2">
              <input
                value={placeLabel}
                onChange={(e) => setPlaceLabel(e.target.value)}
                placeholder="Label (e.g. Gym)"
                className="w-1/2 rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
              />
              <select
                value={placeType}
                onChange={(e) =>
                  setPlaceType(e.target.value as SavedPlace["type"])
                }
                className="w-1/2 rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
              >
                <option value="custom">Custom</option>
                <option value="home">Home</option>
                <option value="work">Work</option>
              </select>
            </div>
            <input
              value={placeAddress}
              onChange={(e) => setPlaceAddress(e.target.value)}
              placeholder="Address"
              className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPlaceForm(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlace}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
          Choose a ride
        </span>
        <div className="space-y-2">
          {RIDE_TYPES.map((rideType) => {
            const estimate = pickup && dropoff ? getFareEstimate(rideType.id) : null;
            return (
              <RideTypeCard
                key={rideType.id}
                rideType={rideType}
                fareTotal={estimate ? estimate.total : null}
                selected={selectedRideType === rideType.id}
                onSelect={() => setSelectedRideType(rideType.id)}
              />
            );
          })}
        </div>
      </div>

      {fareEstimate ? (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
          <div className="mb-1 flex items-center justify-between text-gray-500">
            <span>Base fare</span>
            <span>${fareEstimate.baseFare.toFixed(2)}</span>
          </div>
          <div className="mb-1 flex items-center justify-between text-gray-500">
            <span>Distance ({fareEstimate.distanceKm} km)</span>
            <span>${fareEstimate.distanceFare.toFixed(2)}</span>
          </div>
          <div className="mb-1 flex items-center justify-between text-gray-500">
            <span>Time ({fareEstimate.durationMin} min)</span>
            <span>${fareEstimate.timeFare.toFixed(2)}</span>
          </div>
          {fareEstimate.surgeMultiplier > 1 ? (
            <div className="mb-1 flex items-center justify-between text-amber-600">
              <span>Surge x{fareEstimate.surgeMultiplier}</span>
              <span>
                +$
                {(fareEstimate.total - fareEstimate.subtotal).toFixed(2)}
              </span>
            </div>
          ) : null}
          <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
            <span>Total</span>
            <span>${fareEstimate.total.toFixed(2)}</span>
          </div>
          {surgeMultiplier > 1 ? (
            <p className="mt-1 text-xs text-amber-600">
              Prices are higher due to increased demand nearby.
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleRequestRide}
        disabled={!canRequest}
        className="btn-primary w-full"
      >
        {isRequesting ? "Requesting..." : "Request Ride"}
      </button>
    </div>
  );
}
