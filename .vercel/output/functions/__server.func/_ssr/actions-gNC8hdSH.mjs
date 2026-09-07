import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-DEhdsJyg.mjs";
import { D as settlementById, E as settlementAt, S as placeName, T as rollDamage, b as pickDrop, c as artDamage, f as contractById, h as gearById, i as GEAR, k as threatFromCatalog, l as authMiddleware, n as BROKEN_MARKER, o as SETTLEMENTS, p as fleeSucceeds, r as CONTRACTS, s as applyLevelUps, t as ARTS, u as clampCoord, v as maxEssenceFor, w as regionAt, x as pickThreat, y as maxHealthFor } from "./formulas-a2p7Nk5o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-gNC8hdSH.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Database row <-> Operative mapping. Server-only helpers.
* Keep SQL in one place so the action file can stay about gameplay.
*/
function asArray(v) {
	if (Array.isArray(v)) return v.map(String);
	if (typeof v === "string") try {
		const p = JSON.parse(v);
		return Array.isArray(p) ? p.map(String) : [];
	} catch {
		return [];
	}
	return [];
}
function asCombat(v) {
	if (!v) return null;
	if (typeof v === "string") try {
		return JSON.parse(v);
	} catch {
		return null;
	}
	return v;
}
function rowToOperative(row) {
	return {
		id: Number(row.id),
		userId: row.user_id,
		name: row.name,
		enclave: row.enclave,
		portrait: row.portrait,
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
		settlementId: row.settlement_id ?? null,
		action: row.action ?? "idle",
		combat: asCombat(row.combat),
		statPoints: Number(row.stat_points),
		role: row.role === "warden" ? "warden" : "operative",
		kills: Number(row.kills),
		contractsDone: Number(row.contracts_done),
		visited: asArray(row.visited),
		recoveredKeys: asArray(row.recovered_keys),
		createdAt: String(row.created_at)
	};
}
async function loadOperative(userId) {
	const rows = await (await getSql())`select * from operatives where user_id = ${userId} limit 1`;
	return rows[0] ? rowToOperative(rows[0]) : null;
}
async function saveOperative(op) {
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
async function loadPack(userId) {
	return (await (await getSql())`select id, item_id, qty, equipped from pack_items where user_id = ${userId} order by id`).map((r) => ({
		id: Number(r.id),
		itemId: r.item_id,
		qty: Number(r.qty),
		equipped: r.equipped ?? null
	}));
}
async function addItem(userId, itemId, qty = 1) {
	await (await getSql())`
    insert into pack_items (user_id, item_id, qty)
    values (${userId}, ${itemId}, ${qty})
    on conflict (user_id, item_id)
    do update set qty = pack_items.qty + excluded.qty
  `;
}
async function consumeItem(userId, itemId, qty = 1) {
	const sql = await getSql();
	const row = (await sql`
    select id, qty from pack_items where user_id = ${userId} and item_id = ${itemId} limit 1
  `)[0];
	if (!row || Number(row.qty) < qty) return false;
	const next = Number(row.qty) - qty;
	if (next <= 0) await sql`delete from pack_items where id = ${row.id} and user_id = ${userId}`;
	else await sql`update pack_items set qty = ${next} where id = ${row.id} and user_id = ${userId}`;
	return true;
}
async function loadContracts(userId) {
	return (await (await getSql())`
    select contract_id, status, progress from contract_progress where user_id = ${userId}
  `).map((r) => ({
		contractId: r.contract_id,
		status: r.status,
		progress: Number(r.progress)
	}));
}
async function setContract(userId, contractId, status, progress) {
	await (await getSql())`
    insert into contract_progress (user_id, contract_id, status, progress)
    values (${userId}, ${contractId}, ${status}, ${progress})
    on conflict (user_id, contract_id)
    do update set status = excluded.status, progress = excluded.progress
  `;
}
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
function bonuses(pack) {
	const b = {
		strength: 0,
		defense: 0,
		speed: 0,
		essencePower: 0
	};
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
function live(op, pack) {
	const b = bonuses(pack);
	return {
		strength: op.strength + b.strength,
		defense: op.defense + b.defense,
		speed: Math.max(1, op.speed + b.speed),
		essencePower: op.essencePower + b.essencePower
	};
}
async function assemble(userId) {
	const op = await loadOperative(userId);
	if (!op) return { needsCreate: true };
	const pack = await loadPack(userId);
	const contracts = await loadContracts(userId);
	const settlement = op.locationKind === "settlement" && op.settlementId ? settlementById(op.settlementId) : settlementAt(op.lat, op.lng) ?? null;
	const region = regionAt(op.lat, op.lng);
	const online = await (await getSql())`
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
			place: placeName(Number(o.lat), Number(o.lng), o.settlement_id ? settlementById(o.settlement_id) : settlementAt(Number(o.lat), Number(o.lng)))
		}))
	};
}
async function tickContracts(op, pack, event) {
	const rows = await loadContracts(op.userId);
	const byId = Object.fromEntries(rows.map((r) => [r.contractId, r]));
	if (byId["c1-ink-and-oath"]?.status === "active" && event === "left-home") await completeContract(op, pack, "c1-ink-and-oath");
	const c2 = byId["c2-shadows-on-the-road"];
	if (c2?.status === "active" && event === "kill") {
		const next = c2.progress + 1;
		if (next >= 3) await completeContract(op, pack, "c2-shadows-on-the-road");
		else await setContract(op.userId, "c2-shadows-on-the-road", "active", next);
	}
	if (byId["c3-dust-recovery"]?.status === "active") {
		if (pack.some((p) => p.itemId === "veil-shard") || op.recoveredKeys.includes("veil-shard")) await completeContract(op, pack, "c3-dust-recovery");
	}
	if (byId["c4-silent-road"]?.status === "active" && event.startsWith("enter:")) {
		const id = event.slice(6);
		if (id && id !== op.enclave) await completeContract(op, pack, "c4-silent-road");
	}
	if (byId["c5-broken-marker"]?.status === "active" && event === "boss") await completeContract(op, pack, "c5-broken-marker");
}
async function completeContract(op, pack, id) {
	const def = contractById(id);
	if (!def) return;
	const rows = await loadContracts(op.userId);
	if (rows.find((r) => r.contractId === id)?.status === "complete") return;
	await setContract(op.userId, id, "complete", 99);
	op.insight += def.insight;
	op.coin += def.coin;
	op.contractsDone += 1;
	if (def.rewardItem) await addItem(op.userId, def.rewardItem, 1);
	const notes = applyLevelUps(op);
	op.combat = op.combat ? {
		...op.combat,
		log: [
			...op.combat.log,
			`Contract complete: ${def.name}. +${def.insight} Insight, +${def.coin} Coin.`,
			...notes
		].slice(-14)
	} : op.combat;
	const next = CONTRACTS.find((c) => c.index === def.index + 1);
	if (next) {
		const existing = rows.find((r) => r.contractId === next.id);
		if (!existing || existing.status === "locked") await setContract(op.userId, next.id, "available", 0);
	}
	await saveOperative(op);
}
function assertAlive(op) {
	if (op.action === "dead" || op.health <= 0) throw new Error("You are down. Rest at an Enclave or use a salve.");
}
var getGameState_createServerFn_handler = createServerRpc({
	id: "645ad3ad8535bf7a897d744e16e022cd843b633fd58712326087f678ac678301",
	name: "getGameState",
	filename: "src/lib/game/actions.ts"
}, (opts) => getGameState.__executeServer(opts));
var getGameState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getGameState_createServerFn_handler, async ({ context }) => assemble(context.userId));
var createOperative_createServerFn_handler = createServerRpc({
	id: "2bae154fbb7d24cb4c5a20a37fa218f2f268c9f386d126af0fe912109bf2f1ee",
	name: "createOperative",
	filename: "src/lib/game/actions.ts"
}, (opts) => createOperative.__executeServer(opts));
var createOperative = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => {
	const name = d.name.trim().slice(0, 24);
	if (name.length < 2) throw new Error("Name must be at least 2 characters.");
	if (d.strength + d.speed + d.essencePower + d.defense !== 8) throw new Error(`Spend exactly 8 bonus points.`);
	for (const n of [
		d.strength,
		d.speed,
		d.essencePower,
		d.defense
	]) if (n < 0 || n > 8) throw new Error("Bonus out of range.");
	if (!SETTLEMENTS.some((s) => s.id === d.enclave)) throw new Error("Unknown Enclave.");
	return {
		...d,
		name
	};
}).handler(createOperative_createServerFn_handler, async ({ context, data }) => {
	if (await loadOperative(context.userId)) return assemble(context.userId);
	const sql = await getSql();
	const home = settlementById(data.enclave);
	const strength = 5 + data.strength;
	const speed = 5 + data.speed;
	const essencePower = 5 + data.essencePower;
	const defense = 5 + data.defense;
	const standing = 1;
	const maxH = maxHealthFor(standing, strength);
	const maxE = maxEssenceFor(standing, essencePower);
	const others = await sql`select count(*)::int as c from operatives`;
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
var moveOperative_createServerFn_handler = createServerRpc({
	id: "d4b5ffbc9cfcc07416d8b437b15547cb3578bc2db2a916b4ea2958f02a686fb3",
	name: "moveOperative",
	filename: "src/lib/game/actions.ts"
}, (opts) => moveOperative.__executeServer(opts));
var moveOperative = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(moveOperative_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
	if (op.action === "fighting") throw new Error("You are in a Challenge. Finish it first.");
	assertAlive(op);
	const leftHome = op.locationKind === "settlement" && op.settlementId === op.enclave;
	const delta = {
		north: [1, 0],
		south: [-1, 0],
		east: [0, 1],
		west: [0, -1]
	}[data.dir];
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
	const c5 = (await loadContracts(context.userId)).find((c) => c.contractId === "c5-broken-marker");
	if (atMarker && c5 && (c5.status === "active" || c5.status === "available")) {
		if (c5.status === "available") await setContract(context.userId, "c5-broken-marker", "active", 0);
		op.action = "fighting";
		op.combat = threatFromCatalog(pickThreat(op.standing, region, "rupture-herald"));
		op.combat.log = ["The Broken Marker hums. The Rupture Herald steps out of the split stone."];
	} else if (Math.random() < .25) {
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
function threatTurn(op, pack) {
	const c = op.combat;
	if (!c || c.health <= 0) return;
	const stats = live(op, pack);
	if (Math.random() < .15) {
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
		op.coin = Math.max(0, Math.floor(op.coin * .9));
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
var combatAction_createServerFn_handler = createServerRpc({
	id: "0e2ad6ee2b216e46cbd3579cb64155c66ce59b8f2b611d1b3dfc9764b4b1eb26",
	name: "combatAction",
	filename: "src/lib/game/actions.ts"
}, (opts) => combatAction.__executeServer(opts));
var combatAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(combatAction_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
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
		if (c.boss) c.log.push("The Herald does not let you leave.");
		else if (fleeSucceeds(stats.speed, c.speed)) {
			c.log.push("You slip the Challenge.");
			op.action = "exploring";
			op.combat = null;
			await saveOperative(op);
			return assemble(context.userId);
		} else c.log.push("You fail to break away.");
	}
	c.log = c.log.slice(-14);
	c.threatDefending = false;
	if (c.health <= 0) {
		const drop = pickDrop(c.drop, c.dropChance, c.boss);
		op.insight += c.insight;
		op.coin += c.coin;
		op.kills += 1;
		const notes = applyLevelUps(op);
		const win = [`The ${c.name} falls. +${c.insight} Insight, +${c.coin} Coin.`, ...notes];
		if (drop) {
			await addItem(op.userId, drop, 1);
			if (drop === "veil-shard" && !op.recoveredKeys.includes("veil-shard")) op.recoveredKeys = [...op.recoveredKeys, "veil-shard"];
			if (drop === "marker-seal" && !op.recoveredKeys.includes("marker-seal")) op.recoveredKeys = [...op.recoveredKeys, "marker-seal"];
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
async function useConsumable(op, pack, itemId, inFight) {
	const g = gearById(itemId);
	if (!g || g.kind !== "consumable") throw new Error("That is not a recovery.");
	if (!pack.find((p) => p.itemId === itemId)) throw new Error("You do not have that.");
	if (itemId === "smoke-flask") {
		if (!inFight || !op.combat) throw new Error("Smoke is for the road.");
		if (op.combat.boss) throw new Error("The Herald ignores smoke.");
		if (!await consumeItem(op.userId, itemId, 1)) throw new Error("You do not have that.");
		op.combat.log.push("Smoke takes the road. You are gone.");
		op.action = "exploring";
		op.combat = null;
		return;
	}
	if (!await consumeItem(op.userId, itemId, 1)) throw new Error("You do not have that.");
	if (g.heal) op.health = Math.min(op.maxHealth, op.health + g.heal);
	if (g.essence) op.essence = Math.min(op.maxEssence, op.essence + g.essence);
	if (op.combat) op.combat.log.push(`You use ${g.name}.`);
	if (op.health > 0 && op.action === "dead") op.action = "idle";
}
var usePackItem_createServerFn_handler = createServerRpc({
	id: "c0e8a08abc10303b008a4a10454b96c5b637d7cf09030f162f0997e71a2ee4f8",
	name: "usePackItem",
	filename: "src/lib/game/actions.ts"
}, (opts) => usePackItem.__executeServer(opts));
var usePackItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(usePackItem_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
	await useConsumable(op, await loadPack(context.userId), data.itemId, op.action === "fighting");
	await saveOperative(op);
	return assemble(context.userId);
});
var equipItem_createServerFn_handler = createServerRpc({
	id: "b738bdb1531fbd38dfdded35d18da9b61faf51b1635aac9894dbf99d999fc4bb",
	name: "equipItem",
	filename: "src/lib/game/actions.ts"
}, (opts) => equipItem.__executeServer(opts));
var equipItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(equipItem_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
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
	} else await sql`
        update pack_items set equipped = null
        where user_id = ${context.userId} and item_id = ${data.itemId}
      `;
	return assemble(context.userId);
});
var shopBuy_createServerFn_handler = createServerRpc({
	id: "646d356742f6c154e3d0d1b5d264d1dc2f3b216284728af22e9f742f01ce9d99",
	name: "shopBuy",
	filename: "src/lib/game/actions.ts"
}, (opts) => shopBuy.__executeServer(opts));
var shopBuy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(shopBuy_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
	if (op.locationKind !== "settlement" || !op.settlementId) throw new Error("Find a Settlement first.");
	if (!settlementById(op.settlementId).shop.includes(data.itemId)) throw new Error("This stall does not carry that.");
	const g = gearById(data.itemId);
	if (!g || g.price <= 0) throw new Error("Not for sale.");
	if (g.minStanding && op.standing < g.minStanding) throw new Error("Standing too low.");
	if (op.coin < g.price) throw new Error("Not enough Coin.");
	op.coin -= g.price;
	await addItem(op.userId, g.id, 1);
	await saveOperative(op);
	return assemble(context.userId);
});
var shopSell_createServerFn_handler = createServerRpc({
	id: "5354ee4b86d6c20458467edd9a634c0bb50c8289ae7ae3fb11c0dbcafcb3331a",
	name: "shopSell",
	filename: "src/lib/game/actions.ts"
}, (opts) => shopSell.__executeServer(opts));
var shopSell = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(shopSell_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
	if (op.locationKind !== "settlement") throw new Error("Find a Settlement first.");
	const g = gearById(data.itemId);
	if (!g || g.kind === "key") throw new Error("You cannot sell that.");
	const held = (await loadPack(context.userId)).find((p) => p.itemId === data.itemId);
	if (!held) throw new Error("You do not have that.");
	if (held.equipped) throw new Error("Unequip it first.");
	if (!await consumeItem(op.userId, data.itemId, 1)) throw new Error("You do not have that.");
	op.coin += Math.max(1, Math.floor(g.price / 2));
	await saveOperative(op);
	return assemble(context.userId);
});
var restAtEnclave_createServerFn_handler = createServerRpc({
	id: "49a85d6d47d3c7dcaffdd7389b35b964284818be2889dac5f36c32f772b7b7c2",
	name: "restAtEnclave",
	filename: "src/lib/game/actions.ts"
}, (opts) => restAtEnclave.__executeServer(opts));
var restAtEnclave = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(restAtEnclave_createServerFn_handler, async ({ context }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
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
var trainStat_createServerFn_handler = createServerRpc({
	id: "87c0969c6c41be567581b9d3516487fa92b01b2c03f5f71fd92c53bc35a6aaec",
	name: "trainStat",
	filename: "src/lib/game/actions.ts"
}, (opts) => trainStat.__executeServer(opts));
var trainStat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(trainStat_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
	if (op.locationKind !== "settlement") throw new Error("Train at a Settlement.");
	if (op.statPoints > 0) op.statPoints -= 1;
	else {
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
var acceptContract_createServerFn_handler = createServerRpc({
	id: "c2ce6e4a2f161fe54a34cbf87d012f4d690feb91bf0209f21333ed7a832e704a",
	name: "acceptContract",
	filename: "src/lib/game/actions.ts"
}, (opts) => acceptContract.__executeServer(opts));
var acceptContract = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(acceptContract_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
	const row = (await loadContracts(context.userId)).find((r) => r.contractId === data.contractId);
	if (!row || row.status !== "available" && row.status !== "active") throw new Error("That Contract is not open.");
	await setContract(context.userId, data.contractId, "active", row.progress);
	if (data.contractId === "c1-ink-and-oath" && op.locationKind === "wild") {
		await tickContracts(op, await loadPack(context.userId), "left-home");
		await saveOperative(op);
	}
	return assemble(context.userId);
});
var sendChat_createServerFn_handler = createServerRpc({
	id: "a79264497c37035b5e0aaae794d02edc6c9abe070dbbced97b70e2a485e2a79a",
	name: "sendChat",
	filename: "src/lib/game/actions.ts"
}, (opts) => sendChat.__executeServer(opts));
var sendChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => {
	const body = d.body.trim().slice(0, 240);
	if (!body) throw new Error("Empty.");
	return {
		channel: d.channel,
		body
	};
}).handler(sendChat_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) throw new Error("Bind an Operative first.");
	const place = data.channel === "open" ? "Open Channel" : placeName(op.lat, op.lng, op.settlementId ? settlementById(op.settlementId) : null);
	await (await getSql())`
      insert into chat_messages (channel, place, user_id, name, body)
      values (${data.channel}, ${place}, ${context.userId}, ${op.name}, ${data.body})
    `;
	return listChat({ data: { channel: data.channel } });
});
var listChat_createServerFn_handler = createServerRpc({
	id: "24eaa2f12f33adb0f205dc3c08451ce1c143edf03989a70749b6b221e012065e",
	name: "listChat",
	filename: "src/lib/game/actions.ts"
}, (opts) => listChat.__executeServer(opts));
var listChat = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(listChat_createServerFn_handler, async ({ context, data }) => {
	const op = await loadOperative(context.userId);
	if (!op) return [];
	const sql = await getSql();
	const place = data.place ?? (data.channel === "open" ? "Open Channel" : placeName(op.lat, op.lng, op.settlementId ? settlementById(op.settlementId) : null));
	return (data.channel === "open" ? await sql`
            select id, channel, place, name, body, created_at from chat_messages
            where channel = 'open' order by id desc limit 40
          ` : await sql`
            select id, channel, place, name, body, created_at from chat_messages
            where channel = 'local' and place = ${place} order by id desc limit 40
          `).map((r) => ({
		id: Number(r.id),
		channel: r.channel,
		place: r.place,
		name: r.name,
		body: r.body,
		createdAt: String(r.created_at)
	})).reverse();
});
var adminList_createServerFn_handler = createServerRpc({
	id: "abc583f9c189312c82fd3bc94b17db125ded38178417ef828e9ccafe78b5eaec",
	name: "adminList",
	filename: "src/lib/game/actions.ts"
}, (opts) => adminList.__executeServer(opts));
var adminList = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminList_createServerFn_handler, async ({ context }) => {
	const me = await loadOperative(context.userId);
	if (!me || me.role !== "warden") throw new Error("Warden only.");
	return {
		players: (await (await getSql())`select id, name, enclave, standing, coin, health, action, role, user_id from operatives order by id`).map((o) => ({
			id: Number(o.id),
			name: o.name,
			enclave: o.enclave,
			standing: Number(o.standing),
			coin: Number(o.coin),
			health: Number(o.health),
			action: o.action,
			role: o.role,
			userId: o.user_id
		})),
		gear: GEAR.map((g) => ({
			id: g.id,
			name: g.name,
			kind: g.kind,
			price: g.price
		})),
		threats: (await import("./formulas-a2p7Nk5o.mjs").then((n) => n.m).then((n) => n.b)).THREATS.map((t) => ({
			id: t.id,
			name: t.name,
			standing: t.standing,
			health: t.health
		})),
		contracts: CONTRACTS.map((c) => ({
			id: c.id,
			name: c.name,
			index: c.index
		}))
	};
});
var adminPatch_createServerFn_handler = createServerRpc({
	id: "2f4f7a2d92ad9d1541b958b770699eea1c7915de40866521b611faa935efe203",
	name: "adminPatch",
	filename: "src/lib/game/actions.ts"
}, (opts) => adminPatch.__executeServer(opts));
var adminPatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(adminPatch_createServerFn_handler, async ({ context, data }) => {
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
var dismissCombat_createServerFn_handler = createServerRpc({
	id: "ea1229acaa0d7db9bfca64aa330dd764cac181af991cf9aa0819499b6560c147",
	name: "dismissCombat",
	filename: "src/lib/game/actions.ts"
}, (opts) => dismissCombat.__executeServer(opts));
var dismissCombat = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(dismissCombat_createServerFn_handler, async ({ context }) => {
	const op = await loadOperative(context.userId);
	if (!op) return { needsCreate: true };
	op.combat = null;
	op.action = op.locationKind === "settlement" ? "idle" : "exploring";
	await saveOperative(op);
	return assemble(context.userId);
});
var catalogPayload_createServerFn_handler = createServerRpc({
	id: "294617a4df726857ce1de6eee18810959428b21871db084e8146bc593a124f65",
	name: "catalogPayload",
	filename: "src/lib/game/actions.ts"
}, (opts) => catalogPayload.__executeServer(opts));
var catalogPayload = createServerFn({ method: "GET" }).handler(catalogPayload_createServerFn_handler, async () => ({
	settlements: SETTLEMENTS,
	arts: ARTS,
	gear: GEAR,
	contracts: CONTRACTS,
	gameSize: 7
}));
//#endregion
export { acceptContract_createServerFn_handler, adminList_createServerFn_handler, adminPatch_createServerFn_handler, catalogPayload_createServerFn_handler, combatAction_createServerFn_handler, createOperative_createServerFn_handler, dismissCombat_createServerFn_handler, equipItem_createServerFn_handler, getGameState_createServerFn_handler, listChat_createServerFn_handler, moveOperative_createServerFn_handler, restAtEnclave_createServerFn_handler, sendChat_createServerFn_handler, shopBuy_createServerFn_handler, shopSell_createServerFn_handler, trainStat_createServerFn_handler, usePackItem_createServerFn_handler };
