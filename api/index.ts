/**
 * Vercel serverless entry point.
 *
 * vercel.json rewrites every /api/* request here, and Express routes it from
 * the original path. The app itself is unchanged — it simply does not call
 * listen() when VERCEL is set.
 */
import app from "../server";

export default app;
