/**
 * High-Stakes Challenge — TypeScript types
 * Canonical vocabulary only.
 */

export type ChallengeTier = 'low' | 'medium' | 'high' | 'extreme';

export type ChallengeStatus =
  | 'open'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired';

export type ProtectionType = 'temporary' | 'permanent';

export interface EntryCost {
  coin?: number;
  materials?: Record<string, number>;
  challengeToken?: number;
}

export interface Challenge {
  id: string;                       // CHL-####
  challengerId: string;
  opponentId: string | null;
  tier: ChallengeTier;
  status: ChallengeStatus;
  entryCost: EntryCost;
  stealChance: number;              // 0–1
  winnerId: string | null;
  createdAt: string;
  acceptedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ChallengeStake {
  id: string;
  challengeId: string;
  playerId: string;
  itemId: string;
  slot: string | null;              // equipped slot or 'inventory'
  isProtected: boolean;
  wasStolen: boolean;
}

export interface ChallengeLog {
  id: string;
  challengeId: string;
  eventType: string;
  actorId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface ItemProtection {
  id: string;
  itemId: string;
  playerId: string;
  protectionType: ProtectionType;
  expiresAt: string | null;
  createdAt: string;
}

/** Risk tier configuration (data-driven) */
export interface TierConfig {
  tier: ChallengeTier;
  label: string;
  entryCost: EntryCost;
  stealChance: number;
  minStanding: number;
  dailyLimit?: number;
  colour: string;                   // UI accent
}

export const TIER_CONFIGS: Record<ChallengeTier, TierConfig> = {
  low: {
    tier: 'low',
    label: 'Low Risk',
    entryCost: { coin: 100 },
    stealChance: 0,
    minStanding: 1,
    colour: 'slate',
  },
  medium: {
    tier: 'medium',
    label: 'Medium Risk',
    entryCost: { coin: 500, materials: { 'shadow-shard': 2 } },
    stealChance: 0.08,
    minStanding: 10,
    colour: 'amber',
  },
  high: {
    tier: 'high',
    label: 'High Risk',
    entryCost: { coin: 2000, materials: { 'void-crystal': 1 } },
    stealChance: 0.20,
    minStanding: 25,
    colour: 'orange',
  },
  extreme: {
    tier: 'extreme',
    label: 'Extreme Risk',
    entryCost: { coin: 5000, challengeToken: 1 },
    stealChance: 0.40,
    minStanding: 40,
    dailyLimit: 3,
    colour: 'rose',
  },
};
