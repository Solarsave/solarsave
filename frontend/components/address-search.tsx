"use client";

import { useEffect, useMemo, useState } from "react";
import { searchPlaces, type GeocodedPlace } from "@/lib/geocoding";
import { useMapLocation } from "@/components/map/location-context";

export function AddressSearch() {
  const { resetLocation, selectedPlace, setLocation } = useMapLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodedPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  useEffect(() => {
    if (!hasQuery) {
      setResults([]);
      setError(null);
      setLoading(false);
      setActiveIndex(-1);
      return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const places = await searchPlaces(trimmedQuery, controller.signal);
        setResults(places);
        setActiveIndex(places.length > 0 ? 0 : -1);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setError("We could not fetch address suggestions right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [hasQuery, trimmedQuery]);

  const statusLabel = useMemo(() => {
    if (loading) {
      return "Searching...";
    }
    if (results.length > 0) {
      return `${results.length} suggestion${results.length === 1 ? "" : "s"}`;
    }
    if (hasQuery) {
      return "No matches yet";
    }
    return "Start typing an address";
  }, [hasQuery, loading, results.length]);

  function selectPlace(place: GeocodedPlace) {
    setQuery("");
    setResults([]);
    setError(null);
    setActiveIndex(-1);
    setLocation(place);
  }

  function clearSearchInput() {
    setQuery("");
    setResults([]);
    setError(null);
    setActiveIndex(-1);
  }

  function clearSelectedPlace() {
    clearSearchInput();
    resetLocation();
  }

  return (
    <div className="absolute left-4 top-4 z-20 w-[min(92vw,26rem)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <span className="text-sm font-semibold text-slate-500">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" && results.length > 0) {
                event.preventDefault();
                setActiveIndex((current) => Math.min(current + 1, results.length - 1));
              }
              if (event.key === "ArrowUp" && results.length > 0) {
                event.preventDefault();
                setActiveIndex((current) => Math.max(current - 1, 0));
              }
              if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
                event.preventDefault();
                selectPlace(results[activeIndex]);
              }
              if (event.key === "Escape") {
                setResults([]);
                setActiveIndex(-1);
              }
            }}
            placeholder="Search address"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          {hasQuery ? (
            <button
              type="button"
              onClick={clearSearchInput}
              className="rounded-full px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
          <span>{statusLabel}</span>
        </div>

        {error ? <p className="mt-2 px-1 text-sm text-rose-600">{error}</p> : null}

        {selectedPlace ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{selectedPlace.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{selectedPlace.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={clearSelectedPlace}
                aria-label="Clear selected location"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedPlace.category ? (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                  {selectedPlace.category}
                </span>
              ) : null}
              {selectedPlace.type ? (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                  {selectedPlace.type}
                </span>
              ) : null}
              {selectedPlace.country ? (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                  {selectedPlace.country}
                </span>
              ) : null}
              {selectedPlace.state ? (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                  {selectedPlace.state}
                </span>
              ) : null}
              {selectedPlace.postcode ? (
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                  {selectedPlace.postcode}
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <span className="text-base leading-none text-slate-400">⌖</span>
              <span className="font-medium">
                Lat {selectedPlace.latitude.toFixed(5)} • Lng {selectedPlace.longitude.toFixed(5)}
              </span>
            </div>

            <p className="mt-3 break-words text-xs leading-5 text-slate-400">
              {selectedPlace.displayName}
            </p>
          </div>
        ) : null}

        {results.length > 0 ? (
          <ul className="mt-3 max-h-80 overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            {results.map((place, index) => (
              <li key={place.id}>
                <button
                  type="button"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectPlace(place)}
                  className={[
                    "w-full rounded-lg px-3 py-3 text-left transition",
                    index === activeIndex ? "bg-slate-100" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span className="block text-sm font-semibold text-slate-900">{place.title}</span>
                  <span className="mt-1 block text-sm text-slate-500">{place.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
