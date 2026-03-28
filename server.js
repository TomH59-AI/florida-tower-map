import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.OPENCELLID_TOKEN || "";
const BASE = "https://opencellid.org";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!TOKEN) {
  console.warn("⚠️  OPENCELLID_TOKEN is missing. Set it in .env");
}

app.use(express.static(path.join(__dirname, "public")));

function cleanBbox(value) {
  if (!value) return "";
  const parts = String(value).split(",").map((v) => Number(v.trim()));
  if (parts.length !== 4 || parts.some((v) => !Number.isFinite(v))) {
    throw new Error("Invalid bbox format. Expected south,west,north,east");
  }
  return parts.join(",");
}

async function proxyOpenCellId(pathname, params) {
  const url = new URL(`${BASE}${pathname}`);
  url.searchParams.set("key", TOKEN);
  url.searchParams.set("format", "json");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  const response = await fetch(url, {
    headers: { "User-Agent": "SkyWave-Tower-Map/1.0" }
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, body: text };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasToken: Boolean(TOKEN) });
});

app.get("/api/opencellid/in-area-size", async (req, res) => {
  try {
    if (!TOKEN) return res.status(500).json({ error: "Missing OPENCELLID_TOKEN" });
    const bbox = cleanBbox(req.query.bbox);
    const result = await proxyOpenCellId("/cell/getInAreaSize", { BBOX: bbox });
    res.status(result.status).type("application/json").send(result.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/opencellid/in-area", async (req, res) => {
  try {
    if (!TOKEN) return res.status(500).json({ error: "Missing OPENCELLID_TOKEN" });
    const bbox = cleanBbox(req.query.bbox);
    const offset = Number(req.query.offset ?? 0);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 50)));
    const result = await proxyOpenCellId("/cell/getInArea", {
      BBOX: bbox, offset, limit
    });
    res.status(result.status).type("application/json").send(result.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🗼 SkyWave Florida Tower Map running at http://localhost:${PORT}`);
});
