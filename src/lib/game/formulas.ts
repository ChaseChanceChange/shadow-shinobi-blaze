/**
 * Shadow Shinobi combat & growth formulas.
 *
 * These follow the original Dragon Knight / Naruto-browser-MMORPG engine:
 *   - Exploring has a 1-in-4 chance to start a fight (explore.php).
 *   - Insight to reach Standing n is 15 * n * (n-1) / 2
 *     (the help file said Standing 2 needs 15, Standing 3 needs 45).
 *   - Damage is a random roll between half-power and full-power, minus half
 *     the defender's Defense. Always at least 1 if the hit lands.
 *
 * We re-skinned names (Standing / Insight / Essence) but did NOT retune
 * the curve — Chase asked to keep the old balance.
 */

import type { CombatState, Operative, Threat } from "./types";

/** Map edge. Original used a `gamesize` control row; 7 gives a 15×15 world. */
export const GAME_SIZE = 7;

/** 1-in-4, same as `rand(1,4) == 1` in explore.php. */
export const ENCOUNTER_CHANCE = 0.25;

/** Starting stat block before the player spends 8 bonus points. */
export const BASE_STAT = 5;
export const CREATE_BONUS = 8;

export function insightToReach(standing: number): number {
  if (standing <= 1) return 0;
  return Math.floor((15 * standing * (standing - 1)) / 2);
}

export function insightForNext(standing: number): number {
  return insightToReach(standing + 1);
}

export function maxHealthFor(standing: number, strength: number): number {
  // DK level-1 HP was 15. We add a little Strength so investing there matters.
  return 15 + (standing - 1) * 5 + Math.floor(strength / 4);
}

export function maxEssenceFor(standing: number, essencePower: number): number {
  return 10 + (standing - 1) * 4 + Math.floor(essencePower / 4);
}

export function standingTitle(standing: number): string {
  const titles = [
    "Shade",
    "Runner",
    "Blade",
    "Veil Hand",
    "Night Operative",
    "Marker Seeker",
    "Ash Adept",
    "Silent Knife",
    "Dusk Captain",
    "Warden's Shadow",
    "Veil Walker",
    "Night Warden",
  ];
  return titles[Math.min(standing, titles.length) - 1] ?? "Operative";
}

function randInt(min: number, max: number): number {
  const lo = Math.ceil(Math.min(min, max));
  const hi = Math.floor(Math.max(min, max));
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/**
 * Core DK hit: roll between ceil(power/2) and power, then subtract floor(def/2).
 * Defend halves incoming damage after that (original defend flag).
 */
export function rollDamage(power: number, defense: number, defending: boolean): number {
  const min = Math.max(1, Math.ceil(power / 2));
  const max = Math.max(min, power);
  const raw = randInt(min, max) - Math.floor(Math.max(0, defense) / 2);
  const hit = Math.max(1, raw);
  return defending ? Math.max(1, Math.floor(hit / 2)) : hit;
}

export function artDamage(
  essencePower: number,
  artPower: number,
  defense: number,
): number {
  const power = Math.max(1, essencePower + artPower);
  return rollDamage(power, Math.floor(defense / 3), false);
}

/** Flee succeeds if a speed roll beats the threat. Same spirit as DK flee. */
export function fleeSucceeds(speed: number, threatSpeed: number): boolean {
  return randInt(1, speed + 5) > randInt(1, threatSpeed + 3);
}

export function clampCoord(n: number): number {
  return Math.max(-GAME_SIZE, Math.min(GAME_SIZE, n));
}

export function applyLevelUps(op: Operative): string[] {
  const notes: string[] = [];
  while (op.standing < 20 && op.insight >= insightForNext(op.standing)) {
    op.standing += 1;
    op.statPoints += 2;
    op.maxHealth = maxHealthFor(op.standing, op.strength);
    op.maxEssence = maxEssenceFor(op.standing, op.essencePower);
    op.health = op.maxHealth;
    op.essence = op.maxEssence;
    notes.push(`Standing rose to ${op.standing} — ${standingTitle(op.standing)}.`);
  }
  return notes;
}

export function threatFromCatalog(t: Threat): CombatState {
  return {
    threatId: t.id,
    name: t.name,
    health: t.health,
    maxHealth: t.health,
    strength: t.strength,
    defense: t.defense,
    speed: t.speed,
    insight: t.insight,
    coin: t.coin,
    drop: t.drop,
    dropChance: t.dropChance,
    portrait: t.portrait,
    boss: t.boss,
    defending: false,
    threatDefending: false,
    log: [`A ${t.name} bars the road.`],
    region: t.region,
    won: false,
  };
}

export function pickDrop(drop: string | undefined, chance: number, force = false): string | null {
  if (!drop) return null;
  if (force || Math.random() < chance) return drop;
  return null;
}
