/**
 * Database row <-> Operative mapping. Server-only helpers.
 * Keep SQL in one place so the action file can stay about gameplay.
 */

import { getSql } from "@/lib/db";
import type { CombatState, ContractRow, EnclaveId, Operative, PackItem, PortraitId, Slot } from "./types";

type OpRow = {
  id: number;
  user_id: string;
  name: string;
  enclave: string;
  portrait: string;
  standing: number;
  insight: number;
  strength: number;
  speed: number;
  essence_power: number;
  defense: number;
  health: number;
  max_health: number;
  essence: number;
  max_essence: number;
  coin: number;
  lat: number;
  lng: number;
  location_kind: string;
  settlement_id: string | null;
  action: string;
  combat: CombatState | string | null;
  stat_points: number;
  role: string;
  kills: number;
  contracts_done: number;
  visited: string[] | string;
  recovered_keys: string[] | string;
  created_at: string;
};

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function asCombat(v: unknown): CombatState | null {
  if (!v) return null;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as CombatState;
    } catch {
      return null;
    }
  }
  return v as CombatState;
}

export function rowToOperative(row: OpRow): Operative {
  return {
    id: Number(row.id),
    userId: row.user_id,
    name: row.name,
    enclave: row.enclave as EnclaveId,
    portrait: row.portrait as PortraitId,
    standing: Number(row.standing),
    insight: Number(row.insight),
    strength: Number(row.strength),
    speed: Number(row.speed),
    essencePower: Number(row.essence_power),
    defense: Number(row.defense),
    health: Number(row.health),
    maxHealth: Number(row.max_health),
    essence: Number(row.essence),
    maxEssence: Number(row.max_essence),
    coin: Number(row.coin),
    lat: Number(row.lat),
    lng: Number(row.lng),
    locationKind: row.location_kind === "settlement" ? "settlement" : "wild",
    settlementId: (row.settlement_id as EnclaveId | null) ?? null,
    action: (row.action as Operative["action"]) ?? "idle",
    combat: asCombat(row.combat),
    statPoints: Number(row.stat_points),
    role: row.role === "warden" ? "warden" : "operative",
    kills: Number(row.kills),
    contractsDone: Number(row.contracts_done),
    visited: asArray(row.visited),
    recoveredKeys: asArray(row.recovered_keys),
    createdAt: String(row.created_at),
  };
}

export async function loadOperative(userId: string): Promise<Operative | null> {
  const sql = await getSql();
  const rows = await sql<OpRow>`select * from operatives where user_id = ${userId} limit 1`;
  return rows[0] ? rowToOperative(rows[0]) : null;
}

export async function saveOperative(op: Operative): Promise<void> {
  const sql = await getSql();
  const combat = op.combat ? JSON.stringify(op.combat) : null;
  const visited = JSON.stringify(op.visited);
  const keys = JSON.stringify(op.recoveredKeys);
  await sql`
    update operatives set
      name = ${op.name},
      enclave = ${op.enclave},
      portrait = ${op.portrait},
      standing = ${op.standing},
      insight = ${op.insight},
      strength = ${op.strength},
      speed = ${op.speed},
      essence_power = ${op.essencePower},
      defense = ${op.defense},
      health = ${op.health},
      max_health = ${op.maxHealth},
      essence = ${op.essence},
      max_essence = ${op.maxEssence},
      coin = ${op.coin},
      lat = ${op.lat},
      lng = ${op.lng},
      location_kind = ${op.locationKind},
      settlement_id = ${op.settlementId},
      action = ${op.action},
      combat = ${combat}::jsonb,
      stat_points = ${op.statPoints},
      role = ${op.role},
      kills = ${op.kills},
      contracts_done = ${op.contractsDone},
      visited = ${visited}::jsonb,
      recovered_keys = ${keys}::jsonb
    where user_id = ${op.userId}
  `;
}

export async function loadPack(userId: string): Promise<PackItem[]> {
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    item_id: string;
    qty: number;
    equipped: string | null;
  }>`select id, item_id, qty, equipped from pack_items where user_id = ${userId} order by id`;
  return rows.map((r) => ({
    id: Number(r.id),
    itemId: r.item_id,
    qty: Number(r.qty),
    equipped: (r.equipped as Slot | null) ?? null,
  }));
}

export async function addItem(userId: string, itemId: string, qty = 1): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into pack_items (user_id, item_id, qty)
    values (${userId}, ${itemId}, ${qty})
    on conflict (user_id, item_id)
    do update set qty = pack_items.qty + excluded.qty
  `;
}

export async function consumeItem(userId: string, itemId: string, qty = 1): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql<{ id: number; qty: number }>`
    select id, qty from pack_items where user_id = ${userId} and item_id = ${itemId} limit 1
  `;
  const row = rows[0];
  if (!row || Number(row.qty) < qty) return false;
  const next = Number(row.qty) - qty;
  if (next <= 0) {
    await sql`delete from pack_items where id = ${row.id} and user_id = ${userId}`;
  } else {
    await sql`update pack_items set qty = ${next} where id = ${row.id} and user_id = ${userId}`;
  }
  return true;
}

export async function loadContracts(userId: string): Promise<ContractRow[]> {
  const sql = await getSql();
  const rows = await sql<{ contract_id: string; status: string; progress: number }>`
    select contract_id, status, progress from contract_progress where user_id = ${userId}
  `;
  return rows.map((r) => ({
    contractId: r.contract_id,
    status: r.status as ContractRow["status"],
    progress: Number(r.progress),
  }));
}

export async function setContract(
  userId: string,
  contractId: string,
  status: ContractRow["status"],
  progress: number,
): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into contract_progress (user_id, contract_id, status, progress)
    values (${userId}, ${contractId}, ${status}, ${progress})
    on conflict (user_id, contract_id)
    do update set status = excluded.status, progress = excluded.progress
  `;
}
