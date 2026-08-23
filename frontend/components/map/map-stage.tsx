"use client";

import { useEffect, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { Map, NavigationControl } from "react-map-gl/maplibre";
import { useMapLocation, DEFAULT_LATITUDE, DEFAULT_LONGITUDE, DEFAULT_ZOOM } from "@/components/map/location-context";
import { LocationMarker } from "@/components/map/location-marker";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export function MapStage() {
  const mapRef = useRef<MapRef | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hasInitialized = useRef(false);
  const { latitude, longitude, selectedPlace } = useMapLocation();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    if (!selectedPlace && !hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    hasInitialized.current = true;

    map.flyTo({
      center: [longitude, latitude],
      zoom: selectedPlace ? 15.5 : DEFAULT_ZOOM,
      duration: 1400,
      essential: true,
    });
  }, [isReady, latitude, longitude, selectedPlace]);

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef}
        onLoad={() => {
          setIsReady(true);
        }}
        initialViewState={{
          longitude: DEFAULT_LONGITUDE,
          latitude: DEFAULT_LATITUDE,
          zoom: DEFAULT_ZOOM,
        }}
        minZoom={3.5}
        maxZoom={18}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        {selectedPlace ? <LocationMarker place={selectedPlace} /> : null}
      </Map>
    </div>
  );
}
