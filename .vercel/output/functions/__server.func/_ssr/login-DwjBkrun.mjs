import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
import { t as GROK_PROVIDERS } from "./server-BIzPmpE7.mjs";
import { r as SignInGate, t as Button } from "./button-B9YO6td8.mjs";
import { t as Input } from "./input-1uQ8sRv0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DwjBkrun.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative grid min-h-dvh place-items-center bg-ink px-4 py-10 text-bone",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/title.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover opacity-30"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthCard, {}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlreadyIn, {})
			})
		]
	});
}
function AlreadyIn() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative ss-panel w-full max-w-sm rounded-xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "You are already inside."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4 w-full",
			onClick: () => navigate({ to: "/play" }),
			children: "Continue"
		})]
	});
}
function AuthCard() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		try {
			if (mode === "up") {
				const { error } = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0] || "Operative",
					callbackURL: "/play"
				});
				if (error) throw new Error(error.message ?? "Sign-up failed");
			} else {
				const { error } = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/play"
				});
				if (error) throw new Error(error.message ?? "Sign-in failed");
			}
			await authClient.getSession();
			navigate({ to: "/play" });
		} catch (ex) {
			setErr(ex instanceof Error ? ex.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative ss-panel w-full max-w-sm rounded-xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
				children: "ChaseCraft"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl",
				children: "Shadow Shinobi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Sign in to bind an Operative to this world."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						className: "w-full",
						onClick: () => signIn(p.providerId, { callbackURL: "/play" }),
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "my-4 text-center text-xs uppercase tracking-widest text-muted-foreground",
					children: "or email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: onEmail,
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Callsign",
							value: name,
							onChange: (e) => setName(e.target.value),
							autoComplete: "nickname"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							required: true,
							placeholder: "Email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							autoComplete: "email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							required: true,
							minLength: 8,
							placeholder: "Password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: mode === "up" ? "new-password" : "current-password"
						}),
						err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-crimson",
							children: err
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: mode === "up" ? "Register" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 w-full text-center text-sm text-muted-foreground hover:text-bone",
					onClick: () => setMode(mode === "up" ? "in" : "up"),
					children: mode === "up" ? "Have a seal already? Sign in" : "New here? Register"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 block text-center text-xs text-muted-foreground",
				children: "Back"
			})
		]
	});
}
//#endregion
export { Login as component };
