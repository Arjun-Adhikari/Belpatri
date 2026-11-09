const fs = require("fs");
for (const f of ["desktop", "mobile"]) {
  const s = fs.readFileSync(`design/reference/${f}.html`, "utf8");
  const urls = [...new Set([...s.matchAll(/https:\/\/lh3\.googleusercontent\.com\/[A-Za-z0-9_\-\/]+/g)].map((m) => m[0]))];
  console.log(`=== ${f} (${urls.length}) ===`);
  for (const u of urls) {
    const idx = s.indexOf(u);
    const before = s.slice(Math.max(0, idx - 220), idx);
    const alt = (before.match(/alt="([^"]*)"/) || [])[1] || "";
    console.log(`${alt} :: ${u}`);
  }
}
