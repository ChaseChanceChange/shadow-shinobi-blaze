import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createOperative } from "@/lib/game/actions";
import { PORTRAITS, SETTLEMENTS } from "@/lib/game/catalog";
import { BASE_STAT, CREATE_BONUS } from "@/lib/game/formulas";
import type { EnclaveId, PortraitId } from "@/lib/game/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create")({ component: Create });

function Create() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [enclave, setEnclave] = useState<EnclaveId>("blackleaf");
  const [portrait, setPortrait] = useState<PortraitId>("shade");
  const [bonus, setBonus] = useState({ strength: 2, speed: 2, essencePower: 2, defense: 2 });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const spent = bonus.strength + bonus.speed + bonus.essencePower + bonus.defense;
  const left = CREATE_BONUS - spent;

  const stats = useMemo(
    () =>
      [
        ["strength", "Strength"],
        ["speed", "Speed"],
        ["essencePower", "Essence Power"],
        ["defense", "Defense"],
      ] as const,
    [],
  );

  if (isPending) {
    return <div className="grid min-h-dvh place-items-center bg-ink text-muted-foreground">Loading…</div>;
  }
  if (!user) return <RedirectToSignIn />;

  function bump(key: keyof typeof bonus, delta: number) {
    setBonus((b) => {
      const next = b[key] + delta;
      if (next < 0 || next > 8) return b;
      if (delta > 0 && CREATE_BONUS - (b.strength + b.speed + b.essencePower + b.defense) <= 0) return b;
      return { ...b, [key]: next };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await createOperative({
        data: { name, enclave, portrait, ...bonus },
      });
      if (res && "needsCreate" in res) throw new Error("Could not bind Operative.");
      void navigate({ to: "/play" });
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-ink px-4 py-10 text-bone">
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Operative Record</p>
        <h1 className="font-display text-4xl">Bind a name to the road</h1>
        <Input
          required
          minLength={2}
          maxLength={24}
          placeholder="Operative name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <h2 className="font-display text-xl">Enclave</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SETTLEMENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setEnclave(s.id)}
              className={cn(
                "rounded-xl border p-4 text-left",
                enclave === s.id ? "border-crimson bg-card" : "border-border bg-secondary/40",
              )}
            >
              <p className="font-display text-lg">{s.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
            </button>
          ))}
        </div>

        <h2 className="font-display text-xl">Face</h2>
        <div className="grid grid-cols-3 gap-3">
          {PORTRAITS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPortrait(p.id)}
              className={cn("overflow-hidden rounded-xl border", portrait === p.id ? "border-crimson" : "border-border")}
            >
              <img src={p.src} alt={p.name} className="aspect-[2/3] w-full object-cover" />
              <p className="px-2 py-2 text-xs">{p.name}</p>
            </button>
          ))}
        </div>

        <h2 className="font-display text-xl">Discipline — {left} points left</h2>
        <p className="text-sm text-muted-foreground">Each column starts at {BASE_STAT}. Spend {CREATE_BONUS}.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
              <span>
                {label}
                <span className="ml-2 tabular-nums text-muted-foreground">{BASE_STAT + bonus[key]}</span>
              </span>
              <span className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => bump(key, -1)}>
                  −
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => bump(key, 1)}>
                  +
                </Button>
              </span>
            </div>
          ))}
        </div>

        {err ? <p className="text-sm text-crimson">{err}</p> : null}
        <Button type="submit" className="w-full" disabled={busy || left !== 0 || name.trim().length < 2}>
          Take the Oath
        </Button>
      </form>
    </main>
  );
}
