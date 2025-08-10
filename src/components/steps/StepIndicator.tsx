import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: { id: number; label: string }[];
  current: number;
}

const StepIndicator = ({ steps, current }: StepIndicatorProps) => {
  const pct = ((current - 1) / (steps.length - 1)) * 100;
  return (
    <div className="mb-4">
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-3 grid grid-cols-3 gap-2 text-sm text-muted-foreground">
        {steps.map((s) => (
          <li
            key={s.id}
            className={cn(
              "flex items-center gap-2",
              current === s.id && "text-foreground font-medium"
            )}
          >
            <span
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full border",
                current >= s.id ? "bg-primary text-primary-foreground border-primary" : "bg-background"
              )}
              aria-hidden
            >
              {s.id}
            </span>
            <span>{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default StepIndicator;
