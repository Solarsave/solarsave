"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { GeocodedPlace } from "@/lib/geocoding";

export const DEFAULT_LONGITUDE = -98.5795;
export const DEFAULT_LATITUDE = 39.8283;
export const DEFAULT_ZOOM = 4.2;

type MapLocationContextValue = {
  longitude: number;
  latitude: number;
  selectedPlace: GeocodedPlace | null;
  setLocation: (place: GeocodedPlace) => void;
  resetLocation: () => void;
};

const MapLocationContext = createContext<MapLocationContextValue | null>(null);

export function MapLocationProvider({ children }: { children: ReactNode }) {
  const [selectedPlace, setSelectedPlace] = useState<GeocodedPlace | null>(null);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);

  const value = useMemo<MapLocationContextValue>(
    () => ({
      longitude,
      latitude,
      selectedPlace,
      setLocation: (place) => {
        setSelectedPlace(place);
        setLongitude(place.longitude);
        setLatitude(place.latitude);
      },
      resetLocation: () => {
        setSelectedPlace(null);
        setLongitude(DEFAULT_LONGITUDE);
        setLatitude(DEFAULT_LATITUDE);
      },
    }),
    [latitude, longitude, selectedPlace]
  );

  return <MapLocationContext.Provider value={value}>{children}</MapLocationContext.Provider>;
}

export function useMapLocation() {
  const context = useContext(MapLocationContext);

  if (!context) {
    throw new Error("useMapLocation must be used within a MapLocationProvider.");
  }

  return context;
}
