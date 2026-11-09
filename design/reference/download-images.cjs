const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "public", "images");
fs.mkdirSync(dir, { recursive: true });

const files = {
  "wheat.jpg":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDEAoczbRXijlqwDa3QaPhS9_vmCkN0rPlvedDGx47g_K-khCQ9URHYeBhFAgBBVZr41xMDVJJ8UxXbq7Lf2iNPce7a9KIV3N64IUXjBiVtbQ21FDlCa6DIelReO0p-Et1ItADKOECKeKH2ivgCwkaVARkuK1tt0k-4bDDgM9YwhyHcQfLYI2to72QRoMLfKaV48uQ79w6R-d0ZqNC-RTV37B_-EE104j6v-UvobcwQ",
  "rice.jpg":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAsuBNYoca30ZuCaLkai-zfSsOLIwoWVl_YfzuTpNLK64MTmByhYAPmknf2yKfwFk62J5lHPkjcqh2K5S8KXZrLLWIR3T54HRuxgwJ_S0HMW2PpXHOZcmX7oJwXqsrJTJETtcJ1vTw0jDBVqBlBpRwAXMANtcQ90PFB91mkYoofSllYktmT7niOlfhSnibdtsle2_dsdeP8OWzAe21Kg3-6hVwxWsAMtpbtTKUUymMd",
  "turmeric.jpg":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCyNdA18Ngo7JEZ3Tspe8nGVnwf2VDcmwLYwa9uRin_FHOttbYNhUCbptGrgLpz83tnN1Hq8ALZ1KYeBpXn9UGWufVf31A-oLwjEZxLPFZHyTQJJvC-QDAaRrF6V0eKcXyIZRufUayYZYwo1D0qqp9Mmp-nk4ubzShwqA3JaWaITHC5BMkwSI4W9VV2I9eOOZJCIixG5M2ktvY2b0ViBGkQYHxIUgd_tdY684Jt51pv",
  "grapes.jpg":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC4HsxSlN5pbntrZB2FPwix1LdTAS9baQPIlOOBTBSoVHcojD3UQscr-A0vhXp_whQRanklU3RVZCYqzUqo5_zGMV417fJsp5h8P_Ao7m5y7VW26zHQmqFUdgX7UeWnbMoVe-qIkhxnn54H4--d9zg_YupZ6wXgt90hjswKQYevWxEZgc0HGmW9eSNVyBaIBOt-JCvoJDZChev5xrCmEwnM6Zb6qwqPNi9Q-Ll4ZhiE",
  "tukdi-wheat.jpg":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDpOiSymu9jV0xC-zt1WgnYjjKVTGwP2dZaH9EaXDEC5oaSqP758ujExyXlxBUGNGthOwaJhUw1ALDCZ2mDI_ehCxViIRghTPB7v51nlNJUp7J7sv6p5ICkqK7stFLrWObtc0EQCOwrn3e-X5X9vHrAyxnpwGY0T15zJEGxKonCoKOOOkZMTucwWbmz3SwPDFUiJRjF9xLdlHtE_0qX6z_uBe8SyPhXNVR3xQdqZ12",
  "chickpeas.jpg":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCOZCj8NiZHxlXQD8STylOJM_LCFb_VJMLLaYP10QszkvlLeImUMZyxaw3v7ZS8Hqn54G1Wc0kp-33QM4ut7avkvb-R4Hq01kEvv98hNw6WtFkfW85V25_t-0-yGtiwaliQrMzH5nko9BwSaUrTimM6TPNMSXhQ0iefHT8ZQ6uQouyN8CoJjxd9dVyyvZL3IUvVnRl5sVqcq69JiY970uZV05YDlSHtfwunTljw4UK-",
  "farmer.jpg":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCIJwq7ZUOMQMXsMJcVncbAQspuQtnyEDAl0br_BdLzn8nd7qBB705xc_vOdgoxANBo_bRLXVZXNs3Ir7klo0pzQDekvSK9HTt9nEEnpEcN8jsZXO8PW3PVmFWXNaNzY1vvseqjQYEj1YPeLDLvaVKwSxTksaCntiz3I1VEaYo19z2fQ-VlCeaDPYgnTJwzOv1ualfDg1AIgnvKL3rGX3ECglKondQUN-Vq_a_FhAk9",
};

(async () => {
  for (const [name, url] of Object.entries(files)) {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("FAIL", name, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(dir, name), buf);
    console.log("ok", name, buf.length);
  }
})();
