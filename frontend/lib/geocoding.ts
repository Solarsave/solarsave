export interface GeocodedPlace {
  id: string;
  title: string;
  subtitle: string;
  longitude: number;
  latitude: number;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

interface NominatimSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: NominatimAddress;
}

function buildSubtitle(address: NominatimAddress | undefined, displayName: string) {
  if (!address) {
    return displayName;
  }

  const locality = address.city || address.town || address.village || address.county;
  const street = [address.house_number, address.road].filter(Boolean).join(" ");
  const parts = [street || address.neighbourhood || locality, locality, address.state]
    .filter(Boolean)
    .map((part) => String(part).trim());

  return parts.length > 0 ? parts.join(" • ") : displayName;
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<GeocodedPlace[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");

  const response = await fetch(url.toString(), {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Address lookup failed.");
  }

  const results = (await response.json()) as NominatimSearchResult[];

  return results
    .map((result) => {
      const title = result.name?.trim() || result.display_name.split(",")[0]?.trim() || result.display_name;
      return {
        id: String(result.place_id),
        title,
        subtitle: buildSubtitle(result.address, result.display_name),
        longitude: Number(result.lon),
        latitude: Number(result.lat),
      } satisfies GeocodedPlace;
    })
    .filter((place) => Number.isFinite(place.longitude) && Number.isFinite(place.latitude));
}
