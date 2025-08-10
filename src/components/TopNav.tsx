import { Input } from "@/components/ui/input";
import { HandHeart, Search, Map, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopNavProps {
  search: string;
  onSearchChange: (v: string) => void;
  isMapView: boolean;
  onToggleView: () => void;
}

const TopNav = ({ search, onSearchChange, isMapView, onToggleView }: TopNavProps) => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-primary shadow-glow grid place-items-center">
            <HandHeart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Local Hero</span>
        </a>

        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search events, issues, jobs..."
              className="pl-9"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleView}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            aria-pressed={isMapView}
            aria-label="Toggle map view"
          >
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">{isMapView ? "Feed" : "Map"} view</span>
          </button>
          <Avatar>
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;
