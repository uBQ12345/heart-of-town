import TopNav from "@/components/TopNav";
import CategoryFilters, { Category } from "@/components/CategoryFilters";
import { PostCard, type Post } from "@/components/PostCard";
import CommunityInsights from "@/components/CommunityInsights";
import MapView from "@/components/MapView/MapView";
import { useEffect, useMemo, useState } from "react";
import { samplePosts } from "@/data/samplePosts";



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
