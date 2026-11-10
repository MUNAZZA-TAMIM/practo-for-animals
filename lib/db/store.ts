import "server-only";

import { access, copyFile, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSeedDatabase } from "./seed";
import type { DemoDatabase } from "./types";

const DB_VERSION = 1;
const dataDirectory = process.env.DEMO_DATA_DIR
  ? path.resolve(process.env.DEMO_DATA_DIR)
  : path.join(process.cwd(), ".data");
const databasePath = path.join(dataDirectory, "db.json");

let writeChain: Promise<unknown> = Promise.resolve();

async function ensureDatabase() {
  try {
    await access(databasePath);
    return;
  } catch {
    await mkdir(dataDirectory, { recursive: true });
    const seed = createSeedDatabase();
    await writeFile(databasePath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");
  }
}

function isDemoDatabase(value: unknown): value is DemoDatabase {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DemoDatabase>;
  return (
    candidate.version === DB_VERSION &&
    Array.isArray(candidate.providers) &&
    Array.isArray(candidate.businessEnquiries) &&
    Array.isArray(candidate.corrections) &&
    Array.isArray(candidate.educationLeads) &&
    Array.isArray(candidate.contentProjects) &&
    Array.isArray(candidate.workflowRuns) &&
    Array.isArray(candidate.auditLogs) &&
    Array.isArray(candidate.businessListings) &&
    Array.isArray(candidate.appointmentRequests) &&
    Array.isArray(candidate.animals)
  );
}

async function readDatabaseFile(): Promise<DemoDatabase> {
  await ensureDatabase();
  const raw = await readFile(databasePath, "utf8");
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isDemoDatabase(parsed)) {
      throw new Error("The demo database shape or version is not supported.");
    }
    return parsed;
  } catch (error) {
    const backupPath = path.join(
      dataDirectory,
      `db.corrupt-${Date.now()}.json`,
    );
    await copyFile(databasePath, backupPath);
    const seed = createSeedDatabase();
    await persistDatabase(seed);
    console.warn(
      `[demo-db] Recovered from an unreadable database. Backup: ${backupPath}`,
      error instanceof Error ? error.message : error,
    );
    return seed;
  }
}

async function persistDatabase(database: DemoDatabase) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = path.join(
    dataDirectory,
    `db.${process.pid}.${Date.now()}.tmp`,
  );
  await writeFile(temporaryPath, `${JSON.stringify(database, null, 2)}\n`, "utf8");
  try {
    await rename(temporaryPath, databasePath);
  } catch {
    // Windows can refuse rename-over-existing. The lock still serialises writes.
    await copyFile(temporaryPath, databasePath);
    await unlink(temporaryPath).catch(() => undefined);
  }
}

/**
 * Read a fresh copy of the demo database. Safe for parallel reads.
 */
export async function readDatabase(): Promise<DemoDatabase> {
  return readDatabaseFile();
}

/**
 * Serialise a read-modify-write cycle. Returns the mutation result.
 * Only suitable for a single Node process (the demo deployment mode).
 */
export async function mutateDatabase<T>(
  mutation: (database: DemoDatabase) => Promise<T> | T,
): Promise<T> {
  const run = writeChain.then(async () => {
    const database = await readDatabaseFile();
    const result = await mutation(database);
    await persistDatabase(database);
    return result;
  });

  writeChain = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export async function resetDatabase(): Promise<void> {
  const seed = createSeedDatabase();
  await persistDatabase(seed);
}

export function getDataStoreLocation() {
  return databasePath;
}

export { DB_VERSION };
