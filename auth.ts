import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

/**
 * Minimal file-backed auth for TilTop.
 *
 * Uses only Node built-ins: scrypt for password hashing and an HMAC-signed
 * token for sessions. No extra dependencies, no native builds.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

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
 */
const AUTH_SECRET =
  process.env.AUTH_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.AUTH_SECRET) {
  console.warn(
    "[TilTop] AUTH_SECRET is not set in .env — using a random secret. " +
    "All sessions will be invalidated on every server restart."
  );
}

// ------------------------------------------------------------------ storage

function ensureStore(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
  }
}

function readUsers(): StoredUser[] {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error("[TilTop] users.json is unreadable — starting from an empty store.");
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  ensureStore();
  // Write-then-rename so a crash mid-write cannot truncate the store.
  const tmp = USERS_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(users, null, 2), "utf8");
  fs.renameSync(tmp, USERS_FILE);
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

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((u) => u.email === normalized);
}

export function findUserById(id: string): StoredUser | undefined {
  return readUsers().find((u) => u.id === id);
}

export function createUser(email: string, name: string, password: string): StoredUser {
  const users = readUsers();
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
  writeUsers(users);
  return user;
}

export function authenticate(email: string, password: string): StoredUser | null {
  const user = findUserByEmail(email);
  // Hash anyway on a miss so response time does not reveal whether the
  // account exists.
  if (!user) {
    hashPassword(password);
    return null;
  }
  return verifyPassword(password, user.passwordHash) ? user : null;
}

export function saveUserState(
  userId: string,
  patch: { profile?: Record<string, unknown>; progress?: Record<string, unknown> }
): StoredUser | null {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  if (patch.profile !== undefined) users[index].profile = patch.profile;
  if (patch.progress !== undefined) users[index].progress = patch.progress;

  writeUsers(users);
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
