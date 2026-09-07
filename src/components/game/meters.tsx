import { cn } from "@/lib/utils";

export function Meter({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "health" | "essence" | "insight";
}) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    tone === "health" ? "bg-crimson" : tone === "essence" ? "bg-essence" : "bg-bone/80";
  return (
    <div className="min-w-0">
      <div className="mb-1 flex justify-between gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-bone">
          {value}/{max}
        </span>
      </div>
      <div className="ss-meter">
        <div className={cn("h-full rounded-full", fill)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
