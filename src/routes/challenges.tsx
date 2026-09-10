/**
 * Challenge Board — basic UI scaffold
 * Route: /challenges
 */

import { createFileRoute } from '@tanstack/react-router';
import { TIER_CONFIGS, ChallengeTier } from '../lib/challenge/types';

export const Route = createFileRoute('/challenges')({
  component: ChallengeBoardPage,
});

function ChallengeBoardPage() {
  const tiers = Object.values(TIER_CONFIGS);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Challenge Board</h1>
        <p className="text-zinc-400 mt-1">
          High-stakes realtime battles. Risk your gear for greater rewards.
        </p>
      </header>

      {/* Tier overview */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Risk Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <TierCard key={tier.tier} tier={tier.tier} />
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="flex flex-wrap gap-4 mb-10">
        <button className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 rounded-lg font-medium transition">
          Create Challenge
        </button>
        <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition">
          View Open Challenges
        </button>
        <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition">
          My Challenge History
        </button>
      </section>

      {/* Placeholder open challenges list */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Open Challenges</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-500 text-center">
          No open Challenges yet. Be the first to post one.
        </div>
      </section>
    </div>
  );
}

function TierCard({ tier }: { tier: ChallengeTier }) {
  const config = TIER_CONFIGS[tier];
  const colourMap: Record<string, string> = {
    slate: 'border-zinc-600 bg-zinc-900',
    amber: 'border-amber-700/60 bg-amber-950/40',
    orange: 'border-orange-700/60 bg-orange-950/40',
    rose: 'border-rose-700/60 bg-rose-950/40',
  };

  return (
    <div className={`rounded-xl border p-4 ${colourMap[config.colour] ?? colourMap.slate}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{config.label}</span>
        {tier === 'extreme' && (
          <span className="text-xs bg-rose-800 text-rose-100 px-2 py-0.5 rounded">ITEM STEAL</span>
        )}
      </div>
      <p className="text-sm text-zinc-400 mb-1">
        Steal chance: {(config.stealChance * 100).toFixed(0)}%
      </p>
      <p className="text-sm text-zinc-400">
        Min Standing: {config.minStanding}
      </p>
      {config.dailyLimit && (
        <p className="text-xs text-zinc-500 mt-1">Daily limit: {config.dailyLimit}</p>
      )}
    </div>
  );
}
