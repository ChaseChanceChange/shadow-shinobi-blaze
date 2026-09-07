import { createFileRoute, Link } from "@tanstack/react-router";
import { SignInGate, SignedIn, SignedOut } from "@/lib/auth/gates";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink text-bone">
      <img
        src="/art/title.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover object-[center_20%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col justify-end px-6 pb-16 pt-24">
        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          ChaseCraft presents
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">Shadow Shinobi</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-bone/80 md:text-lg">
          After the Veiling, the old roads forgot their names. Independent Operatives walk for the
          Enclaves — Blackleaf, Spirit Mountain, Stonecrest, Mistveil, Red Dune. Channel Essence.
          Honor Contracts. Keep the Marker from splitting further.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SignInGate
            fallback={
              <Button asChild>
                <Link to="/login">Enter the Veil</Link>
              </Button>
            }
          >
            <Button asChild>
              <Link to="/play">Continue</Link>
            </Button>
          </SignInGate>
          <SignedOut>
            <Button variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button variant="outline" asChild>
              <Link to="/create">New Operative</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </main>
  );
}
