const CDP = "http://127.0.0.1:9222";

async function createTarget(url) {
  const res = await fetch(`${CDP}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  if (!res.ok) throw new Error(`new target failed: ${res.status}`);
  return res.json();
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    let nextId = 1;
    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          return new Promise((res, rej) => {
            const id = nextId++;
            pending.set(id, { res, rej });
            ws.send(JSON.stringify({ id, method, params }));
          });
        },
        close() {
          ws.close();
        },
      });
    });
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(JSON.stringify(msg.error)));
        else res(msg.result);
      }
    });
    ws.addEventListener("error", reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function audit({ path, width, height }) {
  const url = `http://localhost:3000${path}`;
  const target = await createTarget(url);
  const client = await connect(target.webSocketDebuggerUrl);
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: width < 768,
    });
    await client.send("Page.navigate", { url });
    await sleep(1600);
    const { result } = await client.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const doc = document.documentElement;
        const offenders = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.right > window.innerWidth + 1 || r.left < -1) {
            const style = getComputedStyle(el);
            if (style.position === "fixed") continue;
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || "").toString().slice(0, 90),
              left: Math.round(r.left),
              right: Math.round(r.right),
            });
          }
        }
        return {
          innerWidth: window.innerWidth,
          scrollWidth: doc.scrollWidth,
          overflow: Math.max(0, doc.scrollWidth - window.innerWidth),
          offenders: offenders.slice(0, 6),
        };
      })()`,
    });
    return { path, width, ...result.value };
  } finally {
    client.close();
    await fetch(`${CDP}/json/close/${target.id}`).catch(() => {});
  }
}

async function main() {
  const routes = [
    "/",
    "/?market=vendor",
    "/?market=farmer",
    "/products/standard-sharbati-wheat",
    "/vendors",
    "/vendors/sahyadri-spices-and-dry-fruits-hub",
    "/cart",
    "/checkout?market=managed",
    "/checkout/success?market=managed&mode=self&total=3248",
    "/orders",
    "/orders/BPT-88219",
    "/account",
  ];
  const widths = [390, 768, 1024, 1440];
  const results = [];
  for (const width of widths) {
    for (const route of routes) {
      const r = await audit({ path: route, width, height: width < 768 ? 844 : 900 });
      results.push(r);
      console.log(
        `${r.width}px ${r.path.padEnd(52)} overflow=${r.overflow}` +
          (r.offenders.length ? ` offenders=${JSON.stringify(r.offenders)}` : ""),
      );
    }
  }
  const bad = results.filter((r) => r.overflow > 1);
  console.log(`\n${bad.length} route/width combos overflow`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
