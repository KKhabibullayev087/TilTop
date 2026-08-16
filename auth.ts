import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

/**
 * Minimal JSON-backed auth for TilTop.
 *
 * Password hashing (scrypt) and session tokens (HMAC) use only Node built-ins.
 * The user records themselves live in a single JSON document; where that
 * document is kept depends on where the server runs:
 *
 *   - locally        -> data/users.json on disk
 *   - on Vercel      -> users.json in a private Vercel Blob store
 *
 * Serverless filesystems are read-only apart from an ephemeral /tmp, so the
 * on-disk store cannot survive there. The blob driver keeps the exact same
 * JSON shape, so the two are interchangeable and nothing above this layer
 * changes.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const BLOB_PATHNAME = "tiltop/users.json";

const SCRYPT_KEYLEN = 64;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // "salt:derivedKey", both hex
  createdAt: string;
  profile?: Record<string, unknown>;
  progress?: Record<string, unknown>;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  profile?: Record<string, unknown>;
  progress?: Record<string, unknown>;
}

/**
 * Signing secret for session tokens. A generated fallback keeps dev working,
 * but it rotates on restart — set AUTH_SECRET in .env to keep sessions alive.
 *
 * On serverless this matters more than it does locally: every cold start is a
 * fresh process, so without a fixed secret users are logged out constantly.
 */
const AUTH_SECRET =
  process.env.AUTH_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.AUTH_SECRET) {
  console.warn(
    "[TilTop] AUTH_SECRET is not set — using a random secret. " +
    "All sessions will be invalidated whenever the server restarts."
  );
}

// ------------------------------------------------------------------ storage

interface UserStore {
  readonly name: string;
  read(): Promise<StoredUser[]>;
  write(users: StoredUser[]): Promise<void>;
}

function parseUsers(raw: string): StoredUser[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error("[TilTop] users.json is unreadable — starting from an empty store.");
    return [];
  }
}

/** Local development: a plain file on disk. */
const fileStore: UserStore = {
  name: "file",

  async read() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return parseUsers(fs.readFileSync(USERS_FILE, "utf8"));
  },

  async write(users) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Write-then-rename so a crash mid-write cannot truncate the store.
    const tmp = USERS_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(users, null, 2), "utf8");
    fs.renameSync(tmp, USERS_FILE);
  },
};

/**
 * Vercel: the same JSON document in a private Blob store.
 *
 * Reads pass `useCache: false` because the blob CDN can serve a stale copy for
 * up to a minute — long enough that an account created one request ago would
 * appear not to exist on the next one.
 */
const blobStore: UserStore = {
  name: "vercel-blob",

  async read() {
    const { get } = await import("@vercel/blob");
    try {
      const result = await get(BLOB_PATHNAME, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200 || !result.stream) return [];
      return parseUsers(await new Response(result.stream).text());
    } catch (error: any) {
      // A store that has never been written to has no blob yet; that is an
      // empty user list, not a failure.
      if (error?.name === "BlobNotFoundError" || error?.status === 404) return [];
      throw error;
    }
  },

  async write(users) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, JSON.stringify(users, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  },
};

/**
 * Blob whenever the runtime can reach a store, disk otherwise. On Vercel the
 * OIDC credentials and BLOB_STORE_ID are injected once a store is connected to
 * the project; outside Vercel a BLOB_READ_WRITE_TOKEN does the same job.
 */
const store: UserStore =
  process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN
    ? blobStore
    : fileStore;

if (process.env.VERCEL && store === fileStore) {
  console.error(
    "[TilTop] Running on Vercel without a Blob store connected. " +
    "The filesystem is read-only there, so registrations will fail. " +
    "Create a private Blob store and connect it to this project."
  );
}

async function readUsers(): Promise<StoredUser[]> {
  return store.read();
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  return store.write(users);
}

// ----------------------------------------------------------------- password

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;

  const actual = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  const a = Buffer.from(actual, "hex");
  const b = Buffer.from(expected, "hex");
  // Constant-time compare to avoid leaking the hash through timing.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// -------------------------------------------------------------------- token

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return b64url(crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest());
}

export function issueToken(userId: string): string {
  const body = b64url(JSON.stringify({ sub: userId, exp: Date.now() + TOKEN_TTL_MS }));
  return `${body}.${sign(body)}`;
}

function verifyToken(token: string): string | null {
  const [body, signature] = (token || "").split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64").toString("utf8"));
    if (typeof parsed.exp !== "number" || Date.now() > parsed.exp) return null;
    return typeof parsed.sub === "string" ? parsed.sub : null;
  } catch {
    return null;
  }
}

// --------------------------------------------------------------- validation

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCredentials(
  email: unknown,
  password: unknown,
  name?: unknown
): string | null {
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return "Email manzil noto'g'ri.";
  }
  if (typeof password !== "string" || password.length < 8) {
    return "Parol kamida 8 ta belgidan iborat bo'lishi kerak.";
  }
  if (password.length > 200) {
    return "Parol juda uzun.";
  }
  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    return "Ism kamida 2 ta belgidan iborat bo'lishi kerak.";
  }
  return null;
}

// ------------------------------------------------------------------- public

export function toPublicUser(user: StoredUser): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const normalized = email.trim().toLowerCase();
  return (await readUsers()).find((u) => u.email === normalized);
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  return (await readUsers()).find((u) => u.id === id);
}

/**
 * Note: the store is a single document, so this is a read-modify-write. Two
 * registrations landing in the same instant could have one overwrite the
 * other. At this app's scale that is acceptable; a per-user record would be
 * the fix if signups ever get busy.
 */
export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<StoredUser> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalized)) {
    throw new Error("EMAIL_TAKEN");
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: normalized,
    name: name.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

export async function authenticate(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const user = await findUserByEmail(email);
  // Hash anyway on a miss so response time does not reveal whether the
  // account exists.
  if (!user) {
    hashPassword(password);
    return null;
  }
  return verifyPassword(password, user.passwordHash) ? user : null;
}

export async function saveUserState(
  userId: string,
  patch: { profile?: Record<string, unknown>; progress?: Record<string, unknown> }
): Promise<StoredUser | null> {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  if (patch.profile !== undefined) users[index].profile = patch.profile;
  if (patch.progress !== undefined) users[index].progress = patch.progress;

  await writeUsers(users);
  return users[index];
}

// --------------------------------------------------------------- middleware

export interface AuthedRequest extends Request {
  userId?: string;
}

/** Rejects the request unless it carries a valid `Authorization: Bearer` token. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const userId = verifyToken(token);

  if (!userId) {
    res.status(401).json({ error: "Avtorizatsiya talab qilinadi." });
    return;
  }

  req.userId = userId;
  next();
}
