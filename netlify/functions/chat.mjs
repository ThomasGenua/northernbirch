import { FEATURES } from "./prompts.mjs";

// Hardened proxy in front of the Anthropic API.
//
// The browser never sends a model, a system prompt, or a token budget: it sends
// a feature key and the conversation turns, and everything else is decided here.
// Anything the client could previously control was a way to spend the credit
// union's API key on someone else's workload.

const ALLOWED_ORIGINS = (Netlify.env.get("ALLOWED_ORIGINS") || "")
  .split(",").map((o) => o.trim()).filter(Boolean);

const MAX_TURNS = 20;
const MAX_CHARS = 24_000;        // total characters across all turns
const RATE_LIMIT = 20;           // requests per window, per IP
const RATE_WINDOW_MS = 60_000;

// Best-effort limiter. Netlify may run several instances, so this bounds abuse
// per instance rather than globally — durable limiting needs a shared store.
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const window = hits.get(ip);
  if (!window || now - window.start > RATE_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) for (const [k, v] of hits) if (now - v.start > RATE_WINDOW_MS) hits.delete(k);
    return false;
  }
  window.count += 1;
  return window.count > RATE_LIMIT;
}

// The site's own origin always counts as allowed, so the deployment (and every
// deploy preview) keeps working without configuration; ALLOWED_ORIGINS only has
// to name *additional* origins.
function isAllowed(origin, requestUrl) {
  if (!origin) return true;                       // non-browser or same-origin GET
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try { return origin === new URL(requestUrl).origin; } catch { return false; }
}

function corsHeaders(origin, requestUrl) {
  // Echo the origin only when it is one we allow, so a browser refuses to hand
  // another site the response.
  const headers = { Vary: "Origin" };
  if (origin && isAllowed(origin, requestUrl)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body, status, origin, requestUrl) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin, requestUrl) },
  });
}

/** Accept only well-formed, bounded conversation turns. */
function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return "messages must be a non-empty array";
  if (messages.length > MAX_TURNS) return `messages must contain at most ${MAX_TURNS} turns`;
  let chars = 0;
  for (const m of messages) {
    if (!m || typeof m !== "object") return "each message must be an object";
    if (m.role !== "user" && m.role !== "assistant") return "each message role must be 'user' or 'assistant'";
    if (typeof m.content !== "string" || m.content.length === 0) return "each message needs non-empty string content";
    chars += m.content.length;
  }
  if (chars > MAX_CHARS) return `conversation must be at most ${MAX_CHARS} characters`;
  return null;
}

export default async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders(origin, req.url),
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin, req.url);

  // A browser sends Origin on cross-site POSTs. Reject the ones we do not allow
  // rather than relying on the response header alone.
  if (!isAllowed(origin, req.url)) return json({ error: "Origin not allowed" }, 403, origin, req.url);

  const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "Service unavailable" }, 503, origin, req.url);

  const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "unknown";
  if (rateLimited(ip)) return json({ error: "Too many requests. Please wait a moment." }, 429, origin, req.url);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, origin, req.url);
  }

  const feature = FEATURES[body?.feature];
  if (!feature) return json({ error: "Unknown feature" }, 400, origin, req.url);

  const invalid = validateMessages(body?.messages);
  if (invalid) return json({ error: invalid }, 400, origin, req.url);

  // Build the upstream request from our own values only — nothing else from the
  // caller's body is forwarded.
  const payload = {
    model: "claude-opus-4-6",
    max_tokens: feature.maxTokens,
    system: feature.system,
    messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
  };

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      // Do not relay upstream error bodies: they can carry account and request detail.
      console.error("Anthropic API error", upstream.status, await upstream.text());
      return json({ error: "The assistant is unavailable right now." }, 502, origin, req.url);
    }

    const data = await upstream.json();
    return json({ content: data.content }, 200, origin, req.url);
  } catch (error) {
    console.error("chat proxy failure", error);
    return json({ error: "Failed to process request" }, 500, origin, req.url);
  }
};

export const config = {
  path: "/api/chat",
};
