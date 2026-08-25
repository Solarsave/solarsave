"use client";

import { AddressSearch } from "@/components/address-search";
import { MapLocationProvider } from "@/components/map/location-context";
import { MapStage } from "@/components/map/map-stage";
import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl } from "maplibre-gl";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export function RenderMap() {
  return (
    <MapLocationProvider>
      <div className="relative h-screen w-screen overflow-hidden bg-black">
        <MapStage />
        <AddressSearch />
      </div>
    </MapLocationProvider>
  );
}
