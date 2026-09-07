import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Backpack,
  Map as MapIcon,
  ScrollText,
  Swords,
  Store,
  UserRound,
  MessageSquare,
  Dumbbell,
  Shield,
  Compass,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  acceptContract,
  adminList,
  adminPatch,
  combatAction,
  dismissCombat,
  equipItem,
  getGameState,
  listChat,
  moveOperative,
  restAtEnclave,
  sendChat,
  shopBuy,
  shopSell,
  trainStat,
  usePackItem,
  type Assembled,
} from "@/lib/game/actions";
import {
  ARTS,
  BROKEN_MARKER,
  CONTRACTS,
  GEAR,
  PORTRAITS,
  SETTLEMENTS,
  combatBg,
  gearById,
  portraitSrc,
  regionAt,
  settlementById,
  threatPortraitSrc,
} from "@/lib/game/catalog";
import { GAME_SIZE, insightForNext, insightToReach, standingTitle } from "@/lib/game/formulas";
import type { ChatMessage, Direction, GameState, GameView } from "@/lib/game/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Meter } from "./meters";
import { cn } from "@/lib/utils";

function isReady(s: Assembled | null): s is GameState {
  return Boolean(s && "operative" in s);
}

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "The road refuses.";
}

export function GameApp() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [state, setState] = useState<Assembled | null>(null);
  const [view, setView] = useState<GameView>("world");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await getGameState();
      setState(next);
      setLoadErr(null);
      return next;
    } catch (e) {
      setLoadErr(errMsg(e));
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void refresh();
  }, [user, refresh]);

  useEffect(() => {
    if (isReady(state) && state.operative.action === "fighting") setView("fight");
  }, [state]);

  async function run(fn: () => Promise<Assembled>) {
    if (busy) return;
    setBusy(true);
    setFlash(null);
    try {
      const next = await fn();
      setState(next);
    } catch (e) {
      setFlash(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ink text-muted-foreground">
        <p className="font-display tracking-widest">Opening the veil…</p>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (loadErr === "Unauthorized") return <RedirectToSignIn />;
  if (state && "needsCreate" in state) {
    void navigate({ to: "/create" });
    return null;
  }
  if (!isReady(state)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ink">
        <p className="text-muted-foreground">{loadErr ?? "Binding Essence…"}</p>
      </div>
    );
  }

  const g = state;
  const op = g.operative;
  const fighting = op.action === "fighting" && op.combat && !op.combat.won;

  const nav: { id: GameView; label: string; icon: typeof MapIcon; hide?: boolean }[] = [
    { id: "world", label: "World Map", icon: MapIcon },
    { id: "fight", label: "Challenge", icon: Swords, hide: !(op.combat || fighting) },
    { id: "pack", label: "Pack", icon: Backpack },
    { id: "shop", label: "Stall", icon: Store, hide: op.locationKind !== "settlement" },
    { id: "contracts", label: "Contracts", icon: ScrollText },
    { id: "discipline", label: "Discipline", icon: Dumbbell, hide: op.locationKind !== "settlement" },
    { id: "record", label: "Operative Record", icon: UserRound },
    { id: "chat", label: "Channels", icon: MessageSquare },
    { id: "admin", label: "Warden Desk", icon: Shield, hide: op.role !== "warden" },
  ];

  return (
    <div className="min-h-dvh bg-ink text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2">
          <Compass className="size-5 text-crimson" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm tracking-[0.2em] text-bone">SHADOW SHINOBI</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {op.name} · {standingTitle(op.standing)} · {g.placeName}
            </p>
          </div>
          <span className="hidden tabular-nums text-xs text-muted-foreground sm:inline">
            {op.coin} Coin
          </span>
          <UserButton />
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-3 pb-2">
          <Meter label="Health" value={op.health} max={op.maxHealth} tone="health" />
          <Meter label="Essence" value={op.essence} max={op.maxEssence} tone="essence" />
          <Meter
            label="Insight"
            value={op.insight - insightToReach(op.standing)}
            max={Math.max(1, insightForNext(op.standing) - insightToReach(op.standing))}
            tone="insight"
          />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-3 p-3 pb-24 md:pb-6">
        <nav className="hidden w-52 shrink-0 flex-col gap-1 md:flex">
          {nav
            .filter((n) => !n.hide)
            .map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setView(n.id)}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-left text-sm",
                  view === n.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <n.icon className="size-4" />
                {n.label}
              </button>
            ))}
        </nav>

        <main className="min-w-0 flex-1">
          {flash ? (
            <p className="mb-3 rounded-md border border-crimson/40 bg-crimson/10 px-3 py-2 text-sm text-bone">
              {flash}
            </p>
          ) : null}
          {view === "world" ? (
            <WorldView g={g} busy={busy} onMove={(dir) => run(() => moveOperative({ data: { dir } }))} onRest={() => run(() => restAtEnclave())} />
          ) : null}
          {view === "fight" ? <CombatView g={g} busy={busy} run={run} /> : null}
          {view === "pack" ? <PackView g={g} busy={busy} run={run} /> : null}
          {view === "shop" ? <ShopView g={g} busy={busy} run={run} /> : null}
          {view === "contracts" ? <ContractsView g={g} busy={busy} run={run} /> : null}
          {view === "record" ? <RecordView g={g} /> : null}
          {view === "discipline" ? <DisciplineView g={g} busy={busy} run={run} /> : null}
          {view === "chat" ? <ChatView g={g} /> : null}
          {view === "admin" ? <AdminView /> : null}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-ink/95 md:hidden">
        {nav
          .filter((n) => ["world", "fight", "pack", "contracts", "record"].includes(n.id) && !n.hide)
          .map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setView(n.id)}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-wide",
                view === n.id ? "text-crimson" : "text-muted-foreground",
              )}
            >
              <n.icon className="size-4" />
              {n.label.split(" ")[0]}
            </button>
          ))}
      </nav>
    </div>
  );
}

function WorldView({
  g,
  busy,
  onMove,
  onRest,
}: {
  g: GameState;
  busy: boolean;
  onMove: (d: Direction) => void;
  onRest: () => void;
}) {
  const op = g.operative;
  const x = ((op.lng + GAME_SIZE) / (GAME_SIZE * 2)) * 100;
  const y = ((GAME_SIZE - op.lat) / (GAME_SIZE * 2)) * 100;
  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="ss-panel relative overflow-hidden rounded-xl">
        <img src="/art/world-map.jpg" alt="World Map" className="aspect-[16/10] w-full object-cover" />
        <div className="absolute inset-0">
          {SETTLEMENTS.map((s) => {
            const sx = ((s.lng + GAME_SIZE) / (GAME_SIZE * 2)) * 100;
            const sy = ((GAME_SIZE - s.lat) / (GAME_SIZE * 2)) * 100;
            return (
              <span
                key={s.id}
                title={s.name}
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone ring-2 ring-crimson/80"
                style={{ left: `${sx}%`, top: `${sy}%` }}
              />
            );
          })}
          <span
            title="Broken Marker"
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-crimson"
            style={{
              left: `${((BROKEN_MARKER.lng + GAME_SIZE) / (GAME_SIZE * 2)) * 100}%`,
              top: `${((GAME_SIZE - BROKEN_MARKER.lat) / (GAME_SIZE * 2)) * 100}%`,
            }}
          />
          <span
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson shadow-[0_0_12px_#c41e3a]"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        </div>
      </div>
      <div className="ss-panel rounded-xl p-4">
        <Badge>{g.placeName}</Badge>
        <h2 className="mt-2 font-display text-2xl">{g.settlement ? g.settlement.name : "The Road"}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {g.settlement
            ? g.settlement.blurb
            : `Wild ground. Region ${regionAt(op.lat, op.lng)}. One step in four draws a Threat.`}
        </p>
        <p className="mt-2 text-xs tabular-nums text-muted-foreground">
          {op.lat}, {op.lng}
        </p>
        {g.settlement ? (
          <p className="mt-2 text-sm text-bone">Warden: {g.settlement.warden}</p>
        ) : null}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div />
          <Button variant="secondary" disabled={busy || op.action === "fighting"} onClick={() => onMove("north")}>
            <ChevronUp className="size-4" /> North
          </Button>
          <div />
          <Button variant="secondary" disabled={busy || op.action === "fighting"} onClick={() => onMove("west")}>
            <ChevronLeft className="size-4" /> West
          </Button>
          <Button variant="outline" disabled>
            Step
          </Button>
          <Button variant="secondary" disabled={busy || op.action === "fighting"} onClick={() => onMove("east")}>
            East <ChevronRight className="size-4" />
          </Button>
          <div />
          <Button variant="secondary" disabled={busy || op.action === "fighting"} onClick={() => onMove("south")}>
            <ChevronDown className="size-4" /> South
          </Button>
        </div>
        {g.settlement ? (
          <Button className="mt-4 w-full" disabled={busy} onClick={onRest}>
            Rest (8 Coin)
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function CombatView({
  g,
  busy,
  run,
}: {
  g: GameState;
  busy: boolean;
  run: (fn: () => Promise<Assembled>) => Promise<void>;
}) {
  const op = g.operative;
  const c = op.combat;
  if (!c) {
    return (
      <div className="ss-panel rounded-xl p-6 text-muted-foreground">
        No Challenge. Walk the World Map — one step in four draws a Threat.
      </div>
    );
  }
  const bg = combatBg(c.region);
  const arts = ARTS.filter((a) => a.minStanding <= op.standing);
  const salves = g.pack.filter((p) => gearById(p.itemId)?.kind === "consumable");
  return (
    <div className="ss-panel overflow-hidden rounded-xl">
      <div className="relative aspect-[16/9] max-h-[280px] overflow-hidden md:max-h-[340px]">
        <img src={bg} alt="" className="size-full object-cover" />
        <div className="ss-scan absolute inset-0" />
        <div className="absolute inset-0 flex items-end justify-between gap-3 p-3">
          <PortraitCard
            src={portraitSrc(op.portrait)}
            name={op.name}
            hp={op.health}
            max={op.maxHealth}
            sub={`${standingTitle(op.standing)}`}
          />
          <PortraitCard
            src={threatPortraitSrc(c.portrait)}
            name={c.name}
            hp={c.health}
            max={c.maxHealth}
            sub={c.boss ? "Herald" : "Threat"}
            invert
          />
        </div>
      </div>
      <div className="grid gap-3 p-3 md:grid-cols-[1fr_16rem]">
        <ul className="max-h-40 space-y-1 overflow-auto text-sm leading-relaxed">
          {c.log.map((line, i) => (
            <li key={`${i}-${line}`} className="text-bone/90">
              {line}
            </li>
          ))}
        </ul>
        {c.won ? (
          <Button onClick={() => run(() => dismissCombat())}>Continue</Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button disabled={busy} onClick={() => run(() => combatAction({ data: { action: "attack" } }))}>
              Attack
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => run(() => combatAction({ data: { action: "defend" } }))}>
              Defend
            </Button>
            {arts.map((a) => (
              <Button
                key={a.id}
                variant="outline"
                disabled={busy || op.essence < a.essenceCost}
                onClick={() => run(() => combatAction({ data: { action: "art", artId: a.id } }))}
              >
                {a.name} ({a.essenceCost})
              </Button>
            ))}
            {salves.map((p) => (
              <Button
                key={p.itemId}
                variant="ghost"
                disabled={busy}
                onClick={() => run(() => combatAction({ data: { action: "item", itemId: p.itemId } }))}
              >
                Use {gearById(p.itemId)?.name}
              </Button>
            ))}
            <Button variant="secondary" disabled={busy || c.boss} onClick={() => run(() => combatAction({ data: { action: "flee" } }))}>
              Flee
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PortraitCard({
  src,
  name,
  hp,
  max,
  sub,
  invert,
}: {
  src: string;
  name: string;
  hp: number;
  max: number;
  sub: string;
  invert?: boolean;
}) {
  return (
    <div className={cn("w-[42%] max-w-40", invert && "text-right")}>
      <img src={src} alt={name} className="aspect-[2/3] w-full rounded-lg object-cover ring-1 ring-border" />
      <p className="mt-1 truncate font-display text-sm">{name}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
      <Meter label="Health" value={hp} max={max} tone="health" />
    </div>
  );
}

function PackView({
  g,
  busy,
  run,
}: {
  g: GameState;
  busy: boolean;
  run: (fn: () => Promise<Assembled>) => Promise<void>;
}) {
  return (
    <div className="ss-panel rounded-xl p-4">
      <h2 className="font-display text-2xl">Pack</h2>
      <p className="mt-1 text-sm text-muted-foreground">Gear on the body. Recoveries in the fold.</p>
      <ul className="mt-4 divide-y divide-border">
        {g.pack.length === 0 ? <li className="py-6 text-muted-foreground">Empty.</li> : null}
        {g.pack.map((p) => {
          const item = gearById(p.itemId);
          if (!item) return null;
          const slot = item.kind === "weapon" || item.kind === "armor" || item.kind === "accessory" ? item.kind : null;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-2 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {item.name} {p.qty > 1 ? <span className="text-muted-foreground">×{p.qty}</span> : null}
                </p>
                <p className="text-xs text-muted-foreground">{item.blurb}</p>
              </div>
              {p.equipped ? <Badge>Equipped · {p.equipped}</Badge> : null}
              {slot ? (
                p.equipped ? (
                  <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => equipItem({ data: { itemId: p.itemId, slot: null } }))}>
                    Unequip
                  </Button>
                ) : (
                  <Button size="sm" disabled={busy} onClick={() => run(() => equipItem({ data: { itemId: p.itemId, slot } }))}>
                    Equip
                  </Button>
                )
              ) : null}
              {item.kind === "consumable" ? (
                <Button size="sm" variant="secondary" disabled={busy} onClick={() => run(() => usePackItem({ data: { itemId: p.itemId } }))}>
                  Use
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ShopView({
  g,
  busy,
  run,
}: {
  g: GameState;
  busy: boolean;
  run: (fn: () => Promise<Assembled>) => Promise<void>;
}) {
  if (!g.settlement) {
    return <div className="ss-panel rounded-xl p-6 text-muted-foreground">Stalls live in Settlements.</div>;
  }
  const stock = g.settlement.shop.map((id) => gearById(id)).filter(Boolean);
  return (
    <div className="ss-panel rounded-xl p-4">
      <h2 className="font-display text-2xl">{g.settlement.name} Stall</h2>
      <p className="text-sm text-muted-foreground">You carry {g.operative.coin} Coin.</p>
      <ul className="mt-4 divide-y divide-border">
        {stock.map((item) =>
          item ? (
            <li key={item.id} className="flex flex-wrap items-center gap-2 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.blurb}</p>
              </div>
              <span className="tabular-nums text-sm">{item.price}c</span>
              <Button size="sm" disabled={busy} onClick={() => run(() => shopBuy({ data: { itemId: item.id } }))}>
                Buy
              </Button>
            </li>
          ) : null,
        )}
      </ul>
      <h3 className="mt-6 font-display text-lg">Sell from Pack</h3>
      <ul className="mt-2 divide-y divide-border">
        {g.pack
          .filter((p) => {
            const it = gearById(p.itemId);
            return it && it.kind !== "key" && !p.equipped;
          })
          .map((p) => {
            const it = gearById(p.itemId)!;
            return (
              <li key={p.id} className="flex items-center gap-2 py-2">
                <span className="flex-1 text-sm">{it.name}</span>
                <span className="text-xs text-muted-foreground">{Math.floor(it.price / 2)}c</span>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => shopSell({ data: { itemId: p.itemId } }))}>
                  Sell
                </Button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function ContractsView({
  g,
  busy,
  run,
}: {
  g: GameState;
  busy: boolean;
  run: (fn: () => Promise<Assembled>) => Promise<void>;
}) {
  return (
    <div className="space-y-3">
      <div className="ss-panel rounded-xl p-4">
        <h2 className="font-display text-2xl">The Broken Marker</h2>
        <p className="mt-1 text-sm text-muted-foreground">Starter arc. Five Contracts. English only. Yours.</p>
      </div>
      {CONTRACTS.map((c) => {
        const row = g.contracts.find((r) => r.contractId === c.id);
        const status = row?.status ?? "locked";
        return (
          <article key={c.id} className="ss-panel rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{status}</Badge>
              <h3 className="font-display text-lg">
                {c.index}. {c.name}
              </h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
            <p className="mt-2 text-sm text-bone">{c.objective}</p>
            {status === "active" && c.id === "c2-shadows-on-the-road" ? (
              <p className="mt-1 text-xs text-muted-foreground">Progress {row?.progress ?? 0}/3</p>
            ) : null}
            {status === "available" || status === "active" ? (
              <Button className="mt-3" disabled={busy || status === "active"} onClick={() => run(() => acceptContract({ data: { contractId: c.id } }))}>
                {status === "active" ? "Accepted" : "Accept Contract"}
              </Button>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function RecordView({ g }: { g: GameState }) {
  const op = g.operative;
  const p = PORTRAITS.find((x) => x.id === op.portrait);
  return (
    <div className="ss-panel grid gap-4 rounded-xl p-4 md:grid-cols-[12rem_1fr]">
      <img src={p?.src ?? portraitSrc(op.portrait)} alt="" className="aspect-[2/3] w-full rounded-lg object-cover" />
      <div>
        <Badge>{settlementById(op.enclave).name}</Badge>
        <h2 className="mt-2 font-display text-3xl">{op.name}</h2>
        <p className="text-muted-foreground">
          {standingTitle(op.standing)} · Standing {op.standing}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Stat k="Strength" v={op.strength} />
          <Stat k="Speed" v={op.speed} />
          <Stat k="Essence Power" v={op.essencePower} />
          <Stat k="Defense" v={op.defense} />
          <Stat k="Coin" v={op.coin} />
          <Stat k="Threats down" v={op.kills} />
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Independent Operative of {settlementById(op.enclave).name}. The Veiling took the old roads.
          You walk what is left.
        </p>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div className="rounded-md border border-border bg-secondary px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</p>
      <p className="font-display text-xl tabular-nums">{v}</p>
    </div>
  );
}

function DisciplineView({
  g,
  busy,
  run,
}: {
  g: GameState;
  busy: boolean;
  run: (fn: () => Promise<Assembled>) => Promise<void>;
}) {
  const cost = 20 + g.operative.standing * 10;
  const stats = ["strength", "speed", "essencePower", "defense"] as const;
  const labels = { strength: "Strength", speed: "Speed", essencePower: "Essence Power", defense: "Defense" };
  return (
    <div className="ss-panel rounded-xl p-4">
      <h2 className="font-display text-2xl">Develop Discipline</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Free points from Standing: {g.operative.statPoints}. Otherwise {cost} Coin a lesson.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {stats.map((s) => (
          <Button
            key={s}
            variant="secondary"
            disabled={busy}
            onClick={() => run(() => trainStat({ data: { stat: s } }))}
          >
            Train {labels[s]} ({g.operative[s]})
          </Button>
        ))}
      </div>
    </div>
  );
}

function ChatView({ g }: { g: GameState }) {
  const [channel, setChannel] = useState<"open" | "local">("open");
  const [lines, setLines] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const place = channel === "open" ? "Open Channel" : g.placeName;

  const load = useCallback(async () => {
    const rows = await listChat({ data: { channel } });
    setLines(rows);
  }, [channel]);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 4000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <div className="ss-panel flex h-[28rem] flex-col rounded-xl p-4">
      <div className="flex gap-2">
        <Button size="sm" variant={channel === "open" ? "default" : "outline"} onClick={() => setChannel("open")}>
          Open Channel
        </Button>
        <Button size="sm" variant={channel === "local" ? "default" : "outline"} onClick={() => setChannel("local")}>
          Local Channel
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{place}</p>
      <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-auto text-sm">
        {lines.map((m) => (
          <li key={m.id}>
            <span className="font-medium text-bone">{m.name}: </span>
            <span className="text-muted-foreground">{m.body}</span>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const body = text.trim();
          if (!body) return;
          setText("");
          void sendChat({ data: { channel, body } }).then(setLines).catch(() => undefined);
        }}
      >
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Speak…" maxLength={240} />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

function AdminView() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminList>> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    adminList()
      .then(setData)
      .catch((e) => setErr(errMsg(e)));
  }, []);
  if (err) return <div className="ss-panel rounded-xl p-4 text-sm text-crimson">{err}</div>;
  if (!data) return <div className="ss-panel rounded-xl p-4 text-muted-foreground">Loading desk…</div>;
  return (
    <div className="space-y-3">
      <div className="ss-panel rounded-xl p-4">
        <h2 className="font-display text-2xl">Warden Desk</h2>
        <p className="text-sm text-muted-foreground">First Operative on this world is Warden. Manage players, hand Gear, clear fights.</p>
      </div>
      {data.players.map((p) => (
        <div key={p.id} className="ss-panel flex flex-wrap items-center gap-2 rounded-xl p-3">
          <div className="min-w-0 flex-1">
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">
              {p.enclave} · Standing {p.standing} · {p.coin}c · {p.action}
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              adminPatch({ data: { userId: p.userId, coin: p.coin + 50 } }).then(setData)
            }
          >
            +50 Coin
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => adminPatch({ data: { userId: p.userId, clearFight: true } }).then(setData)}
          >
            Clear fight
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => adminPatch({ data: { userId: p.userId, giveItem: "field-salve" } }).then(setData)}
          >
            Give salve
          </Button>
        </div>
      ))}
      <div className="ss-panel rounded-xl p-4">
        <h3 className="font-display text-lg">Catalog</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {data.threats.length} Threats · {data.gear.length} Gear · {data.contracts.length} Contracts
        </p>
      </div>
    </div>
  );
}
