import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CategoryFilters, { Category } from "@/components/CategoryFilters";
import { samplePosts } from "@/data/samplePosts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const categoryVar = (cat: string) => {
  switch (cat) {
    case "Events": return "var(--cat-events)";
    case "Issues": return "var(--cat-issues)";
    case "Jobs": return "var(--cat-jobs)";
    case "Good Deeds": return "var(--cat-good)";
    case "Donations": return "var(--cat-donations)";
    default: return "var(--primary)";
  }
};

const MapFull = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [token, setToken] = useState<string>(localStorage.getItem("mapbox_public_token") || "");
  const [category, setCategory] = useState<Category>("All");

  useEffect(() => { document.title = "Local Hero – Map"; }, []);

  useEffect(() => {
    if (token) localStorage.setItem("mapbox_public_token", token);
  }, [token]);

  const posts = useMemo(() => {
    return samplePosts.filter((p) => (category === "All" || p.type === category) && p.coordinates);
  }, [category]);

  useEffect(() => {
    if (!mapContainer.current || !token) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.985664, 40.748514],
      zoom: 12,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
  }, [token]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    posts.forEach((p) => {
      const el = document.createElement("div");
      el.className = "h-4 w-4 rounded-full ring-2 ring-white shadow-soft transition-transform duration-200";
      el.style.backgroundColor = `hsl(${categoryVar(p.type)})`;

      const marker = new mapboxgl.Marker(el).setLngLat(p.coordinates as [number, number]);

      // Build popup content
      const wrap = document.createElement("div");
      wrap.className = "min-w-[220px] max-w-[260px]";
      const title = document.createElement("h4");
      title.className = "font-semibold mb-1";
      title.textContent = p.title;
      const badge = document.createElement("span");
      badge.className = "inline-block text-xs rounded-md px-2 py-0.5 mb-2";
      badge.style.backgroundColor = `hsl(${categoryVar(p.type)})`;
      badge.style.color = "white";
      badge.textContent = p.type;
      const desc = document.createElement("p");
      desc.className = "text-sm text-muted-foreground mb-2";
      desc.textContent = p.description;
      const time = document.createElement("p");
      time.className = "text-xs text-muted-foreground mb-3";
      time.textContent = p.time;
      const actions = document.createElement("div");
      actions.className = "flex flex-wrap gap-2";
      const actionLabels: Record<string, string[]> = {
        Events: ["RSVP", "Directions"],
        Issues: ["Upvote"],
        Jobs: ["Apply"],
        "Good Deeds": ["Give Kudos"],
        Donations: ["Directions"],
      };
      (actionLabels[p.type] || ["Details"]).forEach((label) => {
        const btn = document.createElement("button");
        btn.className = "px-2.5 py-1 rounded-md border bg-background text-foreground text-xs hover-scale";
        btn.textContent = label;
        btn.addEventListener("click", () => console.log(label, p.id));
        actions.appendChild(btn);
      });
      wrap.appendChild(badge);
      wrap.appendChild(title);
      wrap.appendChild(desc);
      wrap.appendChild(time);
      wrap.appendChild(actions);

      const popup = new mapboxgl.Popup({ offset: 12 }).setDOMContent(wrap);
      marker.setPopup(popup).addTo(mapRef.current!);
      markersRef.current.push(marker);

      bounds.extend(p.coordinates as [number, number]);
    });

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { padding: 60, duration: 700 });
    }
  }, [posts]);

  return (
    <div className="relative h-screen w-screen">
      <h1 className="sr-only">Local Hero – Map View</h1>

      {/* Top overlay controls */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
        <div className="pointer-events-auto inline-flex items-center gap-3">
          <Link to="/">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
          <CategoryFilters active={category} onChange={setCategory} />
        </div>

        {!token && (
          <div className="pointer-events-auto rounded-md border bg-card p-3 shadow-soft">
            <p className="text-xs text-muted-foreground mb-2">Enter Mapbox public token (stored in your browser).</p>
            <input
              className="w-[280px] rounded-md border bg-background px-3 py-2"
              placeholder="Mapbox public token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Map canvas */}
      <div ref={mapContainer} className="absolute inset-0 rounded-none" />
    </div>
  );
};

export default MapFull;
