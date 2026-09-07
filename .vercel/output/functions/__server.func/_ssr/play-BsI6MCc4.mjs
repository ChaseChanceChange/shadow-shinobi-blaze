import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as threatPortraitSrc, C as portraitSrc, D as settlementById, O as standingTitle, _ as insightToReach, a as PORTRAITS, d as combatBg, g as insightForNext, h as gearById, n as BROKEN_MARKER, o as SETTLEMENTS, r as CONTRACTS, t as ARTS, w as regionAt } from "./formulas-a2p7Nk5o.mjs";
import { c as useCurrentUserState, n as RedirectToSignIn, o as UserButton, s as cn, t as Button } from "./button-B9YO6td8.mjs";
import { c as getGameState, d as restAtEnclave, f as sendChat, g as usePackItem, h as trainStat, i as combatAction, l as listChat, m as shopSell, n as adminList, o as dismissCombat, p as shopBuy, r as adminPatch, s as equipItem, t as acceptContract, u as moveOperative } from "./actions-DWBRnPuw.mjs";
import { t as Input } from "./input-1uQ8sRv0.mjs";
import { a as Shield, c as Map, d as ChevronUp, f as ChevronRight, h as Backpack, i as Store, l as Dumbbell, m as ChevronDown, o as ScrollText, p as ChevronLeft, r as Swords, s as MessageSquare, t as UserRound, u as Compass } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play-BsI6MCc4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground", className),
		...props
	});
}
function Meter({ label, value, max, tone }) {
	const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, value / max * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex justify-between gap-2 text-[11px] uppercase tracking-wide text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-bone",
				children: [
					value,
					"/",
					max
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ss-meter",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full rounded-full", tone === "health" ? "bg-crimson" : tone === "essence" ? "bg-essence" : "bg-bone/80"),
				style: { width: `${pct}%` }
			})
		})]
	});
}
function isReady(s) {
	return Boolean(s && "operative" in s);
}
function errMsg(e) {
	return e instanceof Error ? e.message : "The road refuses.";
}
function GameApp() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [state, setState] = (0, import_react.useState)(null);
	const [view, setView] = (0, import_react.useState)("world");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const [loadErr, setLoadErr] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			const next = await getGameState();
			setState(next);
			setLoadErr(null);
			return next;
		} catch (e) {
			setLoadErr(errMsg(e));
			return null;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		refresh();
	}, [user, refresh]);
	(0, import_react.useEffect)(() => {
		if (isReady(state) && state.operative.action === "fighting") setView("fight");
	}, [state]);
	async function run(fn) {
		if (busy) return;
		setBusy(true);
		setFlash(null);
		try {
			const next = await fn();
			setState(next);
		} catch (e) {
			setFlash(errMsg(e));
		} finally {
			setBusy(false);
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-ink text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display tracking-widest",
			children: "Opening the veil…"
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (loadErr === "Unauthorized") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (state && "needsCreate" in state) {
		navigate({ to: "/create" });
		return null;
	}
	if (!isReady(state)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: loadErr ?? "Binding Essence…"
		})
	});
	const g = state;
	const op = g.operative;
	const fighting = op.action === "fighting" && op.combat && !op.combat.won;
	const nav = [
		{
			id: "world",
			label: "World Map",
			icon: Map
		},
		{
			id: "fight",
			label: "Challenge",
			icon: Swords,
			hide: !(op.combat || fighting)
		},
		{
			id: "pack",
			label: "Pack",
			icon: Backpack
		},
		{
			id: "shop",
			label: "Stall",
			icon: Store,
			hide: op.locationKind !== "settlement"
		},
		{
			id: "contracts",
			label: "Contracts",
			icon: ScrollText
		},
		{
			id: "discipline",
			label: "Discipline",
			icon: Dumbbell,
			hide: op.locationKind !== "settlement"
		},
		{
			id: "record",
			label: "Operative Record",
			icon: UserRound
		},
		{
			id: "chat",
			label: "Channels",
			icon: MessageSquare
		},
		{
			id: "admin",
			label: "Warden Desk",
			icon: Shield,
			hide: op.role !== "warden"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-ink text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-ink/90 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-5 text-crimson" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm tracking-[0.2em] text-bone",
								children: "SHADOW SHINOBI"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-[11px] text-muted-foreground",
								children: [
									op.name,
									" · ",
									standingTitle(op.standing),
									" · ",
									g.placeName
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden tabular-nums text-xs text-muted-foreground sm:inline",
							children: [op.coin, " Coin"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl grid-cols-3 gap-3 px-3 pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							label: "Health",
							value: op.health,
							max: op.maxHealth,
							tone: "health"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							label: "Essence",
							value: op.essence,
							max: op.maxEssence,
							tone: "essence"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							label: "Insight",
							value: op.insight - insightToReach(op.standing),
							max: Math.max(1, insightForNext(op.standing) - insightToReach(op.standing)),
							tone: "insight"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl gap-3 p-3 pb-24 md:pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden w-52 shrink-0 flex-col gap-1 md:flex",
					children: nav.filter((n) => !n.hide).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setView(n.id),
						className: cn("flex h-11 items-center gap-2 rounded-md px-3 text-left text-sm", view === n.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "size-4" }), n.label]
					}, n.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "min-w-0 flex-1",
					children: [
						flash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 rounded-md border border-crimson/40 bg-crimson/10 px-3 py-2 text-sm text-bone",
							children: flash
						}) : null,
						view === "world" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldView, {
							g,
							busy,
							onMove: (dir) => run(() => moveOperative({ data: { dir } })),
							onRest: () => run(() => restAtEnclave())
						}) : null,
						view === "fight" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CombatView, {
							g,
							busy,
							run
						}) : null,
						view === "pack" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackView, {
							g,
							busy,
							run
						}) : null,
						view === "shop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopView, {
							g,
							busy,
							run
						}) : null,
						view === "contracts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractsView, {
							g,
							busy,
							run
						}) : null,
						view === "record" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordView, { g }) : null,
						view === "discipline" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisciplineView, {
							g,
							busy,
							run
						}) : null,
						view === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatView, { g }) : null,
						view === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminView, {}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-ink/95 md:hidden",
				children: nav.filter((n) => [
					"world",
					"fight",
					"pack",
					"contracts",
					"record"
				].includes(n.id) && !n.hide).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setView(n.id),
					className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-wide", view === n.id ? "text-crimson" : "text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "size-4" }), n.label.split(" ")[0]]
				}, n.id))
			})
		]
	});
}
function WorldView({ g, busy, onMove, onRest }) {
	const op = g.operative;
	const x = (op.lng + 7) / 14 * 100;
	const y = (7 - op.lat) / 14 * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-[1.4fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ss-panel relative overflow-hidden rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/world-map.jpg",
				alt: "World Map",
				className: "aspect-[16/10] w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0",
				children: [
					SETTLEMENTS.map((s) => {
						const sx = (s.lng + 7) / 14 * 100;
						const sy = (7 - s.lat) / 14 * 100;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: s.name,
							className: "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone ring-2 ring-crimson/80",
							style: {
								left: `${sx}%`,
								top: `${sy}%`
							}
						}, s.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: "Broken Marker",
						className: "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-crimson",
						style: {
							left: `${(BROKEN_MARKER.lng + 7) / 14 * 100}%`,
							top: `${(7 - BROKEN_MARKER.lat) / 14 * 100}%`
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson shadow-[0_0_12px_#c41e3a]",
						style: {
							left: `${x}%`,
							top: `${y}%`
						}
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ss-panel rounded-xl p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: g.placeName }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl",
					children: g.settlement ? g.settlement.name : "The Road"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: g.settlement ? g.settlement.blurb : `Wild ground. Region ${regionAt(op.lat, op.lng)}. One step in four draws a Threat.`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs tabular-nums text-muted-foreground",
					children: [
						op.lat,
						", ",
						op.lng
					]
				}),
				g.settlement ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-bone",
					children: ["Warden: ", g.settlement.warden]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							disabled: busy || op.action === "fighting",
							onClick: () => onMove("north"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" }), " North"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							disabled: busy || op.action === "fighting",
							onClick: () => onMove("west"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " West"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: true,
							children: "Step"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							disabled: busy || op.action === "fighting",
							onClick: () => onMove("east"),
							children: ["East ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							disabled: busy || op.action === "fighting",
							onClick: () => onMove("south"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" }), " South"]
						})
					]
				}),
				g.settlement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					disabled: busy,
					onClick: onRest,
					children: "Rest (8 Coin)"
				}) : null
			]
		})]
	});
}
function CombatView({ g, busy, run }) {
	const op = g.operative;
	const c = op.combat;
	if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ss-panel rounded-xl p-6 text-muted-foreground",
		children: "No Challenge. Walk the World Map — one step in four draws a Threat."
	});
	const bg = combatBg(c.region);
	const arts = ARTS.filter((a) => a.minStanding <= op.standing);
	const salves = g.pack.filter((p) => gearById(p.itemId)?.kind === "consumable");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ss-panel overflow-hidden rounded-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[16/9] max-h-[280px] overflow-hidden md:max-h-[340px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: bg,
					alt: "",
					className: "size-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ss-scan absolute inset-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex items-end justify-between gap-3 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortraitCard, {
						src: portraitSrc(op.portrait),
						name: op.name,
						hp: op.health,
						max: op.maxHealth,
						sub: `${standingTitle(op.standing)}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortraitCard, {
						src: threatPortraitSrc(c.portrait),
						name: c.name,
						hp: c.health,
						max: c.maxHealth,
						sub: c.boss ? "Herald" : "Threat",
						invert: true
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 p-3 md:grid-cols-[1fr_16rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-40 space-y-1 overflow-auto text-sm leading-relaxed",
				children: c.log.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-bone/90",
					children: line
				}, `${i}-${line}`))
			}), c.won ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => run(() => dismissCombat()),
				children: "Continue"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => run(() => combatAction({ data: { action: "attack" } })),
						children: "Attack"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						disabled: busy,
						onClick: () => run(() => combatAction({ data: { action: "defend" } })),
						children: "Defend"
					}),
					arts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled: busy || op.essence < a.essenceCost,
						onClick: () => run(() => combatAction({ data: {
							action: "art",
							artId: a.id
						} })),
						children: [
							a.name,
							" (",
							a.essenceCost,
							")"
						]
					}, a.id)),
					salves.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						disabled: busy,
						onClick: () => run(() => combatAction({ data: {
							action: "item",
							itemId: p.itemId
						} })),
						children: ["Use ", gearById(p.itemId)?.name]
					}, p.itemId)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						disabled: busy || c.boss,
						onClick: () => run(() => combatAction({ data: { action: "flee" } })),
						children: "Flee"
					})
				]
			})]
		})]
	});
}
function PortraitCard({ src, name, hp, max, sub, invert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("w-[42%] max-w-40", invert && "text-right"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: name,
				className: "aspect-[2/3] w-full rounded-lg object-cover ring-1 ring-border"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate font-display text-sm",
				children: name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: sub
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
				label: "Health",
				value: hp,
				max,
				tone: "health"
			})
		]
	});
}
function PackView({ g, busy, run }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ss-panel rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Pack"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Gear on the body. Recoveries in the fold."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 divide-y divide-border",
				children: [g.pack.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-6 text-muted-foreground",
					children: "Empty."
				}) : null, g.pack.map((p) => {
					const item = gearById(p.itemId);
					if (!item) return null;
					const slot = item.kind === "weapon" || item.kind === "armor" || item.kind === "accessory" ? item.kind : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-2 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [
										item.name,
										" ",
										p.qty > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["×", p.qty]
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: item.blurb
								})]
							}),
							p.equipped ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["Equipped · ", p.equipped] }) : null,
							slot ? p.equipped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy,
								onClick: () => run(() => equipItem({ data: {
									itemId: p.itemId,
									slot: null
								} })),
								children: "Unequip"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: busy,
								onClick: () => run(() => equipItem({ data: {
									itemId: p.itemId,
									slot
								} })),
								children: "Equip"
							}) : null,
							item.kind === "consumable" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								disabled: busy,
								onClick: () => run(() => usePackItem({ data: { itemId: p.itemId } })),
								children: "Use"
							}) : null
						]
					}, p.id);
				})]
			})
		]
	});
}
function ShopView({ g, busy, run }) {
	if (!g.settlement) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ss-panel rounded-xl p-6 text-muted-foreground",
		children: "Stalls live in Settlements."
	});
	const stock = g.settlement.shop.map((id) => gearById(id)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ss-panel rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-2xl",
				children: [g.settlement.name, " Stall"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"You carry ",
					g.operative.coin,
					" Coin."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border",
				children: stock.map((item) => item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: item.blurb
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-sm",
							children: [item.price, "c"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: busy,
							onClick: () => run(() => shopBuy({ data: { itemId: item.id } })),
							children: "Buy"
						})
					]
				}, item.id) : null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 font-display text-lg",
				children: "Sell from Pack"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 divide-y divide-border",
				children: g.pack.filter((p) => {
					const it = gearById(p.itemId);
					return it && it.kind !== "key" && !p.equipped;
				}).map((p) => {
					const it = gearById(p.itemId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-sm",
								children: it.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [Math.floor(it.price / 2), "c"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy,
								onClick: () => run(() => shopSell({ data: { itemId: p.itemId } })),
								children: "Sell"
							})
						]
					}, p.id);
				})
			})
		]
	});
}
function ContractsView({ g, busy, run }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ss-panel rounded-xl p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "The Broken Marker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Starter arc. Five Contracts. English only. Yours."
			})]
		}), CONTRACTS.map((c) => {
			const row = g.contracts.find((r) => r.contractId === c.id);
			const status = row?.status ?? "locked";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "ss-panel rounded-xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg",
							children: [
								c.index,
								". ",
								c.name
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: c.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-bone",
						children: c.objective
					}),
					status === "active" && c.id === "c2-shadows-on-the-road" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Progress ",
							row?.progress ?? 0,
							"/3"
						]
					}) : null,
					status === "available" || status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						disabled: busy || status === "active",
						onClick: () => run(() => acceptContract({ data: { contractId: c.id } })),
						children: status === "active" ? "Accepted" : "Accept Contract"
					}) : null
				]
			}, c.id);
		})]
	});
}
function RecordView({ g }) {
	const op = g.operative;
	const p = PORTRAITS.find((x) => x.id === op.portrait);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ss-panel grid gap-4 rounded-xl p-4 md:grid-cols-[12rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: p?.src ?? portraitSrc(op.portrait),
			alt: "",
			className: "aspect-[2/3] w-full rounded-lg object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: settlementById(op.enclave).name }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-3xl",
				children: op.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground",
				children: [
					standingTitle(op.standing),
					" · Standing ",
					op.standing
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid grid-cols-2 gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Strength",
						v: op.strength
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Speed",
						v: op.speed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Essence Power",
						v: op.essencePower
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Defense",
						v: op.defense
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Coin",
						v: op.coin
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Threats down",
						v: op.kills
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted-foreground",
				children: [
					"Independent Operative of ",
					settlementById(op.enclave).name,
					". The Veiling took the old roads. You walk what is left."
				]
			})
		] })]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-secondary px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-wide text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl tabular-nums",
			children: v
		})]
	});
}
function DisciplineView({ g, busy, run }) {
	const cost = 20 + g.operative.standing * 10;
	const stats = [
		"strength",
		"speed",
		"essencePower",
		"defense"
	];
	const labels = {
		strength: "Strength",
		speed: "Speed",
		essencePower: "Essence Power",
		defense: "Defense"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ss-panel rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Develop Discipline"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Free points from Standing: ",
					g.operative.statPoints,
					". Otherwise ",
					cost,
					" Coin a lesson."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2 sm:grid-cols-2",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					disabled: busy,
					onClick: () => run(() => trainStat({ data: { stat: s } })),
					children: [
						"Train ",
						labels[s],
						" (",
						g.operative[s],
						")"
					]
				}, s))
			})
		]
	});
}
function ChatView({ g }) {
	const [channel, setChannel] = (0, import_react.useState)("open");
	const [lines, setLines] = (0, import_react.useState)([]);
	const [text, setText] = (0, import_react.useState)("");
	const place = channel === "open" ? "Open Channel" : g.placeName;
	const load = (0, import_react.useCallback)(async () => {
		const rows = await listChat({ data: { channel } });
		setLines(rows);
	}, [channel]);
	(0, import_react.useEffect)(() => {
		load();
		const t = setInterval(() => void load(), 4e3);
		return () => clearInterval(t);
	}, [load]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ss-panel flex h-[28rem] flex-col rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: channel === "open" ? "default" : "outline",
					onClick: () => setChannel("open"),
					children: "Open Channel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: channel === "local" ? "default" : "outline",
					onClick: () => setChannel("local"),
					children: "Local Channel"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: place
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 min-h-0 flex-1 space-y-2 overflow-auto text-sm",
				children: lines.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium text-bone",
					children: [m.name, ": "]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: m.body
				})] }, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					const body = text.trim();
					if (!body) return;
					setText("");
					sendChat({ data: {
						channel,
						body
					} }).then(setLines).catch(() => void 0);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Speak…",
					maxLength: 240
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Send"
				})]
			})
		]
	});
}
function AdminView() {
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		adminList().then(setData).catch((e) => setErr(errMsg(e)));
	}, []);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ss-panel rounded-xl p-4 text-sm text-crimson",
		children: err
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ss-panel rounded-xl p-4 text-muted-foreground",
		children: "Loading desk…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ss-panel rounded-xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Warden Desk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "First Operative on this world is Warden. Manage players, hand Gear, clear fights."
				})]
			}),
			data.players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ss-panel flex flex-wrap items-center gap-2 rounded-xl p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								p.enclave,
								" · Standing ",
								p.standing,
								" · ",
								p.coin,
								"c · ",
								p.action
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => adminPatch({ data: {
							userId: p.userId,
							coin: p.coin + 50
						} }).then(setData),
						children: "+50 Coin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => adminPatch({ data: {
							userId: p.userId,
							clearFight: true
						} }).then(setData),
						children: "Clear fight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => adminPatch({ data: {
							userId: p.userId,
							giveItem: "field-salve"
						} }).then(setData),
						children: "Give salve"
					})
				]
			}, p.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ss-panel rounded-xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg",
					children: "Catalog"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						data.threats.length,
						" Threats · ",
						data.gear.length,
						" Gear · ",
						data.contracts.length,
						" Contracts"
					]
				})]
			})
		]
	});
}
var SplitComponent = GameApp;
//#endregion
export { SplitComponent as component };
