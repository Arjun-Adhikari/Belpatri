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

async function main() {
  const [, , url, outPrefix, widthArg, heightArg, scenario = "customer"] =
    process.argv;
  const width = Number(widthArg);
  const height = Number(heightArg);

  const target = await createTarget(url);
  const client = await connect(target.webSocketDebuggerUrl);

  const evaluate = async (expression) => {
    const { result } = await client.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
    });
    return result.value;
  };

  const click = (text) =>
    evaluate(`(() => {
      const root = document.querySelector('[data-slot="dialog-content"]') || document;
      const nodes = [...root.querySelectorAll("button, a")];
      const el = nodes.find((node) => node.textContent.trim().startsWith(${JSON.stringify(
        text,
      )}));
      if (!el) return "NOT FOUND: " + ${JSON.stringify(text)};
      el.click();
      return "clicked: " + ${JSON.stringify(text)};
    })()`);

  let index = 0;
  const shot = async (name) => {
    const out = path.join(outPrefix, `${String(index++).padStart(2, "0")}-${name}.png`);
    const result = await client.send("Page.captureScreenshot", { format: "png" });
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(result.data, "base64"));
    console.log("shot", out);
  };

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
    await sleep(2000);

    await shot("account");

    console.log(await click("Login"));
    await sleep(600);
    await shot("audience");

    if (scenario === "business") {
      console.log(await click("Business"));
      await sleep(500);
      await shot("roles");

      console.log(await click("Vendor"));
      await sleep(200);
      console.log(await click("Farmer"));
      await sleep(300);
      await shot("roles-both");

      console.log(await click("Continue"));
      await sleep(500);
      await shot("google");
    } else {
      console.log(await click("Customer"));
      await sleep(500);
      await shot("google");
    }

    console.log(await click("Continue with Google"));
    await sleep(1400);
    await shot("details-top");

    await evaluate(
      `(() => { const d = document.querySelector('[data-slot="dialog-content"]'); if (d) d.scrollTop = d.scrollHeight; return "scrolled"; })()`,
    );
    await sleep(400);
    await shot("details-bottom");

    await evaluate(`(() => {
      const root = document.querySelector('[data-slot="dialog-content"]');
      if (!root) return "no dialog";
      root.querySelectorAll("input[required]").forEach((input) => {
        if (input.type === "checkbox") {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }
        if (input.type === "email") input.value = "rahul.verma@gmail.com";
        else if (input.type === "tel") input.value = "+91 98220 44581";
        else if (input.id === "login-pin") input.value = "422003";
        else input.value = "Sample value";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      return "filled";
    })()`);
    await sleep(200);
    console.log(await click("Create account"));
    await sleep(700);
    await shot("done");
  } finally {
    client.close();
    await fetch(`${CDP}/json/close/${target.id}`).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
