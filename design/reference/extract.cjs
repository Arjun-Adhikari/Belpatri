const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "mobile.html");
const s = fs.readFileSync(file, "utf8");

function grab(name) {
  const start = s.indexOf(name + " = [");
  if (start < 0) return null;
  const open = s.indexOf("[", start);
  let depth = 0;
  let i = open;
  let inStr = null;
  let esc = false;
  for (; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return s.slice(open, i);
}

for (const n of ["vendorsDirectory", "commodities", "categoryList"]) {
  const txt = grab(n);
  if (!txt) {
    console.log(n, "NOT FOUND");
    continue;
  }
  try {
    const arr = eval("(" + txt + ")");
    fs.writeFileSync(path.join(__dirname, n + ".json"), JSON.stringify(arr, null, 2));
    console.log(n, arr.length, "items ->", arr.length ? Object.keys(arr[0]).join(",") : "");
  } catch (e) {
    console.log(n, "PARSE FAIL", e.message, "len", txt.length);
  }
}

const oi = s.indexOf("const orders");
console.log("orders idx", oi, oi >= 0 ? s.slice(oi, oi + 400) : "");
