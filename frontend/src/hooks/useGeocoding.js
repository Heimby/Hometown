import { useState, useCallback, useRef, useEffect, useMemo } from "react";

const MAPBOX_API_KEY =
  "pk.eyJ1IjoibWF0aGlhc2g5OCIsImEiOiJjbTlyazZldGcxOGhrMnBzNDQ2ZnBwamliIn0.F4Bg0KiGmcKuDQfCuMCqyw";
const MAPBOX_GEOCODING_URL = "https://api.mapbox.com/search/geocode/v6/forward";

const DEFAULT_TYPES = ["address", "place", "locality", "neighborhood"];

export function useGeocoding({
  types = DEFAULT_TYPES,
  limit = 5,
  debounceMs = 300,
  country,
} = {}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const typesString = useMemo(() => types.join(","), [types]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const searchAddress = useCallback(
    (query) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();

      if (!query || query.trim().length < 3 || !MAPBOX_API_KEY) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      debounceTimerRef.current = setTimeout(async () => {
        try {
          abortControllerRef.current = new AbortController();

          const params = new URLSearchParams({
            access_token: MAPBOX_API_KEY,
            types: typesString,
            limit: String(limit),
            language: "no",
            autocomplete: "true",
            q: query,
          });

          if (country) params.set("country", country);

          const response = await fetch(
            `${MAPBOX_GEOCODING_URL}?${params.toString()}`,
            { signal: abortControllerRef.current.signal }
          );

          if (!response.ok) {
            throw new Error(`Geocoding request failed: ${response.status}`);
          }

          const data = await response.json();

          const formatted = (data.features || []).map((feature) => {
            const props = feature.properties || {};
            return {
              id: feature.id,
              label:
                props.full_address || props.place_formatted || props.name || "",
              secondary: props.place_formatted || "",
              coordinates: {
                lng: feature.geometry?.coordinates?.[0],
                lat: feature.geometry?.coordinates?.[1],
                accuracy: props.coordinates?.accuracy,
              },
              featureType: props.feature_type,
              context: props.context || {},
              raw: feature, // full Mapbox feature
            };
          });

          setSuggestions(formatted);
          setIsLoading(false);
        } catch (err) {
          if (err && err.name === "AbortError") return;
          setError(err?.message || "Unknown error");
          setSuggestions([]);
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [typesString, limit, debounceMs, country]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return { suggestions, isLoading, error, searchAddress, clearSuggestions };
}

export default useGeocoding;
