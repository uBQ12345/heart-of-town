import TopNav from "@/components/TopNav";
import CategoryFilters, { Category } from "@/components/CategoryFilters";
import { PostCard, type Post } from "@/components/PostCard";
import CommunityInsights from "@/components/CommunityInsights";
import MapView from "@/components/MapView/MapView";
import { useEffect, useMemo, useState } from "react";

const samplePosts: Post[] = [
  {
    id: "1",
    type: "Events",
    title: "Neighborhood Clean-up Day",
    description: "Join us this Saturday to keep our streets spotless. Supplies provided!",
    location: "Maple Park",
    time: "Sat 10:00 AM",
    createdAt: new Date().toISOString(),
    coordinates: [-73.985664, 40.748514],
  },
  {
    id: "2",
    type: "Issues",
    title: "Pothole on 3rd & Pine",
    description: "Large pothole causing traffic. Please report to city services.",
    location: "3rd & Pine",
    time: "Today 8:15 AM",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    coordinates: [-73.99, 40.74],
  },
  {
    id: "3",
    type: "Jobs",
    title: "Part-time Barista Needed",
    description: "Morning shifts at Corner Cafe. Friendly team, training available.",
    location: "Corner Cafe",
    time: "Open Until Filled",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    coordinates: [-73.975, 40.752],
  },
  {
    id: "4",
    type: "Good Deeds",
    title: "Lost Cat Found",
    description: "Orange tabby found near Elm St. Contact to reunite with owner.",
    location: "Elm St",
    time: "1h ago",
    createdAt: new Date().toISOString(),
    coordinates: [-73.98, 40.746],
  },
  {
    id: "5",
    type: "Donations",
    title: "Food Drive Drop-off",
    description: "Non-perishables accepted at the community center all week.",
    location: "Community Center",
    time: "All Week",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    coordinates: [-73.97, 40.749],
  },
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Category>("All");
  const [isMapView, setIsMapView] = useState(false);

  useEffect(() => {
    document.title = "Local Hero – Hyper-local Community Hub";
  }, []);

  const posts = useMemo(() => {
    return samplePosts.filter((p) =>
      (active === "All" || p.type === active) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()))
    );
  }, [active, search]);

  return (
    <div className="min-h-screen">
      <TopNav
        search={search}
        onSearchChange={setSearch}
        isMapView={isMapView}
        onToggleView={() => setIsMapView((v) => !v)}
      />

      <main className="container py-6">
        <h1 className="sr-only">Local Hero – Hyper-local Community Hub</h1>

        {/* Filters */}
        <section className="mb-6">
          <CategoryFilters active={active} onChange={setActive} />
        </section>

        {/* Content Grid */}
        {isMapView ? (
          <section className="grid grid-cols-1 gap-6">
            <MapView posts={posts} />
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4 lg:col-span-2">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CommunityInsights posts={posts} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
