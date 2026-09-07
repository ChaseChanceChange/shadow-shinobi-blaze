/**
 * Shadow Shinobi — shared types.
 *
 * The original PHP engine stored everything on a `dk_users` row. We keep the
 * same *ideas* (position, standing, combat flag, pack) but use typed JSON
 * the modern app can pass between the browser and Postgres.
 */

export type EnclaveId =
  | "blackleaf"
  | "spirit"
  | "stonecrest"
  | "mistveil"
  | "reddune";

export type RegionId = "forest" | "mountain" | "highland" | "marsh" | "dune" | "marker";

export type PortraitId = "shade" | "blade" | "veil";

export type Slot = "weapon" | "armor" | "accessory";

export type ItemKind = Slot | "consumable" | "key";

export type GameView =
  | "world"
  | "fight"
  | "pack"
  | "shop"
  | "contracts"
  | "record"
  | "chat"
  | "discipline"
  | "admin";

export type Direction = "north" | "south" | "east" | "west";

export type CombatAction = "attack" | "defend" | "art" | "item" | "flee";

export type ContractStatus = "locked" | "available" | "active" | "complete";

export interface Settlement {
  id: EnclaveId;
  name: string;
  warden: string;
  region: RegionId;
  lat: number;
  lng: number;
  blurb: string;
  shop: string[];
}

export interface Threat {
  id: string;
  name: string;
  blurb: string;
  standing: number;
  region: RegionId | "any";
  health: number;
  strength: number;
  defense: number;
  speed: number;
  insight: number;
  coin: number;
  drop?: string;
  dropChance: number;
  portrait: "ash" | "shade" | "blade";
  boss?: boolean;
}

export interface Gear {
  id: string;
  name: string;
  kind: ItemKind;
  blurb: string;
  price: number;
  strength?: number;
  defense?: number;
  speed?: number;
  essencePower?: number;
  heal?: number;
  essence?: number;
  minStanding?: number;
}

export interface Art {
  id: string;
  name: string;
  blurb: string;
  essenceCost: number;
  power: number;
  minStanding: number;
  style: "strike" | "guard" | "pierce";
}

export interface ContractDef {
  id: string;
  index: number;
  name: string;
  summary: string;
  detail: string;
  objective: string;
  insight: number;
  coin: number;
  rewardItem?: string;
}

export interface CombatState {
  threatId: string;
  name: string;
  health: number;
  maxHealth: number;
  strength: number;
  defense: number;
  speed: number;
  insight: number;
  coin: number;
  drop?: string;
  dropChance: number;
  portrait: "ash" | "shade" | "blade";
  boss?: boolean;
  defending: boolean;
  threatDefending: boolean;
  log: string[];
  region: RegionId | "any";
  won?: boolean;
}

export interface PackItem {
  id: number;
  itemId: string;
  qty: number;
  equipped: Slot | null;
}

export interface Operative {
  id: number;
  userId: string;
  name: string;
  enclave: EnclaveId;
  portrait: PortraitId;
  standing: number;
  insight: number;
  strength: number;
  speed: number;
  essencePower: number;
  defense: number;
  health: number;
  maxHealth: number;
  essence: number;
  maxEssence: number;
  coin: number;
  lat: number;
  lng: number;
  locationKind: "wild" | "settlement";
  settlementId: EnclaveId | null;
  action: "idle" | "exploring" | "fighting" | "dead";
  combat: CombatState | null;
  statPoints: number;
  role: "operative" | "warden";
  kills: number;
  contractsDone: number;
  visited: string[];
  recoveredKeys: string[];
  createdAt: string;
}

export interface ContractRow {
  contractId: string;
  status: ContractStatus;
  progress: number;
}

export interface ChatMessage {
  id: number;
  channel: "open" | "local";
  place: string;
  name: string;
  body: string;
  createdAt: string;
}

export interface GameState {
  operative: Operative;
  pack: PackItem[];
  contracts: ContractRow[];
  settlement: Settlement | null;
  placeName: string;
  region: RegionId;
  online: { name: string; standing: number; place: string }[];
}
