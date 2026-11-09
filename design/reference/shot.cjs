const fs = require("fs");
const path = require("path");

const CDP = "http://127.0.0.1:9222";

async function createTarget(url) {
  const res = await fetch(`${CDP}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  });
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function capture({ url, out, width, height, fullPage = false }) {
  const target = await createTarget(url);
  const client = await connect(target.webSocketDebuggerUrl);
  try {
    await client.send("Page.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: width < 768,
    });
    await client.send("Page.navigate", { url });
    await sleep(2200);

    let clip;
    if (fullPage) {
      const metrics = await client.send("Page.getLayoutMetrics");
      const size = metrics.cssContentSize;
      clip = { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
    }

    const shot = await client.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: fullPage,
      ...(clip ? { clip } : {}),
    });
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
    console.log("ok", out, fs.statSync(out).size);
  } finally {
    client.close();
    await fetch(`${CDP}/json/close/${target.id}`).catch(() => {});
  }
}

async function main() {
  const [, , url, out, width, height, full] = process.argv;
  await capture({
    url,
    out,
    width: Number(width),
    height: Number(height),
    fullPage: full === "full",
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
