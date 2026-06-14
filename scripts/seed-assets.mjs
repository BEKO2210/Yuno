#!/usr/bin/env node
/**
 * Seed Yuno with curated, license-clean (CC0 / public-domain) assets.
 *
 * It reads scripts/seed-manifest.json, downloads each file, uploads it to the
 * correct Supabase Storage bucket and inserts a row into public.assets with
 * tags. Re-running is safe: assets whose file_path already exists are skipped.
 *
 * Requirements (admin only — the service-role key bypasses RLS):
 *   - NEXT_PUBLIC_SUPABASE_URL   (or SUPABASE_URL)
 *   - SUPABASE_SERVICE_ROLE_KEY
 * These are read from the environment or from .env.local automatically.
 *
 * Usage:
 *   node scripts/seed-assets.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- tiny .env.local loader (no dependency) -------------------------------
function loadEnvLocal() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim().replace(/^["']|["']$/g, "");
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* no .env.local — rely on real env */
  }
}
loadEnvLocal();

const DRY_RUN = process.argv.includes("--dry-run");

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DRY_RUN && (!SUPABASE_URL || !SERVICE_KEY)) {
  console.error(
    "\n✗ Missing credentials.\n" +
      "  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY\n" +
      "  (in your environment or .env.local) and try again.\n" +
      "  Tip: run with --dry-run to preview without credentials.\n",
  );
  process.exit(1);
}

const supabase =
  DRY_RUN || !SERVICE_KEY
    ? null
    : createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: { persistSession: false },
      });

const manifest = JSON.parse(
  readFileSync(join(__dirname, "seed-manifest.json"), "utf8"),
);

const CONTENT_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  wav: "audio/wav",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
};

function slugify(s) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "asset"
  );
}

function extOf(url) {
  const m = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
  return m ? m[1].toLowerCase() : "";
}

const MAX_IMAGE_WIDTH = 3840; // cap wallpapers at 4K-wide to keep files sane

/**
 * For oversized Wikimedia Commons originals, swap to the on-the-fly thumbnail
 * (e.g. .../commons/a/b/Foo.jpg -> .../commons/thumb/a/b/Foo.jpg/3840px-Foo.jpg)
 * and scale the stored dimensions to match. Other URLs pass through untouched.
 */
function maybeDownscale(item) {
  const { url, width, height } = item;
  const isCommons =
    url.startsWith("https://upload.wikimedia.org/wikipedia/commons/") &&
    !url.includes("/commons/thumb/");
  if (!isCommons || !width || width <= MAX_IMAGE_WIDTH) return item;

  const base = url.substring(url.lastIndexOf("/") + 1);
  const rel = url.replace(
    "https://upload.wikimedia.org/wikipedia/commons/",
    "",
  );
  const thumbUrl =
    `https://upload.wikimedia.org/wikipedia/commons/thumb/${rel}` +
    `/${MAX_IMAGE_WIDTH}px-${base}`;
  const ratio = MAX_IMAGE_WIDTH / width;
  return {
    ...item,
    url: thumbUrl,
    width: MAX_IMAGE_WIDTH,
    height: height ? Math.round(height * ratio) : null,
  };
}

/** Build the full list of assets to import from the manifest. */
function buildItems() {
  const items = [];

  for (const w of manifest.wallpapers ?? []) {
    items.push(
      maybeDownscale({
        kind: "wallpaper",
        bucket: "wallpapers",
        title: w.title,
        url: w.url,
        tags: w.tags ?? [],
        width: w.width ?? null,
        height: w.height ?? null,
      }),
    );
  }

  const soundBase = manifest.notificationsBaseUrl ?? "";
  for (const s of manifest.notifications ?? []) {
    items.push({
      kind: "notification",
      bucket: "audio",
      title: s.title,
      url: s.url ?? soundBase + s.file,
      tags: s.tags ?? [],
    });
  }
  const ringBase = manifest.ringtonesBaseUrl ?? "";
  for (const r of manifest.ringtones ?? []) {
    items.push({
      kind: "ringtone",
      bucket: "audio",
      title: r.title,
      url: r.url ?? ringBase + r.file,
      tags: r.tags ?? [],
    });
  }

  return items;
}

async function rowExists(filePath) {
  const { data, error } = await supabase
    .from("assets")
    .select("id")
    .eq("file_path", filePath)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

async function importItem(item) {
  const ext = extOf(item.url) || "bin";
  const filePath = `${item.kind}/${slugify(item.title)}.${ext}`;

  if (DRY_RUN) {
    console.log(`  • would add     ${filePath}  [${item.tags.join(", ")}]`);
    return "added";
  }

  if (await rowExists(filePath)) {
    console.log(`  • skip (exists)  ${filePath}`);
    return "skipped";
  }

  const res = await fetch(item.url);
  if (!res.ok) throw new Error(`download ${res.status} for ${item.url}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from(item.bucket)
    .upload(filePath, buffer, {
      contentType: CONTENT_TYPES[ext] ?? "application/octet-stream",
      upsert: true,
    });
  if (upErr) throw new Error(`upload: ${upErr.message}`);

  const { error: insErr } = await supabase.from("assets").insert({
    kind: item.kind,
    title: item.title,
    file_path: filePath,
    tags: item.tags,
    width: item.width ?? null,
    height: item.height ?? null,
  });
  if (insErr) throw new Error(`insert: ${insErr.message}`);

  console.log(`  ✓ added         ${filePath}  [${item.tags.join(", ")}]`);
  return "added";
}

async function main() {
  const items = buildItems();
  console.log(
    `\n${DRY_RUN ? "[dry-run] " : ""}Seeding ${items.length} CC0 assets` +
      `${DRY_RUN ? "" : ` into ${SUPABASE_URL}`}\n` +
      "(all public-domain / no attribution required)\n",
  );

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let added = 0,
    skipped = 0,
    failed = 0;
  for (const item of items) {
    try {
      const r = await importItem(item);
      if (r === "added") added++;
      else skipped++;
    } catch (e) {
      failed++;
      console.error(`  ✗ failed        ${item.title}: ${e.message}`);
    }
    if (!DRY_RUN) await sleep(300); // be polite to the source hosts
  }

  console.log(
    `\nDone. ${added} added, ${skipped} skipped, ${failed} failed.\n`,
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
