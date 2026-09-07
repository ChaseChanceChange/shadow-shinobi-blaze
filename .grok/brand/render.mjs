import { chromium } from "playwright";

const out = process.argv[2];
if (!out) {
  console.error("usage: node render.mjs <out.png>");
  process.exit(1);
}

const browser = await chromium.launch({
  args: ["--disable-web-security", "--allow-file-access-from-files"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 264 },
  deviceScaleFactor: 1,
});
await page.goto("file:///workspace/.grok/brand/banner.html", {
  waitUntil: "load",
  timeout: 20000,
});
await page.evaluate(async () => {
  await document.fonts.ready;
});
await page.waitForTimeout(200);
await page.locator(".card").screenshot({ path: out, type: "png" });
await browser.close();
console.log("wrote", out);
