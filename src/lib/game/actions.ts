/**
 * Server functions for Shadow Shinobi.
 *
 * Every call is authenticated (authMiddleware) and scoped to context.userId
 * except world chat reads (public fiction, not personal data) and the Warden
 * admin tools (which still require the caller's operative.role === "warden").
 *
 * Combat is resolved HERE, not in the browser — same idea as the old PHP
 * fight.php. The client just asks "attack" and we return the new state.
 */

import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  ARTS,
  BROKEN_MARKER,
  CONTRACTS,
  GEAR,
  SETTLEMENTS,
  combatBg,
  contractById,
  gearById,
  pickThreat,
  placeName,
  portraitSrc,
  regionAt,
  settlementAt,
  settlementById,
  threatPortraitSrc,
} from "./catalog";
import {
  CREATE_BONUS,
  ENCOUNTER_CHANCE,
  GAME_SIZE,
  applyLevelUps,
  artDamage,
  clampCoord,
  fleeSucceeds,
  maxEssenceFor,
  maxHealthFor,
  pickDrop,
  rollDamage,
  threatFromCatalog,
} from "./formulas";
import {
  addItem,
  consumeItem,
  loadContracts,
  loadOperative,
  loadPack,
  saveOperative,
  setContract,
} from "./persist";
import type {
  Art,
  ChatMessage,
  CombatAction,
  Direction,
  EnclaveId,
  GameState,
  Gear,
  Operative,
  PackItem,
  PortraitId,
  Slot,
} from "./types";

function bonuses(pack: PackItem[]) {
  const b = { strength: 0, defense: 0, speed: 0, essencePower: 0 };
  for (const p of pack) {
    if (!p.equipped) continue;
    const g = gearById(p.itemId);
    if (!g) continue;
    b.strength += g.strength ?? 0;
    b.defense += g.defense ?? 0;
    b.speed += g.speed ?? 0;
    b.essencePower += g.essencePower ?? 0;
  }
  return b;
}

function live(op: Operative, pack: PackItem[]) {
  const b = bonuses(pack);
  return {
    strength: op.strength + b.strength,
    defense: op.defense + b.defense,
    speed: Math.max(1, op.speed + b.speed),
    essencePower: op.essencePower + b.essencePower,
  };
}

async function assemble(userId: string): Promise<GameState | { needsCreate: true }> {
  const op = await loadOperative(userId);
  if (!op) return { needsCreate: true };
  const pack = await loadPack(userId);
  const contracts = await loadContracts(userId);
  const settlement =
    op.locationKind === "settlement" && op.settlementId
      ? settlementById(op.settlementId)
      : (settlementAt(op.lat, op.lng) ?? null);
  const region = regionAt(op.lat, op.lng);
  const sql = await getSql();
  const online = await sql<{ name: string; standing: number; settlement_id: string | null; lat: number; lng: number }>`
    select name, standing, settlement_id, lat, lng from operatives order by created_at desc limit 12
  `;
  return {
    operative: op,
    pack,
    contracts,
    settlement,
    placeName: placeName(op.lat, op.lng, settlement),
    region,
    online: online.map((o) => ({
      name: o.name,
      standing: Number(o.standing),
      place: placeName(
        Number(o.lat),
        Number(o.lng),
        o.settlement_id ? settlementById(o.settlement_id as EnclaveId) : settlementAt(Number(o.lat), Number(o.lng)),
      ),
    })),
  };
}

async function tickContracts(op: Operative, pack: PackItem[], event: string) {
  const rows = await loadContracts(op.userId);
  const byId = Object.fromEntries(rows.map((r) => [r.contractId, r]));

  const c1 = byId["c1-ink-and-oath"];
  if (c1?.status === "active" && event === "left-home") {
    await completeContract(op, pack, "c1-ink-and-oath");
  }

  const c2 = byId["c2-shadows-on-the-road"];
  if (c2?.status === "active" && event === "kill") {
    const next = c2.progress + 1;
    if (next >= 3) await completeContract(op, pack, "c2-shadows-on-the-road");
    else await setContract(op.userId, "c2-shadows-on-the-road", "active", next);
  }

  const c3 = byId["c3-dust-recovery"];
  if (c3?.status === "active") {
    const has = pack.some((p) => p.itemId === "veil-shard") || op.recoveredKeys.includes("veil-shard");
    if (has) await completeContract(op, pack, "c3-dust-recovery");
  }

  const c4 = byId["c4-silent-road"];
  if (c4?.status === "active" && event.startsWith("enter:")) {
    const id = event.slice(6);
    if (id && id !== op.enclave) await completeContract(op, pack, "c4-silent-road");
  }

  const c5 = byId["c5-broken-marker"];
  if (c5?.status === "active" && event === "boss") {
    await completeContract(op, pack, "c5-broken-marker");
  }
}

async function completeContract(op: Operative, pack: PackItem[], id: string) {
  const def = contractById(id);
  if (!def) return;
  const rows = await loadContracts(op.userId);
  const row = rows.find((r) => r.contractId === id);
  if (row?.status === "complete") return;

  await setContract(op.userId, id, "complete", 99);
  op.insight += def.insight;
  op.coin += def.coin;
  op.contractsDone += 1;
  if (def.rewardItem) await addItem(op.userId, def.rewardItem, 1);
  const notes = applyLevelUps(op);
  op.combat = op.combat
    ? {
        ...op.combat,
        log: [
          ...op.combat.log,
          `Contract complete: ${def.name}. +${def.insight} Insight, +${def.coin} Coin.`,
          ...notes,
        ].slice(-14),
      }
    : op.combat;

  const next = CONTRACTS.find((c) => c.index === def.index + 1);
  if (next) {
    const existing = rows.find((r) => r.contractId === next.id);
    if (!existing || existing.status === "locked") {
      await setContract(op.userId, next.id, "available", 0);
    }
  }
  await saveOperative(op);
}

function assertAlive(op: Operative) {
  if (op.action === "dead" || op.health <= 0) {
    throw new Error("You are down. Rest at an Enclave or use a salve.");
  }
}

export const getGameState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => assemble(context.userId));

export const createOperative = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; enclave: EnclaveId; portrait: PortraitId; strength: number; speed: number; essencePower: number; defense: number }) => {
    const name = d.name.trim().slice(0, 24);
    if (name.length < 2) throw new Error("Name must be at least 2 characters.");
    const bonus = d.strength + d.speed + d.essencePower + d.defense;
    if (bonus !== CREATE_BONUS) throw new Error(`Spend exactly ${CREATE_BONUS} bonus points.`);
    for (const n of [d.strength, d.speed, d.essencePower, d.defense]) {
      if (n < 0 || n > 8) throw new Error("Bonus out of range.");
    }
    if (!SETTLEMENTS.some((s) => s.id === d.enclave)) throw new Error("Unknown Enclave.");
    return { ...d, name };
  })
  .handler(async ({ context, data }) => {
    const existing = await loadOperative(context.userId);
    if (existing) return assemble(context.userId);
    const sql = await getSql();
    const home = settlementById(data.enclave);
    const strength = 5 + data.strength;
    const speed = 5 + data.speed;
    const essencePower = 5 + data.essencePower;
    const defense = 5 + data.defense;
    const standing = 1;
    const maxH = maxHealthFor(standing, strength);
    const maxE = maxEssenceFor(standing, essencePower);
    const others = await sql<{ c: number }>`select count(*)::int as c from operatives`;
    const role = Number(others[0]?.c ?? 0) === 0 ? "warden" : "operative";
    await sql`
      insert into operatives (
        user_id, name, enclave, portrait, standing, insight,
        strength, speed, essence_power, defense,
        health, max_health, essence, max_essence, coin,
        lat, lng, location_kind, settlement_id, action, role, visited
      ) values (
        ${context.userId}, ${data.name}, ${data.enclave}, ${data.portrait}, 1, 0,
        ${strength}, ${speed}, ${essencePower}, ${defense},
        ${maxH}, ${maxH}, ${maxE}, ${maxE}, 50,
        ${home.lat}, ${home.lng}, 'settlement', ${home.id}, 'idle', ${role},
        ${JSON.stringify([home.id])}::jsonb
      )
    `;
    await addItem(context.userId, "worn-blade", 1);
    await addItem(context.userId, "field-salve", 3);
    await addItem(context.userId, "essence-thread", 2);
    await sql`
      update pack_items set equipped = 'weapon'
      where user_id = ${context.userId} and item_id = 'worn-blade'
    `;
    await setContract(context.userId, "c1-ink-and-oath", "available", 0);
    return assemble(context.userId);
  });

export const moveOperative = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { dir: Direction }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    if (op.action === "fighting") throw new Error("You are in a Challenge. Finish it first.");
    assertAlive(op);

    const leftHome = op.locationKind === "settlement" && op.settlementId === op.enclave;
    const delta = { north: [1, 0], south: [-1, 0], east: [0, 1], west: [0, -1] }[data.dir];
    op.lat = clampCoord(op.lat + delta[0]);
    op.lng = clampCoord(op.lng + delta[1]);
    op.essence = Math.min(op.maxEssence, op.essence + 1);

    const town = settlementAt(op.lat, op.lng);
    if (town) {
      op.locationKind = "settlement";
      op.settlementId = town.id;
      op.action = "idle";
      op.combat = null;
      if (!op.visited.includes(town.id)) op.visited = [...op.visited, town.id];
      const pack = await loadPack(context.userId);
      await saveOperative(op);
      await tickContracts(op, pack, `enter:${town.id}`);
      if (leftHome) await tickContracts(op, pack, "left-home");
      return assemble(context.userId);
    }

    op.locationKind = "wild";
    op.settlementId = null;
    const region = regionAt(op.lat, op.lng);
    const atMarker = op.lat === BROKEN_MARKER.lat && op.lng === BROKEN_MARKER.lng;
    const contracts = await loadContracts(context.userId);
    const c5 = contracts.find((c) => c.contractId === "c5-broken-marker");
    const forceBoss = atMarker && c5 && (c5.status === "active" || c5.status === "available");

    if (forceBoss) {
      if (c5.status === "available") await setContract(context.userId, "c5-broken-marker", "active", 0);
      op.action = "fighting";
      op.combat = threatFromCatalog(pickThreat(op.standing, region, "rupture-herald"));
      op.combat.log = ["The Broken Marker hums. The Rupture Herald steps out of the split stone."];
    } else if (Math.random() < ENCOUNTER_CHANCE) {
      op.action = "fighting";
      op.combat = threatFromCatalog(pickThreat(op.standing, region));
    } else {
      op.action = "exploring";
      op.combat = null;
    }

    const pack = await loadPack(context.userId);
    await saveOperative(op);
    if (leftHome) await tickContracts(op, pack, "left-home");
    return assemble(context.userId);
  });

function threatTurn(op: Operative, pack: PackItem[]) {
  const c = op.combat;
  if (!c || c.health <= 0) return;
  const stats = live(op, pack);
  if (Math.random() < 0.15) {
    c.threatDefending = true;
    c.log.push(`The ${c.name} braces.`);
    return;
  }
  c.threatDefending = false;
  const dmg = rollDamage(c.strength, stats.defense, c.defending);
  op.health = Math.max(0, op.health - dmg);
  c.log.push(`The ${c.name} hits you for ${dmg}.`);
  c.defending = false;
  if (op.health <= 0) {
    c.log.push("You fall. The road takes you home, barely alive.");
    op.action = "dead";
    op.coin = Math.max(0, Math.floor(op.coin * 0.9));
    op.combat = null;
    const home = settlementById(op.enclave);
    op.lat = home.lat;
    op.lng = home.lng;
    op.locationKind = "settlement";
    op.settlementId = home.id;
    op.health = 1;
    op.action = "idle";
  }
}

export const combatAction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { action: CombatAction; artId?: string; itemId?: string }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    if (op.action !== "fighting" || !op.combat) throw new Error("You are not in a Challenge.");
    if (op.combat.won) throw new Error("The Challenge is over.");
    const pack = await loadPack(context.userId);
    const stats = live(op, pack);
    const c = op.combat;
    c.defending = false;

    if (data.action === "attack") {
      const dmg = rollDamage(stats.strength, c.defense, c.threatDefending);
      c.health = Math.max(0, c.health - dmg);
      c.log.push(`You strike the ${c.name} for ${dmg}.`);
    } else if (data.action === "defend") {
      c.defending = true;
      c.log.push("You set your guard.");
    } else if (data.action === "art") {
      const art = ARTS.find((a) => a.id === data.artId && a.minStanding <= op.standing);
      if (!art) throw new Error("Unknown Art.");
      if (op.essence < art.essenceCost) throw new Error("Not enough Essence.");
      op.essence -= art.essenceCost;
      if (art.style === "guard" && art.id === "iron-guard") {
        c.defending = true;
        op.health = Math.min(op.maxHealth, op.health + 4);
        c.log.push(`You channel ${art.name}. Guard up, +4 Health.`);
      } else if (art.style === "guard" && art.id === "veil-step") {
        const dmg = artDamage(stats.essencePower, art.power, c.defense);
        c.health = Math.max(0, c.health - dmg);
        c.defending = true;
        c.log.push(`You channel ${art.name} for ${dmg} and blur aside.`);
      } else {
        const def = art.style === "pierce" ? Math.floor(c.defense / 2) : c.defense;
        const dmg = artDamage(stats.essencePower, art.power, def);
        c.health = Math.max(0, c.health - dmg);
        c.log.push(`You channel ${art.name} for ${dmg}.`);
      }
    } else if (data.action === "item") {
      if (!data.itemId) throw new Error("Pick a recovery.");
      await useConsumable(op, pack, data.itemId, true);
    } else if (data.action === "flee") {
      if (c.boss) {
        c.log.push("The Herald does not let you leave.");
      } else if (fleeSucceeds(stats.speed, c.speed)) {
        c.log.push("You slip the Challenge.");
        op.action = "exploring";
        op.combat = null;
        await saveOperative(op);
        return assemble(context.userId);
      } else {
        c.log.push("You fail to break away.");
      }
    }

    c.log = c.log.slice(-14);
    c.threatDefending = false;

    if (c.health <= 0) {
      const drop = pickDrop(c.drop, c.dropChance, c.boss);
      op.insight += c.insight;
      op.coin += c.coin;
      op.kills += 1;
      const notes = applyLevelUps(op);
      const win = [
        `The ${c.name} falls. +${c.insight} Insight, +${c.coin} Coin.`,
        ...notes,
      ];
      if (drop) {
        await addItem(op.userId, drop, 1);
        if (drop === "veil-shard" && !op.recoveredKeys.includes("veil-shard")) {
          op.recoveredKeys = [...op.recoveredKeys, "veil-shard"];
        }
        if (drop === "marker-seal" && !op.recoveredKeys.includes("marker-seal")) {
          op.recoveredKeys = [...op.recoveredKeys, "marker-seal"];
        }
        win.push(`Recovery: ${gearById(drop)?.name ?? drop}.`);
      }
      const wasBoss = Boolean(c.boss);
      c.won = true;
      c.health = 0;
      c.log = [...c.log, ...win].slice(-14);
      op.action = "fighting";
      op.combat = c;
      const pack2 = await loadPack(context.userId);
      await saveOperative(op);
      await tickContracts(op, pack2, "kill");
      if (wasBoss) await tickContracts(op, pack2, "boss");
      if (drop === "veil-shard") await tickContracts(op, pack2, "shard");
      return assemble(context.userId);
    }

    threatTurn(op, pack);
    await saveOperative(op);
    return assemble(context.userId);
  });

async function useConsumable(op: Operative, pack: PackItem[], itemId: string, inFight: boolean) {
  const g = gearById(itemId);
  if (!g || g.kind !== "consumable") throw new Error("That is not a recovery.");
  const held = pack.find((p) => p.itemId === itemId);
  if (!held) throw new Error("You do not have that.");
  if (itemId === "smoke-flask") {
    if (!inFight || !op.combat) throw new Error("Smoke is for the road.");
    if (op.combat.boss) throw new Error("The Herald ignores smoke.");
    const ok = await consumeItem(op.userId, itemId, 1);
    if (!ok) throw new Error("You do not have that.");
    op.combat.log.push("Smoke takes the road. You are gone.");
    op.action = "exploring";
    op.combat = null;
    return;
  }
  const ok = await consumeItem(op.userId, itemId, 1);
  if (!ok) throw new Error("You do not have that.");
  if (g.heal) op.health = Math.min(op.maxHealth, op.health + g.heal);
  if (g.essence) op.essence = Math.min(op.maxEssence, op.essence + g.essence);
  if (op.combat) op.combat.log.push(`You use ${g.name}.`);
  if (op.health > 0 && op.action === "dead") op.action = "idle";
}

export const usePackItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { itemId: string }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    const pack = await loadPack(context.userId);
    await useConsumable(op, pack, data.itemId, op.action === "fighting");
    await saveOperative(op);
    return assemble(context.userId);
  });

export const equipItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { itemId: string; slot: Slot | null }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    const g = gearById(data.itemId);
    if (!g) throw new Error("Unknown gear.");
    const sql = await getSql();
    if (data.slot) {
      if (g.kind !== data.slot) throw new Error("That does not fit the slot.");
      if (g.minStanding && op.standing < g.minStanding) throw new Error("Standing too low.");
      await sql`
        update pack_items set equipped = null
        where user_id = ${context.userId} and equipped = ${data.slot}
      `;
      await sql`
        update pack_items set equipped = ${data.slot}
        where user_id = ${context.userId} and item_id = ${data.itemId}
      `;
    } else {
      await sql`
        update pack_items set equipped = null
        where user_id = ${context.userId} and item_id = ${data.itemId}
      `;
    }
    return assemble(context.userId);
  });

export const shopBuy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { itemId: string }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    if (op.locationKind !== "settlement" || !op.settlementId) throw new Error("Find a Settlement first.");
    const town = settlementById(op.settlementId);
    if (!town.shop.includes(data.itemId)) throw new Error("This stall does not carry that.");
    const g = gearById(data.itemId);
    if (!g || g.price <= 0) throw new Error("Not for sale.");
    if (g.minStanding && op.standing < g.minStanding) throw new Error("Standing too low.");
    if (op.coin < g.price) throw new Error("Not enough Coin.");
    op.coin -= g.price;
    await addItem(op.userId, g.id, 1);
    await saveOperative(op);
    return assemble(context.userId);
  });

export const shopSell = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { itemId: string }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    if (op.locationKind !== "settlement") throw new Error("Find a Settlement first.");
    const g = gearById(data.itemId);
    if (!g || g.kind === "key") throw new Error("You cannot sell that.");
    const pack = await loadPack(context.userId);
    const held = pack.find((p) => p.itemId === data.itemId);
    if (!held) throw new Error("You do not have that.");
    if (held.equipped) throw new Error("Unequip it first.");
    const ok = await consumeItem(op.userId, data.itemId, 1);
    if (!ok) throw new Error("You do not have that.");
    op.coin += Math.max(1, Math.floor(g.price / 2));
    await saveOperative(op);
    return assemble(context.userId);
  });

export const restAtEnclave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    if (op.locationKind !== "settlement") throw new Error("Rest at a Settlement.");
    if (op.action === "fighting") throw new Error("Finish the Challenge first.");
    const cost = 8;
    if (op.coin < cost) throw new Error("A bunk costs 8 Coin.");
    op.coin -= cost;
    op.health = op.maxHealth;
    op.essence = op.maxEssence;
    op.action = "idle";
    await saveOperative(op);
    return assemble(context.userId);
  });

export const trainStat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { stat: "strength" | "speed" | "essencePower" | "defense" }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    if (op.locationKind !== "settlement") throw new Error("Train at a Settlement.");
    if (op.statPoints > 0) {
      op.statPoints -= 1;
    } else {
      const cost = 20 + op.standing * 10;
      if (op.coin < cost) throw new Error(`Discipline costs ${cost} Coin.`);
      op.coin -= cost;
    }
    op[data.stat] += 1;
    op.maxHealth = maxHealthFor(op.standing, op.strength);
    op.maxEssence = maxEssenceFor(op.standing, op.essencePower);
    await saveOperative(op);
    return assemble(context.userId);
  });

export const acceptContract = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { contractId: string }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    const rows = await loadContracts(context.userId);
    const row = rows.find((r) => r.contractId === data.contractId);
    if (!row || (row.status !== "available" && row.status !== "active")) {
      throw new Error("That Contract is not open.");
    }
    await setContract(context.userId, data.contractId, "active", row.progress);
    if (data.contractId === "c1-ink-and-oath" && op.locationKind === "wild") {
      const pack = await loadPack(context.userId);
      await tickContracts(op, pack, "left-home");
      await saveOperative(op);
    }
    return assemble(context.userId);
  });

export const sendChat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { channel: "open" | "local"; body: string }) => {
    const body = d.body.trim().slice(0, 240);
    if (!body) throw new Error("Empty.");
    return { channel: d.channel, body };
  })
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) throw new Error("Bind an Operative first.");
    const place =
      data.channel === "open"
        ? "Open Channel"
        : placeName(op.lat, op.lng, op.settlementId ? settlementById(op.settlementId) : null);
    const sql = await getSql();
    await sql`
      insert into chat_messages (channel, place, user_id, name, body)
      values (${data.channel}, ${place}, ${context.userId}, ${op.name}, ${data.body})
    `;
    return listChat({ data: { channel: data.channel } });
  });

export const listChat = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { channel: "open" | "local"; place?: string }) => d)
  .handler(async ({ context, data }) => {
    const op = await loadOperative(context.userId);
    if (!op) return [] as ChatMessage[];
    const sql = await getSql();
    const place =
      data.place ??
      (data.channel === "open"
        ? "Open Channel"
        : placeName(op.lat, op.lng, op.settlementId ? settlementById(op.settlementId) : null));
    const rows =
      data.channel === "open"
        ? await sql<{ id: number; channel: string; place: string; name: string; body: string; created_at: string }>`
            select id, channel, place, name, body, created_at from chat_messages
            where channel = 'open' order by id desc limit 40
          `
        : await sql<{ id: number; channel: string; place: string; name: string; body: string; created_at: string }>`
            select id, channel, place, name, body, created_at from chat_messages
            where channel = 'local' and place = ${place} order by id desc limit 40
          `;
    return rows
      .map((r) => ({
        id: Number(r.id),
        channel: r.channel as "open" | "local",
        place: r.place,
        name: r.name,
        body: r.body,
        createdAt: String(r.created_at),
      }))
      .reverse();
  });

export const adminList = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const me = await loadOperative(context.userId);
    if (!me || me.role !== "warden") throw new Error("Warden only.");
    const sql = await getSql();
    const ops = await sql<{
      id: number;
      name: string;
      enclave: string;
      standing: number;
      coin: number;
      health: number;
      action: string;
      role: string;
      user_id: string;
    }>`select id, name, enclave, standing, coin, health, action, role, user_id from operatives order by id`;
    return {
      players: ops.map((o) => ({
        id: Number(o.id),
        name: o.name,
        enclave: o.enclave,
        standing: Number(o.standing),
        coin: Number(o.coin),
        health: Number(o.health),
        action: o.action,
        role: o.role,
        userId: o.user_id,
      })),
      gear: GEAR.map((g) => ({ id: g.id, name: g.name, kind: g.kind, price: g.price })),
      threats: (await import("./catalog")).THREATS.map((t) => ({
        id: t.id,
        name: t.name,
        standing: t.standing,
        health: t.health,
      })),
      contracts: CONTRACTS.map((c) => ({ id: c.id, name: c.name, index: c.index })),
    };
  });

export const adminPatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { userId: string; coin?: number; standing?: number; health?: number; giveItem?: string; clearFight?: boolean }) => d)
  .handler(async ({ context, data }) => {
    const me = await loadOperative(context.userId);
    if (!me || me.role !== "warden") throw new Error("Warden only.");
    const op = await loadOperative(data.userId);
    if (!op) throw new Error("No such Operative.");
    if (typeof data.coin === "number") op.coin = Math.max(0, Math.floor(data.coin));
    if (typeof data.standing === "number") {
      op.standing = Math.max(1, Math.min(20, Math.floor(data.standing)));
      op.maxHealth = maxHealthFor(op.standing, op.strength);
      op.maxEssence = maxEssenceFor(op.standing, op.essencePower);
    }
    if (typeof data.health === "number") op.health = Math.max(0, Math.min(op.maxHealth, Math.floor(data.health)));
    if (data.clearFight) {
      op.combat = null;
      op.action = op.locationKind === "settlement" ? "idle" : "exploring";
    }
    if (data.giveItem) await addItem(op.userId, data.giveItem, 1);
    await saveOperative(op);
    return adminList();
  });

export const dismissCombat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const op = await loadOperative(context.userId);
    if (!op) return { needsCreate: true as const };
    op.combat = null;
    op.action = op.locationKind === "settlement" ? "idle" : "exploring";
    await saveOperative(op);
    return assemble(context.userId);
  });

export const catalogPayload = createServerFn({ method: "GET" }).handler(async () => ({
  settlements: SETTLEMENTS,
  arts: ARTS,
  gear: GEAR,
  contracts: CONTRACTS,
  gameSize: GAME_SIZE,
}));

export type Assembled = Awaited<ReturnType<typeof assemble>>;

export { combatBg, portraitSrc, threatPortraitSrc, ARTS, GEAR, CONTRACTS };
export type { Art, Gear };
