import { Button } from "@/components/ui/button";
import { CalendarCheck, AlertTriangle, Briefcase, HandHeart, Gift } from "lucide-react";

export type Category = "All" | "Events" | "Issues" | "Jobs" | "Good Deeds" | "Donations";

interface CategoryFiltersProps {
  active: Category;
  onChange: (cat: Category) => void;
}

const items: { key: Category; label: string; icon: React.ElementType }[] = [
  { key: "All", label: "All", icon: CalendarCheck },
  { key: "Events", label: "Events", icon: CalendarCheck },
  { key: "Issues", label: "Issues", icon: AlertTriangle },
  { key: "Jobs", label: "Jobs", icon: Briefcase },
  { key: "Good Deeds", label: "Good Deeds", icon: HandHeart },
  { key: "Donations", label: "Donations", icon: Gift },
];

const CategoryFilters = ({ active, onChange }: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant={active === key ? "default" : "secondary"}
          className="gap-2 hover-scale"
          onClick={() => onChange(key)}
          aria-pressed={active === key}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilters;
