import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Post } from "../PostCard";

interface MapViewProps {
  posts: Post[];
}

const MapView: React.FC<MapViewProps> = ({ posts }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (!mapContainer.current || !token) return;
    if (mapRef.current) return; // prevent re-init

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.985664, 40.748514],
      zoom: 11,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    mapRef.current.on("load", () => {
      posts.filter(p => p.coordinates).forEach((p) => {
        const el = document.createElement("div");
        el.className = "h-3 w-3 rounded-full bg-[hsl(var(--primary))] ring-2 ring-white";
        new mapboxgl.Marker(el).setLngLat([p.coordinates![0], p.coordinates![1]]).setPopup(new mapboxgl.Popup().setText(p.title)).addTo(mapRef.current!);
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token, posts]);

  return (
    <div className="space-y-3">
      {!token && (
        <div className="rounded-md border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Enter your Mapbox public token to enable the interactive map.</p>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            placeholder="Mapbox public token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            aria-label="Mapbox token"
          />
        </div>
      )}
      <div ref={mapContainer} className="h-[70vh] w-full rounded-lg border shadow-soft" />
    </div>
  );
};

export default MapView;
