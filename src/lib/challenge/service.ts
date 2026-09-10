/**
 * High-Stakes Challenge — Server-side service skeleton
 * All gameplay decisions are server-authoritative.
 */

import {
  Challenge,
  ChallengeTier,
  ChallengeStatus,
  EntryCost,
  TIER_CONFIGS,
  ChallengeStake,
} from './types';

/** Generate a stable Challenge ID */
export function createChallengeId(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `CHL-${String(num).padStart(4, '0')}`;
}

/** Get tier configuration */
export function getTierConfig(tier: ChallengeTier) {
  return TIER_CONFIGS[tier];
}

/** Validate that a player meets the Standing requirement for a tier */
export function canEnterTier(playerStanding: number, tier: ChallengeTier): boolean {
  return playerStanding >= TIER_CONFIGS[tier].minStanding;
}

/** Calculate final steal chance (can be modified by future buffs/debuffs) */
export function resolveStealChance(tier: ChallengeTier): number {
  return TIER_CONFIGS[tier].stealChance;
}

/**
 * Server-side resolution of an Extreme Challenge item steal.
 * Returns the itemId that was stolen, or null if the roll failed or no valid targets.
 */
export function resolveItemSteal(
  stakes: ChallengeStake[],
  winnerId: string,
  loserId: string,
  stealChance: number
): string | null {
  // Only unprotected items belonging to the loser are eligible
  const eligible = stakes.filter(
    (s) => s.playerId === loserId && !s.isProtected && !s.wasStolen
  );

  if (eligible.length === 0) return null;

  // Server RNG — never trust client
  const roll = Math.random();
  if (roll > stealChance) return null;

  // Pick one random eligible item
  const stolen = eligible[Math.floor(Math.random() * eligible.length)];
  return stolen.itemId;
}

/** Placeholder: create a new open Challenge */
export async function createChallenge(params: {
  challengerId: string;
  tier: ChallengeTier;
  entryCost: EntryCost;
}): Promise<Challenge> {
  const config = getTierConfig(params.tier);

  const challenge: Challenge = {
    id: createChallengeId(),
    challengerId: params.challengerId,
    opponentId: null,
    tier: params.tier,
    status: 'open',
    entryCost: params.entryCost ?? config.entryCost,
    stealChance: config.stealChance,
    winnerId: null,
    createdAt: new Date().toISOString(),
    acceptedAt: null,
    startedAt: null,
    completedAt: null,
  };

  // TODO: persist to database, deduct entry cost, write challenge_log
  return challenge;
}

/** Placeholder: accept an open Challenge */
export async function acceptChallenge(
  challengeId: string,
  opponentId: string
): Promise<Challenge> {
  // TODO: load challenge, validate status === 'open', set opponent, status = 'accepted'
  // TODO: deduct opponent entry cost, write log
  throw new Error('acceptChallenge not yet implemented — database layer pending');
}

/** Placeholder: both players confirmed → start combat */
export async function startChallenge(challengeId: string): Promise<void> {
  // TODO: status = 'in_progress', startedAt = now, hand off to combat engine
  throw new Error('startChallenge not yet implemented');
}

/** Placeholder: combat finished → resolve loot + possible item steal */
export async function resolveChallenge(
  challengeId: string,
  winnerId: string,
  loserId: string
): Promise<{ stolenItemId: string | null }> {
  // TODO:
  // 1. Load challenge + stakes
  // 2. Award normal loot to winner
  // 3. If extreme tier, run resolveItemSteal
  // 4. Transfer item if stolen
  // 5. Write full logs
  // 6. status = 'completed'
  throw new Error('resolveChallenge not yet implemented');
}
