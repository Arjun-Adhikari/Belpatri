const fs = require("fs");

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

async function main() {
  const [, , url, out, width, height, clickText] = process.argv;
  const target = await createTarget(url);
  const client = await connect(target.webSocketDebuggerUrl);
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: Number(width),
      height: Number(height),
      deviceScaleFactor: 2,
      mobile: Number(width) < 768,
    });
    await client.send("Page.navigate", { url });
    await sleep(1800);

    if (clickText) {
      const { result } = await client.send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const btn = [...document.querySelectorAll("button")].find(
            (b) => b.textContent.trim().startsWith(${JSON.stringify(clickText)}),
          );
          if (!btn) return "not found";
          btn.click();
          return "clicked";
        })()`,
      });
      await sleep(700);
      console.log("click:", result.value);
    }

    const shot = await client.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
    console.log("ok", out);
  } finally {
    client.close();
    await fetch(`${CDP}/json/close/${target.id}`).catch(() => {});
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
