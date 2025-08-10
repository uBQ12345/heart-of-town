import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapPickerProps {
  value?: { lng: number; lat: number } | null;
  onChange: (coords: { lng: number; lat: number } | null) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ value, onChange }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!mapContainer.current || !token || mapRef.current) return;
    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: value ? [value.lng, value.lat] : [-73.985664, 40.748514],
      zoom: value ? 14 : 10,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    function placeMarker(lngLat: mapboxgl.LngLatLike) {
      if (!mapRef.current) return;
      if (!markerRef.current) {
        const el = document.createElement("div");
        el.className = "h-3 w-3 rounded-full bg-[hsl(var(--primary))] ring-2 ring-white";
        markerRef.current = new mapboxgl.Marker(el).setLngLat(lngLat).addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat(lngLat);
      }
    }

    mapRef.current.on("click", (e) => {
      const coords = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      placeMarker([coords.lng, coords.lat]);
      onChange(coords);
    });

    if (value) placeMarker([value.lng, value.lat]);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [token]);

  return (
    <div className="space-y-2">
      {!token && (
        <div className="rounded-md border bg-card p-3">
          <p className="text-sm text-muted-foreground mb-2">Enter Mapbox public token to pick a location.</p>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            placeholder="Mapbox public token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
      )}
      <div ref={mapContainer} className="h-64 w-full rounded-lg border shadow-soft" />
      {value && (
        <p className="text-sm text-muted-foreground">Selected: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}</p>
      )}
    </div>
  );
};

export default MapPicker;
