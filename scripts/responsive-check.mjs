import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";

const routes = process.argv[3] ? [process.argv[3]] : ["/", "/about", "/work", "/work/aquaadapt", "/work/enterprise-banking", "/work/engineering-experiments", "/contact", "/lab"];
const widths = process.argv[2] ? [Number(process.argv[2])] : [320, 360, 375, 390, 393, 414, 430, 600, 760, 761, 768, 834, 980, 981, 1024, 1199, 1200, 1280, 1440, 1920, 2560];
const screenshotWidths = new Set([390, 768, 1440]);
const screenshotRoutes = new Set(["/", "/work/aquaadapt", "/work/enterprise-banking", "/work/engineering-experiments", "/lab"]);
const chrome = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].find(candidate => candidate && existsSync(candidate));

if (!chrome) throw new Error("Chrome or Chromium is required. Set CHROME_BIN to its executable path.");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const until = async (task, label, attempts = 100) => {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try { const value = await task(); if (value) return value; } catch { /* wait for startup */ }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}`);
};

async function freePort() {
  const server = net.createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const pending = new Map();
    let id = 0;
    socket.addEventListener("open", () => resolve({
      send(method, params = {}) {
        return new Promise((done, fail) => {
          const next = ++id;
          pending.set(next, { done, fail });
          socket.send(JSON.stringify({ id: next, method, params }));
        });
      },
      close: () => socket.close()
    }));
    socket.addEventListener("error", reject);
    socket.addEventListener("message", event => {
      const message = JSON.parse(event.data);
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.fail(new Error(message.error.message));
      else request.done(message.result);
    });
  });
}

const temp = await mkdtemp(path.join(os.tmpdir(), "portfolio-responsive-"));
const shots = path.resolve("output/responsive-check");
const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { stdio: "ignore" });
let browser;
let client;

try {
  await until(async () => (await fetch(base)).ok, "the local portfolio server");
  browser = spawn(chrome, ["--headless=new", "--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=0", `--user-data-dir=${temp}`, "about:blank"], { stdio: "ignore" });
  const debugPort = await until(async () => {
    const data = await readFile(path.join(temp, "DevToolsActivePort"), "utf8");
    return Number(data.split("\n")[0]);
  }, "headless Chrome");
  const target = await (await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" })).json();
  client = await connect(target.webSocketDebuggerUrl);
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await mkdir(shots, { recursive: true });

  const failures = [];
  for (const width of widths) {
    await client.send("Emulation.setDeviceMetricsOverride", { width, height: width < 768 ? 844 : 900, deviceScaleFactor: 1, mobile: width < 1024 });
    await client.send("Emulation.setTouchEmulationEnabled", { enabled: width < 1024 });
    for (const route of routes) {
      await client.send("Page.navigate", { url: base + route });
      await until(async () => {
        const result = await client.send("Runtime.evaluate", { expression: `location.pathname === ${JSON.stringify(route)} && document.readyState === "complete"`, returnByValue: true });
        return result.result.value;
      }, `${route} at ${width}px`);
      await client.send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
      const response = await client.send("Runtime.evaluate", { expression: `(() => {
        const headings = [...document.querySelectorAll("main h1, main h2, main h3")].filter(node => {
          const box = node.getBoundingClientRect();
          return box.width && (box.left < -2 || box.right > innerWidth + 2);
        }).map(node => node.textContent.trim().slice(0, 60));
        return { viewport: innerWidth, page: document.documentElement.scrollWidth, headings,
          heroVideoSrc: document.querySelector(".motion-video video")?.getAttribute("src") ?? null,
          caseCoverSrc: document.querySelector("figure[class*=realCover] img")?.currentSrc ?? null };
      })()`, returnByValue: true });
      const { viewport, page, headings, heroVideoSrc, caseCoverSrc } = response.result.value;
      if (page > viewport + 2 || headings.length) failures.push({ route, width, viewport, page, headings });
      if (route === "/" && width < 1024 && heroVideoSrc) failures.push({ route, width, issue: "Compact hero fetched a video before play" });
      if (route === "/work/engineering-experiments" && !caseCoverSrc?.includes(width <= 760 ? "engineering-concurrency-console-mobile.png" : "engineering-concurrency-console-desktop.png")) {
        failures.push({ route, width, issue: "Wrong concurrency lab screenshot selected", caseCoverSrc });
      }
      if (screenshotWidths.has(width) && screenshotRoutes.has(route)) {
        if (route !== "/") {
          const selector = route === "/lab" ? "[class*=console]" : route === "/work/engineering-experiments" ? "figure[class*=realCover]" : "section[class*=proof]";
          await client.send("Runtime.evaluate", { expression: `document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:"start",behavior:"instant"})` });
          await sleep(100);
        }
        let clip;
        if (route === "/lab") {
          await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
          await sleep(100);
          const result = await client.send("Runtime.evaluate", { expression: `(() => {
            const box = document.querySelector("[class*=console]").getBoundingClientRect();
            return { x: Math.floor(box.left + scrollX), y: Math.floor(box.top + scrollY), width: Math.ceil(box.width), height: Math.ceil(box.height), scale: 1 };
          })()`, returnByValue: true });
          clip = result.result.value;
        }
        const { data } = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: Boolean(clip), ...(clip ? { clip } : {}) });
        if (route === "/lab") await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
        await writeFile(path.join(shots, `${route === "/" ? "home" : route.split("/").at(-1)}-${width}.png`), Buffer.from(data, "base64"));
      }
      if (route === "/" && width === 390) {
        await until(async () => {
          const result = await client.send("Runtime.evaluate", { expression: 'Boolean(document.querySelector("header time")) && document.querySelector("header time").textContent !== "--:--:--"', returnByValue: true });
          return result.result.value;
        }, "client hydration", 50);
        await client.send("Runtime.evaluate", { expression: 'document.querySelector(".video-control")?.click()' });
        const optedIn = await until(async () => {
          const result = await client.send("Runtime.evaluate", { expression: 'document.querySelector(".motion-video video")?.getAttribute("src")', returnByValue: true });
          return result.result.value?.includes("sachin-film-clean-mobile.mp4") || result.result.value?.includes("sachin-film-clean-lite.mp4");
        }, "mobile film opt-in", 30).catch(() => false);
        if (!optedIn) {
          const result = await client.send("Runtime.evaluate", { expression: '({ src: document.querySelector(".motion-video video")?.getAttribute("src"), button: document.querySelector(".video-control")?.textContent })', returnByValue: true });
          failures.push({ route, width, issue: "Play film did not attach a compact video", details: result.result.value });
        }
      }
    }
    console.log(`Checked ${width}px across ${routes.length} routes`);
  }

  if (failures.length) {
    console.error("Responsive overflow found:", JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log(`Passed ${widths.length * routes.length} viewport and route combinations. Sample screenshots: ${shots}`);
  }
} finally {
  client?.close();
  browser?.kill();
  server.kill();
  await sleep(300);
  await rm(temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
