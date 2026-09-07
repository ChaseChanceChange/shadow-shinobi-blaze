import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { SignInGate } from "@/lib/auth/gates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative grid min-h-dvh place-items-center bg-ink px-4 py-10 text-bone">
      <img src="/art/title.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-ink/70" />
      <SignInGate fallback={<AuthCard />}>
        <AlreadyIn />
      </SignInGate>
    </main>
  );
}

function AlreadyIn() {
  const navigate = useNavigate();
  return (
    <div className="relative ss-panel w-full max-w-sm rounded-xl p-6">
      <p className="font-display text-2xl">You are already inside.</p>
      <Button className="mt-4 w-full" onClick={() => navigate({ to: "/play" })}>
        Continue
      </Button>
    </div>
  );
}

function AuthCard() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!authEnabled) return;
    setBusy(true);
    setErr(null);
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0] || "Operative",
          callbackURL: "/play",
        });
        if (error) throw new Error(error.message ?? "Sign-up failed");
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/play",
        });
        if (error) throw new Error(error.message ?? "Sign-in failed");
      }
      await authClient.getSession();
      void navigate({ to: "/play" });
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative ss-panel w-full max-w-sm rounded-xl p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">ChaseCraft</p>
      <h1 className="mt-2 font-display text-3xl">Shadow Shinobi</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to bind an Operative to this world.</p>

      {authEnabled ? (
        <>
          <div className="mt-5 space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/play" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
          <p className="my-4 text-center text-xs uppercase tracking-widest text-muted-foreground">or email</p>
          <form className="space-y-3" onSubmit={onEmail}>
            {mode === "up" ? (
              <Input
                placeholder="Callsign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="nickname"
              />
            ) : null}
            <Input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              type="password"
              required
              minLength={8}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
            {err ? <p className="text-sm text-crimson">{err}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {mode === "up" ? "Register" : "Sign in"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-bone"
            onClick={() => setMode(mode === "up" ? "in" : "up")}
          >
            {mode === "up" ? "Have a seal already? Sign in" : "New here? Register"}
          </button>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Sign-in is disabled.</p>
      )}
      <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground">
        Back
      </Link>
    </div>
  );
}
