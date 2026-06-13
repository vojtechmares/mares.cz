#!/usr/bin/env node
// scripts/move-r2-objects-to-root.mjs
//
// Finds every object that is NOT at the bucket root (its key contains a "/" -
// e.g. a stray leading slash "/KCD_2025_111.jpg" or a nested "sub/img.jpg")
// and moves it to the root, keyed by its basename. This repairs objects that
// are only reachable via malformed URLs (e.g. https://cdn.mares.cz//KCD_...),
// which Vercel's image optimizer rejects with 400.
//
// R2 has no server-side rename, so each object is copied (GET + PUT) to its
// root key, verified by size, and - only with --delete-old - removed from its
// old location.
//
// Required env (an R2 API token with object read/write on the bucket):
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
//   R2_ENDPOINT (optional override; defaults to the account R2 endpoint)
//
// Usage:
//   node scripts/move-r2-objects-to-root.mjs                       # dry run (default)
//   node scripts/move-r2-objects-to-root.mjs --apply               # copy to root, keep originals
//   node scripts/move-r2-objects-to-root.mjs --apply --delete-old  # + delete originals (true move)
//
// Safe rollout:
//   1. --apply               -> root copies created, originals kept (both URLs resolve)
//   2. point references at the clean root URLs and deploy
//   3. --apply --delete-old  -> remove the originals once nothing references them

import {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const APPLY = process.argv.includes("--apply");
const DELETE_OLD = process.argv.includes("--delete-old");

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT } = process.env;
for (const [name, value] of Object.entries({
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
})) {
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
}

const Bucket = R2_BUCKET;
const endpoint = R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

/** List every object in the bucket (paginated). Returns [{ Key, Size }]. */
async function listAllObjects() {
  const objects = [];
  let ContinuationToken;
  do {
    const res = await s3.send(new ListObjectsV2Command({ Bucket, ContinuationToken }));
    for (const o of res.Contents ?? []) objects.push({ Key: o.Key, Size: o.Size });
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return objects;
}

/** The root-level key for an object: everything after the last "/". */
function rootKey(key) {
  return key.slice(key.lastIndexOf("/") + 1);
}

/** Copy oldKey -> newKey preserving metadata; verify by size. Returns bytes. */
async function copyToRoot(oldKey, newKey) {
  const get = await s3.send(new GetObjectCommand({ Bucket, Key: oldKey }));
  const bytes = await get.Body.transformToByteArray();
  await s3.send(
    new PutObjectCommand({
      Bucket,
      Key: newKey,
      Body: bytes,
      ContentType: get.ContentType,
      CacheControl: get.CacheControl,
      ContentDisposition: get.ContentDisposition,
      ContentEncoding: get.ContentEncoding,
      ContentLanguage: get.ContentLanguage,
      Metadata: get.Metadata,
    }),
  );
  const head = await s3.send(new HeadObjectCommand({ Bucket, Key: newKey }));
  if (head.ContentLength !== bytes.length) {
    throw new Error(`size mismatch (expected ${bytes.length}, got ${head.ContentLength})`);
  }
  return bytes.length;
}

const all = await listAllObjects();
const rootSizes = new Map(all.filter((o) => !o.Key.includes("/")).map((o) => [o.Key, o.Size]));
// "Not at root" = key contains a "/". Ignore folder-marker objects (trailing "/").
const nonRoot = all.filter((o) => o.Key.includes("/") && !o.Key.endsWith("/"));

// Detect collisions where two non-root objects would map to the same root key.
const byTarget = new Map();
for (const o of nonRoot) {
  const t = rootKey(o.Key);
  if (!byTarget.has(t)) byTarget.set(t, []);
  byTarget.get(t).push(o);
}

console.log(
  `Bucket ${Bucket} @ ${endpoint}\n` +
    `Mode: ${APPLY ? (DELETE_OLD ? "APPLY + DELETE-OLD (move)" : "APPLY (copy only)") : "DRY RUN"}\n` +
    `Objects: ${all.length} total, ${rootSizes.size} at root, ${nonRoot.length} not at root`,
);

if (nonRoot.length === 0) {
  console.log("\nNothing to move.");
  process.exit(0);
}

let moved = 0;
let skipped = 0;
for (const o of nonRoot) {
  const oldKey = o.Key;
  const newKey = rootKey(oldKey);
  const label = `${JSON.stringify(oldKey)} -> ${JSON.stringify(newKey)}`;

  if (!newKey) {
    console.log(`• skip (no basename): ${JSON.stringify(oldKey)}`);
    skipped++;
    continue;
  }

  // Two or more non-root sources want the same root key - can't pick safely.
  if (byTarget.get(newKey).length > 1) {
    console.log(`• skip (basename collision among sources): ${label}`);
    skipped++;
    continue;
  }

  // Something already sits at the target root key.
  if (rootSizes.has(newKey)) {
    if (rootSizes.get(newKey) !== o.Size) {
      console.log(`• skip (root key exists, different size): ${label}`);
      skipped++;
      continue;
    }
    // Same size -> treat as already migrated (idempotent re-run).
    if (!APPLY) {
      console.log(`• already at root${DELETE_OLD ? "; would delete original" : ""}: ${label}`);
    } else if (DELETE_OLD) {
      await s3.send(new DeleteObjectCommand({ Bucket, Key: oldKey }));
      console.log(`• already at root, deleted original: ${label}`);
    } else {
      console.log(`• already at root (skip copy): ${label}`);
    }
    skipped++;
    continue;
  }

  if (!APPLY) {
    console.log(`• [dry run] would move ${o.Size}b: ${label}${DELETE_OLD ? " (+delete original)" : ""}`);
    continue;
  }

  try {
    const n = await copyToRoot(oldKey, newKey);
    console.log(`• copied ${n}b: ${label}`);
    if (DELETE_OLD) {
      await s3.send(new DeleteObjectCommand({ Bucket, Key: oldKey }));
      console.log(`    🗑 deleted original ${JSON.stringify(oldKey)}`);
    }
    moved++;
  } catch (err) {
    console.log(`• FAILED ${label}: ${err.message} (original kept)`);
    skipped++;
  }
}

console.log(`\nDone. ${APPLY ? `${moved} moved` : `${nonRoot.length - skipped} would move`}, ${skipped} skipped.`);
