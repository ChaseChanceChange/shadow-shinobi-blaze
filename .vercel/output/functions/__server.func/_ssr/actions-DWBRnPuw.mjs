import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { l as authMiddleware, o as SETTLEMENTS } from "./formulas-a2p7Nk5o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-DWBRnPuw.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var getGameState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("645ad3ad8535bf7a897d744e16e022cd843b633fd58712326087f678ac678301"));
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
}).handler(createSsrRpc("2bae154fbb7d24cb4c5a20a37fa218f2f268c9f386d126af0fe912109bf2f1ee"));
var moveOperative = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("d4b5ffbc9cfcc07416d8b437b15547cb3578bc2db2a916b4ea2958f02a686fb3"));
var combatAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("0e2ad6ee2b216e46cbd3579cb64155c66ce59b8f2b611d1b3dfc9764b4b1eb26"));
var usePackItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("c0e8a08abc10303b008a4a10454b96c5b637d7cf09030f162f0997e71a2ee4f8"));
var equipItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("b738bdb1531fbd38dfdded35d18da9b61faf51b1635aac9894dbf99d999fc4bb"));
var shopBuy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("646d356742f6c154e3d0d1b5d264d1dc2f3b216284728af22e9f742f01ce9d99"));
var shopSell = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5354ee4b86d6c20458467edd9a634c0bb50c8289ae7ae3fb11c0dbcafcb3331a"));
var restAtEnclave = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("49a85d6d47d3c7dcaffdd7389b35b964284818be2889dac5f36c32f772b7b7c2"));
var trainStat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("87c0969c6c41be567581b9d3516487fa92b01b2c03f5f71fd92c53bc35a6aaec"));
var acceptContract = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("c2ce6e4a2f161fe54a34cbf87d012f4d690feb91bf0209f21333ed7a832e704a"));
var sendChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => {
	const body = d.body.trim().slice(0, 240);
	if (!body) throw new Error("Empty.");
	return {
		channel: d.channel,
		body
	};
}).handler(createSsrRpc("a79264497c37035b5e0aaae794d02edc6c9abe070dbbced97b70e2a485e2a79a"));
var listChat = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("24eaa2f12f33adb0f205dc3c08451ce1c143edf03989a70749b6b221e012065e"));
var adminList = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("abc583f9c189312c82fd3bc94b17db125ded38178417ef828e9ccafe78b5eaec"));
var adminPatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("2f4f7a2d92ad9d1541b958b770699eea1c7915de40866521b611faa935efe203"));
var dismissCombat = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("ea1229acaa0d7db9bfca64aa330dd764cac181af991cf9aa0819499b6560c147"));
createServerFn({ method: "GET" }).handler(createSsrRpc("294617a4df726857ce1de6eee18810959428b21871db084e8146bc593a124f65"));
//#endregion
export { createOperative as a, getGameState as c, restAtEnclave as d, sendChat as f, usePackItem as g, trainStat as h, combatAction as i, listChat as l, shopSell as m, adminList as n, dismissCombat as o, shopBuy as p, adminPatch as r, equipItem as s, acceptContract as t, moveOperative as u };
