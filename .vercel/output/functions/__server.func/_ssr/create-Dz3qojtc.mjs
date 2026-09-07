import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PORTRAITS, o as SETTLEMENTS } from "./formulas-a2p7Nk5o.mjs";
import { c as useCurrentUserState, n as RedirectToSignIn, s as cn, t as Button } from "./button-B9YO6td8.mjs";
import { a as createOperative } from "./actions-DWBRnPuw.mjs";
import { t as Input } from "./input-1uQ8sRv0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-Dz3qojtc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Create() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [enclave, setEnclave] = (0, import_react.useState)("blackleaf");
	const [portrait, setPortrait] = (0, import_react.useState)("shade");
	const [bonus, setBonus] = (0, import_react.useState)({
		strength: 2,
		speed: 2,
		essencePower: 2,
		defense: 2
	});
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const left = 8 - (bonus.strength + bonus.speed + bonus.essencePower + bonus.defense);
	const stats = (0, import_react.useMemo)(() => [
		["strength", "Strength"],
		["speed", "Speed"],
		["essencePower", "Essence Power"],
		["defense", "Defense"]
	], []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-ink text-muted-foreground",
		children: "Loading…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	function bump(key, delta) {
		setBonus((b) => {
			const next = b[key] + delta;
			if (next < 0 || next > 8) return b;
			if (delta > 0 && 8 - (b.strength + b.speed + b.essencePower + b.defense) <= 0) return b;
			return {
				...b,
				[key]: next
			};
		});
	}
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		try {
			const res = await createOperative({ data: {
				name,
				enclave,
				portrait,
				...bonus
			} });
			if (res && "needsCreate" in res) throw new Error("Could not bind Operative.");
			navigate({ to: "/play" });
		} catch (ex) {
			setErr(ex instanceof Error ? ex.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-ink px-4 py-10 text-bone",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "mx-auto max-w-3xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
					children: "Operative Record"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Bind a name to the road"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					minLength: 2,
					maxLength: 24,
					placeholder: "Operative name",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Enclave"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: SETTLEMENTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setEnclave(s.id),
						className: cn("rounded-xl border p-4 text-left", enclave === s.id ? "border-crimson bg-card" : "border-border bg-secondary/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: s.blurb
						})]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Face"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-3",
					children: PORTRAITS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPortrait(p.id),
						className: cn("overflow-hidden rounded-xl border", portrait === p.id ? "border-crimson" : "border-border"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.src,
							alt: p.name,
							className: "aspect-[2/3] w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-2 py-2 text-xs",
							children: p.name
						})]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-xl",
					children: [
						"Discipline — ",
						left,
						" points left"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Each column starts at ",
						5,
						". Spend ",
						8,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: stats.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 tabular-nums text-muted-foreground",
							children: 5 + bonus[key]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => bump(key, -1),
								children: "−"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => bump(key, 1),
								children: "+"
							})]
						})]
					}, key))
				}),
				err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-crimson",
					children: err
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy || left !== 0 || name.trim().length < 2,
					children: "Take the Oath"
				})
			]
		})
	});
}
//#endregion
export { Create as component };
