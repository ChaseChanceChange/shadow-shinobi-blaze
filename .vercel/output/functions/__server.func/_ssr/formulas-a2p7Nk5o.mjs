import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/formulas-a2p7Nk5o.js
var formulas_a2p7Nk5o_exports = /* @__PURE__ */ __exportAll({
	A: () => threatPortraitSrc,
	C: () => gearById,
	D: () => regionAt,
	E: () => portraitSrc,
	O: () => settlementAt,
	S: () => contractById,
	T: () => placeName,
	_: () => GEAR,
	a: () => fleeSucceeds,
	b: () => catalog_exports,
	c: () => maxEssenceFor,
	d: () => rollDamage,
	f: () => standingTitle,
	g: () => CONTRACTS,
	h: () => BROKEN_MARKER,
	i: () => clampCoord,
	j: () => authMiddleware,
	k: () => settlementById,
	l: () => maxHealthFor,
	m: () => ARTS,
	n: () => applyLevelUps,
	o: () => insightForNext,
	p: () => threatFromCatalog,
	r: () => artDamage,
	s: () => insightToReach,
	t: () => ENCOUNTER_CHANCE,
	u: () => pickDrop,
	v: () => PORTRAITS,
	w: () => pickThreat,
	x: () => combatBg,
	y: () => SETTLEMENTS
});
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CVqXY6bk.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-oXaCcQA8.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var catalog_exports = /* @__PURE__ */ __exportAll$1({
	APP_CREDIT: () => APP_CREDIT,
	APP_NAME: () => APP_NAME,
	ARTS: () => ARTS,
	BROKEN_MARKER: () => BROKEN_MARKER,
	CONTRACTS: () => CONTRACTS,
	GEAR: () => GEAR,
	PORTRAITS: () => PORTRAITS,
	SETTLEMENTS: () => SETTLEMENTS,
	THREATS: () => THREATS,
	combatBg: () => combatBg,
	contractById: () => contractById,
	gearById: () => gearById,
	pickThreat: () => pickThreat,
	placeName: () => placeName,
	portraitSrc: () => portraitSrc,
	regionAt: () => regionAt,
	settlementAt: () => settlementAt,
	settlementById: () => settlementById,
	threatById: () => threatById,
	threatPortraitSrc: () => threatPortraitSrc
});
var PORTRAITS = [
	{
		id: "shade",
		name: "The Shade",
		src: "/art/op-shade.jpg",
		blurb: "Hooded. Quiet. The road forgets you."
	},
	{
		id: "blade",
		name: "The Blade",
		src: "/art/op-blade.jpg",
		blurb: "Scarred coat. A short temper kept on a leash."
	},
	{
		id: "veil",
		name: "The Veil",
		src: "/art/op-veil.jpg",
		blurb: "Half-mask, long hair, nothing given away."
	}
];
var SETTLEMENTS = [
	{
		id: "blackleaf",
		name: "Blackleaf",
		warden: "Warden Kael",
		region: "forest",
		lat: 4,
		lng: -4,
		blurb: "Pine halls under a black canopy. The first Enclave to hide after the Veiling.",
		shop: [
			"worn-blade",
			"ash-tanto",
			"field-salve",
			"essence-thread",
			"dusk-cloak",
			"smoke-flask"
		]
	},
	{
		id: "spirit",
		name: "Spirit Mountain",
		warden: "Warden Iri",
		region: "mountain",
		lat: 6,
		lng: 0,
		blurb: "A lantern-keep on a cold peak. They still listen for the old markers.",
		shop: [
			"iron-bracer",
			"field-salve",
			"essence-thread",
			"mountain-wrap",
			"keen-spike",
			"warm-ration"
		]
	},
	{
		id: "stonecrest",
		name: "Stonecrest",
		warden: "Warden Bram",
		region: "highland",
		lat: 1,
		lng: 5,
		blurb: "Granite terraces and a quiet market. Contracts are written in stone dust.",
		shop: [
			"ash-tanto",
			"slate-mail",
			"field-salve",
			"essence-vial",
			"coin-pouch",
			"binding-cord"
		]
	},
	{
		id: "mistveil",
		name: "Mistveil",
		warden: "Warden Sera",
		region: "marsh",
		lat: -2,
		lng: -5,
		blurb: "Fog-cut boardwalks. Operatives here vanish on purpose.",
		shop: [
			"mist-needle",
			"dusk-cloak",
			"field-salve",
			"essence-thread",
			"smoke-flask",
			"silent-soles"
		]
	},
	{
		id: "reddune",
		name: "Red Dune",
		warden: "Warden Zahir",
		region: "dune",
		lat: -5,
		lng: 4,
		blurb: "Glass sand and heat-shadows. The Enclave that never stopped walking.",
		shop: [
			"dune-fang",
			"sand-wrap",
			"field-salve",
			"essence-vial",
			"warm-ration",
			"crimson-sash"
		]
	}
];
var BROKEN_MARKER = {
	lat: 1,
	lng: 1
};
function settlementById(id) {
	const s = SETTLEMENTS.find((x) => x.id === id);
	if (!s) throw new Error("Unknown Enclave");
	return s;
}
function settlementAt(lat, lng) {
	return SETTLEMENTS.find((s) => s.lat === lat && s.lng === lng);
}
function regionAt(lat, lng) {
	if (lat === BROKEN_MARKER.lat && lng === BROKEN_MARKER.lng) return "marker";
	if (lat >= 3 && lng <= -2) return "forest";
	if (lat >= 4) return "mountain";
	if (lng >= 3) return "highland";
	if (lng <= -3) return "marsh";
	if (lat <= -3) return "dune";
	return "highland";
}
function placeName(lat, lng, settlement) {
	if (settlement) return settlement.name;
	if (lat === BROKEN_MARKER.lat && lng === BROKEN_MARKER.lng) return "The Broken Marker";
	return {
		forest: "Black Canopy",
		mountain: "Spirit Spur",
		highland: "Stone Road",
		marsh: "Veil Marsh",
		dune: "Glass Dunes",
		marker: "The Broken Marker"
	}[regionAt(lat, lng)];
}
var THREATS = [
	{
		id: "ash-stalker",
		name: "Ash Stalker",
		blurb: "A cinder figure that walks the pine roads after dusk.",
		standing: 1,
		region: "forest",
		health: 18,
		strength: 6,
		defense: 3,
		speed: 5,
		insight: 8,
		coin: 6,
		drop: "field-salve",
		dropChance: .35,
		portrait: "ash"
	},
	{
		id: "grave-moth",
		name: "Grave Moth",
		blurb: "Dust wings, a hush of powder, a bite that steals warmth.",
		standing: 1,
		region: "forest",
		health: 14,
		strength: 5,
		defense: 2,
		speed: 7,
		insight: 7,
		coin: 5,
		drop: "essence-thread",
		dropChance: .3,
		portrait: "shade"
	},
	{
		id: "veil-shade",
		name: "Veil Shade",
		blurb: "Mist given a cracked porcelain face. It remembers the Veiling.",
		standing: 2,
		region: "any",
		health: 24,
		strength: 8,
		defense: 4,
		speed: 8,
		insight: 12,
		coin: 9,
		drop: "veil-shard",
		dropChance: .25,
		portrait: "shade"
	},
	{
		id: "rift-hound",
		name: "Rift Hound",
		blurb: "Bone and violet light. It hunts the seams in the land.",
		standing: 2,
		region: "highland",
		health: 26,
		strength: 9,
		defense: 5,
		speed: 7,
		insight: 13,
		coin: 10,
		drop: "binding-cord",
		dropChance: .22,
		portrait: "ash"
	},
	{
		id: "stone-wretch",
		name: "Stone Wretch",
		blurb: "A grave-marker that stood up and learned to hate.",
		standing: 3,
		region: "mountain",
		health: 34,
		strength: 11,
		defense: 8,
		speed: 4,
		insight: 18,
		coin: 14,
		drop: "iron-bracer",
		dropChance: .18,
		portrait: "ash"
	},
	{
		id: "cliff-tick",
		name: "Cliff Tick",
		blurb: "Too many legs on a slate wall. Fast, ugly, hungry.",
		standing: 3,
		region: "mountain",
		health: 22,
		strength: 10,
		defense: 4,
		speed: 10,
		insight: 16,
		coin: 12,
		drop: "keen-spike",
		dropChance: .2,
		portrait: "ash"
	},
	{
		id: "dune-wraith",
		name: "Dune Wraith",
		blurb: "Sand-cloth and a bleached mask. It pours itself at you.",
		standing: 4,
		region: "dune",
		health: 38,
		strength: 12,
		defense: 6,
		speed: 9,
		insight: 22,
		coin: 18,
		drop: "sand-wrap",
		dropChance: .18,
		portrait: "shade"
	},
	{
		id: "salt-ghul",
		name: "Salt Ghul",
		blurb: "Marsh-brine and old rope. It drags travelers off the boardwalk.",
		standing: 4,
		region: "marsh",
		health: 36,
		strength: 13,
		defense: 7,
		speed: 6,
		insight: 20,
		coin: 16,
		drop: "mist-needle",
		dropChance: .16,
		portrait: "shade"
	},
	{
		id: "marker-wight",
		name: "Marker Wight",
		blurb: "A shard of a waymarker wearing a dead operative's coat.",
		standing: 5,
		region: "marker",
		health: 44,
		strength: 14,
		defense: 8,
		speed: 8,
		insight: 28,
		coin: 22,
		drop: "veil-shard",
		dropChance: .4,
		portrait: "shade"
	},
	{
		id: "night-binder",
		name: "Night Binder",
		blurb: "Silk-shadow that tries to stitch your Essence shut.",
		standing: 5,
		region: "any",
		health: 40,
		strength: 13,
		defense: 7,
		speed: 11,
		insight: 26,
		coin: 20,
		drop: "essence-vial",
		dropChance: .22,
		portrait: "shade"
	},
	{
		id: "hollow-operative",
		name: "Hollow Operative",
		blurb: "Someone who walked the Veiling and never came all the way back.",
		standing: 4,
		region: "any",
		health: 32,
		strength: 12,
		defense: 6,
		speed: 10,
		insight: 24,
		coin: 18,
		drop: "dusk-cloak",
		dropChance: .15,
		portrait: "blade"
	},
	{
		id: "rupture-herald",
		name: "Rupture Herald",
		blurb: "The Broken Marker given a body. Contract Five ends here.",
		standing: 6,
		region: "marker",
		health: 70,
		strength: 16,
		defense: 10,
		speed: 9,
		insight: 80,
		coin: 60,
		drop: "marker-seal",
		dropChance: 1,
		portrait: "ash",
		boss: true
	}
];
var GEAR = [
	{
		id: "worn-blade",
		name: "Worn Blade",
		kind: "weapon",
		blurb: "A service knife with the Enclave stamp filed off.",
		price: 20,
		strength: 2
	},
	{
		id: "ash-tanto",
		name: "Ash Tanto",
		kind: "weapon",
		blurb: "Dark iron, light in the hand.",
		price: 55,
		strength: 4,
		minStanding: 2
	},
	{
		id: "keen-spike",
		name: "Keen Spike",
		kind: "weapon",
		blurb: "A climbing spike pressed into service.",
		price: 70,
		strength: 3,
		speed: 2,
		minStanding: 3
	},
	{
		id: "mist-needle",
		name: "Mist Needle",
		kind: "weapon",
		blurb: "Thin as fog. Meant for one clean hole.",
		price: 90,
		strength: 5,
		speed: 1,
		minStanding: 4
	},
	{
		id: "dune-fang",
		name: "Dune Fang",
		kind: "weapon",
		blurb: "Serrated glass-sand edge.",
		price: 110,
		strength: 6,
		minStanding: 4
	},
	{
		id: "night-edge",
		name: "Night Edge",
		kind: "weapon",
		blurb: "A quiet sword. Warden-forged.",
		price: 180,
		strength: 8,
		essencePower: 2,
		minStanding: 6
	},
	{
		id: "dusk-cloak",
		name: "Dusk Cloak",
		kind: "armor",
		blurb: "Cuts the wind and a little of the blade.",
		price: 40,
		defense: 2
	},
	{
		id: "iron-bracer",
		name: "Iron Bracer",
		kind: "armor",
		blurb: "One good forearm against a bad night.",
		price: 50,
		defense: 3
	},
	{
		id: "slate-mail",
		name: "Slate Mail",
		kind: "armor",
		blurb: "Thin stone scales on dark cloth.",
		price: 95,
		defense: 5,
		speed: -1,
		minStanding: 3
	},
	{
		id: "mountain-wrap",
		name: "Mountain Wrap",
		kind: "armor",
		blurb: "Wool and wire. Holds heat.",
		price: 65,
		defense: 3,
		essencePower: 1,
		minStanding: 2
	},
	{
		id: "sand-wrap",
		name: "Sand Wrap",
		kind: "armor",
		blurb: "Layered cloth against glass wind.",
		price: 80,
		defense: 4,
		minStanding: 3
	},
	{
		id: "wraith-coat",
		name: "Wraith Coat",
		kind: "armor",
		blurb: "Stolen from a Hollow. Still cold.",
		price: 160,
		defense: 6,
		speed: 1,
		minStanding: 5
	},
	{
		id: "crimson-sash",
		name: "Crimson Sash",
		kind: "accessory",
		blurb: "Enclave thread. Helps you channel.",
		price: 45,
		essencePower: 3
	},
	{
		id: "silent-soles",
		name: "Silent Soles",
		kind: "accessory",
		blurb: "Soft leather. The marsh does not hear you.",
		price: 60,
		speed: 3
	},
	{
		id: "binding-cord",
		name: "Binding Cord",
		kind: "accessory",
		blurb: "Knotted Essence-thread. Tightens a strike.",
		price: 70,
		strength: 2,
		essencePower: 1,
		minStanding: 2
	},
	{
		id: "coin-pouch",
		name: "Lucky Pouch",
		kind: "accessory",
		blurb: "Does not make you lucky. Makes you count.",
		price: 35,
		defense: 1
	},
	{
		id: "marker-seal",
		name: "Marker Seal",
		kind: "key",
		blurb: "A fragment of the Broken Marker, cooled and bound.",
		price: 0
	},
	{
		id: "veil-shard",
		name: "Veil Shard",
		kind: "key",
		blurb: "Glass that remembers the rupture. Needed for Contract Three.",
		price: 0
	},
	{
		id: "field-salve",
		name: "Field Salve",
		kind: "consumable",
		blurb: "Bitter paste. Restores 20 Health.",
		price: 12,
		heal: 20
	},
	{
		id: "warm-ration",
		name: "Warm Ration",
		kind: "consumable",
		blurb: "Spiced grain. Restores 35 Health.",
		price: 22,
		heal: 35
	},
	{
		id: "essence-thread",
		name: "Essence Thread",
		kind: "consumable",
		blurb: "A sip of bound light. Restores 12 Essence.",
		price: 14,
		essence: 12
	},
	{
		id: "essence-vial",
		name: "Essence Vial",
		kind: "consumable",
		blurb: "Clear, cold, humming. Restores 28 Essence.",
		price: 28,
		essence: 28
	},
	{
		id: "smoke-flask",
		name: "Smoke Flask",
		kind: "consumable",
		blurb: "Used on the road to slip a fight (auto-flee).",
		price: 30
	}
];
var ARTS = [
	{
		id: "shadow-cut",
		name: "Shadow Cut",
		blurb: "A short, honest blade Art. Low cost.",
		essenceCost: 4,
		power: 6,
		minStanding: 1,
		style: "strike"
	},
	{
		id: "veil-step",
		name: "Veil Step",
		blurb: "A blur. Strikes and makes the next hit against you miss half.",
		essenceCost: 6,
		power: 5,
		minStanding: 2,
		style: "guard"
	},
	{
		id: "iron-guard",
		name: "Iron Guard",
		blurb: "Channel Essence into the coat. You Defend and recover 4 Health.",
		essenceCost: 5,
		power: 0,
		minStanding: 2,
		style: "guard"
	},
	{
		id: "crimson-needle",
		name: "Crimson Needle",
		blurb: "A piercing Art. Ignores some Defense.",
		essenceCost: 8,
		power: 11,
		minStanding: 3,
		style: "pierce"
	},
	{
		id: "night-pulse",
		name: "Night Pulse",
		blurb: "A wave of bound dark. Heavy, slow, expensive.",
		essenceCost: 12,
		power: 16,
		minStanding: 4,
		style: "strike"
	},
	{
		id: "ash-bloom",
		name: "Ash Bloom",
		blurb: "Cinder burst. Strong against slower Threats.",
		essenceCost: 10,
		power: 13,
		minStanding: 5,
		style: "strike"
	},
	{
		id: "rupture-seal",
		name: "Rupture Seal",
		blurb: "The Art taught by the Marker itself.",
		essenceCost: 14,
		power: 20,
		minStanding: 6,
		style: "pierce"
	}
];
var CONTRACTS = [
	{
		id: "c1-ink-and-oath",
		index: 1,
		name: "Ink and Oath",
		summary: "Take the Warden's first Contract and step onto the road.",
		detail: "The world is still stitching itself together after the Veiling. Your Enclave's Warden needs independent Operatives — not soldiers — to walk the broken roads. Accept this Contract in your home Settlement, then take one step into the wild.",
		objective: "Accept this Contract, then leave your Enclave (any cardinal step).",
		insight: 15,
		coin: 25,
		rewardItem: "field-salve"
	},
	{
		id: "c2-shadows-on-the-road",
		index: 2,
		name: "Shadows on the Road",
		summary: "The roads are not empty. Put three Threats down.",
		detail: "Couriers have gone quiet between Enclaves. The Warden wants proof you can keep a road. Defeat three Threats anywhere in the wild.",
		objective: "Defeat 3 Threats.",
		insight: 30,
		coin: 40,
		rewardItem: "ash-tanto"
	},
	{
		id: "c3-dust-recovery",
		index: 3,
		name: "The Dust Recovery",
		summary: "Bring back a Veil Shard — a sliver of the rupture.",
		detail: "Essence still leaks from cracked waymarkers. Recover a Veil Shard (Threats sometimes drop them; Veil Shades almost remember how) and return it to any Settlement shopkeep — or simply hold it in your Pack.",
		objective: "Recover a Veil Shard.",
		insight: 40,
		coin: 50,
		rewardItem: "essence-vial"
	},
	{
		id: "c4-silent-road",
		index: 4,
		name: "The Silent Road",
		summary: "Walk to another Enclave. The map has to be true again.",
		detail: "After the Veiling, some roads only exist if someone walks them. Travel to any Enclave that is not your home and report in.",
		objective: "Enter a Settlement that is not your home Enclave.",
		insight: 50,
		coin: 60,
		rewardItem: "dusk-cloak"
	},
	{
		id: "c5-broken-marker",
		index: 5,
		name: "The Broken Marker",
		summary: "Stand at the rupture and put the Herald down.",
		detail: "Between the pine and the stone sits a waymarker split to its root. Something has been wearing it. Go to the Broken Marker (the scar on the World Map) and end the Rupture Herald. Bring back the Marker Seal.",
		objective: "Defeat the Rupture Herald at the Broken Marker.",
		insight: 100,
		coin: 120,
		rewardItem: "marker-seal"
	}
];
function gearById(id) {
	return GEAR.find((g) => g.id === id);
}
function threatById(id) {
	return THREATS.find((t) => t.id === id);
}
function contractById(id) {
	return CONTRACTS.find((c) => c.id === id);
}
function portraitSrc(id) {
	return PORTRAITS.find((p) => p.id === id)?.src ?? "/art/op-shade.jpg";
}
function threatPortraitSrc(id) {
	if (id === "blade") return "/art/op-blade.jpg";
	if (id === "shade") return "/art/threat-shade.jpg";
	return "/art/threat-ash.jpg";
}
function combatBg(region) {
	if (region === "dune") return "/art/combat-dune.jpg";
	return "/art/combat-wild.jpg";
}
function pickThreat(standing, region, forceId) {
	if (forceId) {
		const t = threatById(forceId);
		if (t) return t;
	}
	const pool = THREATS.filter((t) => !t.boss && t.standing <= standing + 1 && t.standing >= Math.max(1, standing - 2) && (t.region === "any" || t.region === region));
	const use = pool.length ? pool : THREATS.filter((t) => !t.boss && t.standing <= standing);
	return use[Math.floor(Math.random() * use.length)] ?? THREATS[0];
}
function insightToReach(standing) {
	if (standing <= 1) return 0;
	return Math.floor(15 * standing * (standing - 1) / 2);
}
function insightForNext(standing) {
	return insightToReach(standing + 1);
}
function maxHealthFor(standing, strength) {
	return 15 + (standing - 1) * 5 + Math.floor(strength / 4);
}
function maxEssenceFor(standing, essencePower) {
	return 10 + (standing - 1) * 4 + Math.floor(essencePower / 4);
}
function standingTitle(standing) {
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
		"Night Warden"
	];
	return titles[Math.min(standing, titles.length) - 1] ?? "Operative";
}
function randInt(min, max) {
	const lo = Math.ceil(Math.min(min, max));
	return lo + Math.floor(Math.random() * (Math.floor(Math.max(min, max)) - lo + 1));
}
/**
* Core DK hit: roll between ceil(power/2) and power, then subtract floor(def/2).
* Defend halves incoming damage after that (original defend flag).
*/
function rollDamage(power, defense, defending) {
	const min = Math.max(1, Math.ceil(power / 2));
	const raw = randInt(min, Math.max(min, power)) - Math.floor(Math.max(0, defense) / 2);
	const hit = Math.max(1, raw);
	return defending ? Math.max(1, Math.floor(hit / 2)) : hit;
}
function artDamage(essencePower, artPower, defense) {
	return rollDamage(Math.max(1, essencePower + artPower), Math.floor(defense / 3), false);
}
/** Flee succeeds if a speed roll beats the threat. Same spirit as DK flee. */
function fleeSucceeds(speed, threatSpeed) {
	return randInt(1, speed + 5) > randInt(1, threatSpeed + 3);
}
function clampCoord(n) {
	return Math.max(-7, Math.min(7, n));
}
function applyLevelUps(op) {
	const notes = [];
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
function threatFromCatalog(t) {
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
		won: false
	};
}
function pickDrop(drop, chance, force = false) {
	if (!drop) return null;
	if (force || Math.random() < chance) return drop;
	return null;
}
//#endregion
export { threatPortraitSrc as A, portraitSrc as C, settlementById as D, settlementAt as E, standingTitle as O, placeName as S, rollDamage as T, insightToReach as _, PORTRAITS as a, pickDrop as b, artDamage as c, combatBg as d, contractById as f, insightForNext as g, gearById as h, GEAR as i, threatFromCatalog as k, authMiddleware as l, formulas_a2p7Nk5o_exports as m, BROKEN_MARKER as n, SETTLEMENTS as o, fleeSucceeds as p, CONTRACTS as r, applyLevelUps as s, ARTS as t, clampCoord as u, maxEssenceFor as v, regionAt as w, pickThreat as x, maxHealthFor as y };
