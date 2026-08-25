"use client";

import { Marker, Popup } from "react-map-gl/maplibre";
import type { GeocodedPlace } from "@/lib/geocoding";
import { Button } from "../ui/button";

export function LocationMarker({ place }: { place: GeocodedPlace }) {
  return (
    <>
      <Marker longitude={place.longitude} latitude={place.latitude} anchor="bottom">
        <div className="flex flex-col items-center">
          <div className="h-4 w-4 rounded-full border-2 border-white bg-cyan-500 shadow-[0_0_0_6px_rgba(8,145,178,0.18)]" />
          <div className="h-3 w-1 rounded-full bg-cyan-400/80" />
        </div>
      </Marker>

      <Popup
        longitude={place.longitude}
        latitude={place.latitude}
        anchor="top"
        closeButton={false}
        closeOnClick={false}
        offset={24}
        className="bg-white"
      >
        <div className="">
          <div className="text-sm font-semibold">{place.title}</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">{place.subtitle}</div>
          <Button place={place} />
        </div>
      </Popup>
    </>
  );
}
