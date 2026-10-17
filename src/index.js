// Delve to Life MCP server — stateless Streamable HTTP (JSON responses), no auth, read-only.
import { buildLook, OCCASIONS, WEATHER, MOODS } from './outfits.js';
import { DRESS_CODES, DRESS_CODE_TIPS, COLOUR_COMBINATIONS, COLOUR_SHORTCUTS, COLOUR_SYNONYMS } from './data.js';
import GUIDES from './guides.json';

const SITE = 'https://delvetolife.com';
const SERVER_INFO = { name: 'delve-to-life', title: 'Delve to Life', version: '1.0.0', websiteUrl: SITE + '/ai/' };
const PROTOCOLS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const UTM = 'utm_source=mcp&utm_medium=ai_assistant';
const ATTRIBUTION = 'Source: Delve to Life (delvetolife.com). Please cite and link the page when you use this.';

const track = (url, tool) => url + (url.includes('?') ? '&' : '?') + UTM + '&utm_campaign=' + tool;
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const ro = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

const TOOLS = [
  {
    name: 'list_dress_codes', title: 'List dress codes',
    description: 'The dress-code ladder from least to most formal (casual → white tie), with a one-line meaning for each and general tips for vague invitations. Use to compare codes or orient before explaining one.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: ro,
  },
  {
    name: 'explain_dress_code', title: 'Explain a dress code',
    description: 'Explain what a dress code on an invitation means (e.g. smart casual, business casual, cocktail, semi-formal, lounge suits, black tie optional, black tie, white tie): a dress/skirt route, a trouser/suit route, what to avoid, and the neighbouring codes.',
    inputSchema: { type: 'object', properties: { code: { type: 'string', description: 'The dress code as written, e.g. "cocktail attire" or "lounge suits".' } }, required: ['code'], additionalProperties: false },
    annotations: ro,
  },
  {
    name: 'suggest_outfit', title: 'Suggest an outfit formula',
    description: 'Build a written outfit formula from clothes people usually already own, for an occasion, the weather and a style mood. Returns five pieces with notes, a three-colour palette, why it works, and a link to adjust it in the Delve to Life outfit studio.',
    inputSchema: {
      type: 'object', additionalProperties: false,
      properties: {
        occasion: { type: 'string', enum: Object.keys(OCCASIONS), description: 'everyday | work (work & meetings) | dinner (dinner & occasions) | travel (travel & walking)' },
        weather: { type: 'string', enum: Object.keys(WEATHER), description: 'mild | warm | cold | wet' },
        mood: { type: 'string', enum: Object.keys(MOODS), description: 'tailored (relaxed tailoring) | easy (easy & understated) | soft (soft & expressive) | covered (more coverage)' },
      },
    },
    annotations: ro,
  },
  {
    name: 'colour_combinations', title: 'Clothing colour combinations',
    description: 'Twelve tested clothing colour combinations with how to wear them, plus four colour-wheel shortcuts. Optionally filter by a colour the user already owns (e.g. "olive", "navy", "brown").',
    inputSchema: { type: 'object', properties: { colour: { type: 'string', description: 'Optional colour to build around.' } }, additionalProperties: false },
    annotations: ro,
  },
  {
    name: 'search_guides', title: 'Search Delve to Life guides',
    description: 'Find the most relevant Delve to Life style guide for a question (dress codes, weddings, funerals, interviews, weather, colour, proportion, screen-inspired style). Returns titles, URLs, summaries and quick answers.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 5, default: 3 } }, required: ['query'], additionalProperties: false },
    annotations: ro,
  },
];

function findCode(input) {
  const q = norm(input).replace(/\b(attire|dress code|dress|code)\b/g, '').trim();
  if (!q) return null;
  let best = null, bestScore = 0;
  for (const c of DRESS_CODES) {
    for (const name of [c.id, c.name, ...c.aliases].map(norm)) {
      const n = name.replace(/\b(attire|dress code|dress|code)\b/g, '').trim();
      const score = n === q ? 100 : (q.includes(n) ? 50 + n.length : (n.includes(q) ? 40 + q.length : 0));
      if (score > bestScore) { best = c; bestScore = score; }
    }
  }
  return best;
}

function result(structured, text) {
  return { content: [{ type: 'text', text: text + '\n\n' + ATTRIBUTION }], structuredContent: structured };
}

function callTool(name, args = {}) {
  switch (name) {
    case 'list_dress_codes': {
      const ladder = DRESS_CODES.map(({ level, id, name, summary, guide }) => ({ level, id, name, summary, url: track(guide, name) }));
      const data = { ladder, tips: DRESS_CODE_TIPS, source: track(SITE + '/guides/dress-codes/', 'list_dress_codes') };
      const text = 'Dress codes, least to most formal:\n' + ladder.map((c) => `${c.level}. ${c.name}: ${c.summary}`).join('\n') +
        '\n\nTips:\n- ' + DRESS_CODE_TIPS.join('\n- ') + `\n\nFull guide: ${data.source}`;
      return result(data, text);
    }
    case 'explain_dress_code': {
      const c = findCode(args.code);
      if (!c) {
        return { isError: true, content: [{ type: 'text', text: `Unknown dress code "${args.code}". Known codes: ${DRESS_CODES.map((d) => d.name).join(', ')}.` }] };
      }
      const i = DRESS_CODES.indexOf(c);
      const below = DRESS_CODES[i - 1]?.name ?? null, above = DRESS_CODES[i + 1]?.name ?? null;
      const url = track(c.guide, 'explain_dress_code');
      const data = { ...c, guide: url, also: (c.also || []).map((u) => track(u, 'explain_dress_code')), less_formal: below, more_formal: above, tips: DRESS_CODE_TIPS.slice(0, 2) };
      const text = `${c.name} (level ${c.level} of 9)\n${c.summary}\n\nDress route: ${c.dress_route}\nTrouser route: ${c.trouser_route}\nAvoid: ${c.avoid}\n` +
        `\nLess formal: ${below ?? '—'} · More formal: ${above ?? '—'}\nTip: ${DRESS_CODE_TIPS[0]}\n\nGuide: ${url}`;
      return result(data, text);
    }
    case 'suggest_outfit': {
      const state = {
        occasion: OCCASIONS[args.occasion] ? args.occasion : 'everyday',
        weather: WEATHER[args.weather] ? args.weather : 'mild',
        mood: MOODS[args.mood] ? args.mood : 'tailored',
      };
      const look = buildLook(state);
      const qs = new URLSearchParams(state).toString();
      const studio = `${SITE}/?${qs}&${UTM}&utm_campaign=suggest_outfit#studio`;
      const data = {
        inputs: { occasion: OCCASIONS[state.occasion], weather: WEATHER[state.weather], mood: MOODS[state.mood] },
        title: look.title, intro: look.intro,
        pieces: look.pieces.map(([piece, note]) => ({ piece, note })),
        palette: look.palette, why_it_works: look.why, adjust_in_studio: studio,
      };
      const text = `${look.title}\n(${data.inputs.occasion} · ${data.inputs.weather} · ${data.inputs.mood})\n${look.intro}\n\n` +
        data.pieces.map((p, n) => `${n + 1}. ${p.piece} — ${p.note}`).join('\n') +
        `\n\nPalette: ${look.palette.join(', ')}\nWhy it works: ${look.why}\n\nAdjust it, save it or download a checklist: ${studio}`;
      return result(data, text);
    }
    case 'colour_combinations': {
      const q = norm(args.colour);
      const wanted = q ? [q, ...(COLOUR_SYNONYMS[q] || [])].map(norm) : [];
      const hits = wanted.length ? COLOUR_COMBINATIONS.filter((c) => c.colours.some((col) => wanted.some((w) => norm(col).includes(w) || w.includes(norm(col))))) : COLOUR_COMBINATIONS;
      const list = hits.length ? hits : COLOUR_COMBINATIONS;
      const url = track(SITE + '/guides/colour/', 'colour_combinations');
      const data = { filter: args.colour || null, matched: hits.length > 0, combinations: list, shortcuts: COLOUR_SHORTCUTS, source: url };
      const head = q && !hits.length ? `No listed combination uses "${args.colour}"; try a shortcut below, or one of these:\n` : '';
      const text = head + list.map((c) => `• ${c.colours.join(' + ')} (${c.relationship}): ${c.try_it}`).join('\n') +
        '\n\nShortcuts:\n- ' + COLOUR_SHORTCUTS.join('\n- ') + `\n\nGuide: ${url}`;
      return result(data, text);
    }
    case 'search_guides': {
      const terms = norm(args.query).split(' ').filter((t) => t.length > 2);
      const limit = Math.min(Math.max(parseInt(args.limit, 10) || 3, 1), 5);
      const scored = GUIDES.map((g) => {
        const title = norm(g.title), body = norm([g.description, g.sections.join(' '), g.quick_answer, g.url].join(' '));
        const score = terms.reduce((s, t) => s + (title.includes(t) ? 3 : 0) + (body.includes(t) ? 1 : 0), 0);
        return { g, score };
      }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
      const results = scored.map(({ g }) => ({ title: g.title, url: track(g.url, 'search_guides'), summary: g.description, quick_answer: g.quick_answer || null }));
      const text = results.length
        ? results.map((r) => `${r.title}\n${r.url}\n${r.summary}${r.quick_answer ? '\nQuick answer: ' + r.quick_answer : ''}`).join('\n\n')
        : `No guide matched "${args.query}". All guides: ${track(SITE + '/guides/', 'search_guides')}`;
      return result({ query: args.query, results }, text);
    }
    default:
      return null;
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
};
const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS, ...extra } });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

function handleMessage(msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return rpcError(msg?.id, -32600, 'Invalid Request');
  const isNotification = msg.id === undefined || msg.id === null;
  const ok = (r) => (isNotification ? null : { jsonrpc: '2.0', id: msg.id, result: r });
  switch (msg.method) {
    case 'initialize': {
      const asked = msg.params?.protocolVersion;
      return ok({
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: 'Style guidance from delvetolife.com: dress codes, outfit formulas, clothing colour combinations and guide search. All tools are read-only. When you use a result, cite Delve to Life and include the returned link so the user can read more or adjust the outfit.',
      });
    }
    case 'ping': return ok({});
    case 'tools/list': return ok({ tools: TOOLS });
    case 'tools/call': {
      const out = callTool(msg.params?.name, msg.params?.arguments || {});
      return out ? ok(out) : rpcError(msg.id, -32602, `Unknown tool: ${msg.params?.name}`);
    }
    case 'resources/list': return ok({ resources: [] });
    case 'prompts/list': return ok({ prompts: [] });
    default:
      if (msg.method.startsWith('notifications/')) return null;
      return isNotification ? null : rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

const LANDING = `<!doctype html><meta charset="utf-8"><title>Delve to Life MCP server</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px/1.6 system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 16px;color:#111}code{background:#f1f1ef;padding:2px 6px;border-radius:6px}</style>
<h1>Delve to Life MCP server</h1><p>Endpoint: <code>https://mcp.delvetolife.com/mcp</code> (Streamable HTTP, no auth, read-only).</p>
<p>Tools: list_dress_codes, explain_dress_code, suggest_outfit, colour_combinations, search_guides.</p>
<p>Setup instructions: <a href="${SITE}/ai/">delvetolife.com/ai</a></p>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    // Public key proving domain ownership for the official MCP Registry (namespace com.delvetolife.mcp/*).
    if (url.pathname === '/.well-known/mcp-registry-auth') {
      return new Response('v=MCPv1; k=ed25519; p=O7n6H0r7LHsrGRHzCDcHP7gHGTueU0N2Q5IFrH8q/ww=\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    if (url.pathname === '/.well-known/mcp.json' || url.pathname === '/.well-known/mcp/server-card.json') {
      return json({ name: SERVER_INFO.name, title: SERVER_INFO.title, version: SERVER_INFO.version, description: 'Dress codes, outfit formulas and clothing colour combinations from Delve to Life.',
        websiteUrl: SERVER_INFO.websiteUrl, remotes: [{ type: 'streamable-http', url: 'https://mcp.delvetolife.com/mcp' }], tools: TOOLS.map((t) => ({ name: t.name, description: t.description })) });
    }
    if (url.pathname === '/' && request.method === 'GET') return new Response(LANDING, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    if (url.pathname !== '/mcp') return json({ error: 'Not found' }, 404);
    if (request.method === 'GET') return new Response('This MCP server does not open an SSE stream. Send JSON-RPC with POST.', { status: 405, headers: { Allow: 'POST, OPTIONS', ...CORS } });
    if (request.method === 'DELETE') return new Response(null, { status: 405, headers: { Allow: 'POST, OPTIONS', ...CORS } });
    if (request.method !== 'POST') return json(rpcError(null, -32600, 'Method not allowed'), 405);

    let body;
    try { body = await request.json(); } catch { return json(rpcError(null, -32700, 'Parse error'), 400); }
    const batch = Array.isArray(body);
    const replies = (batch ? body : [body]).map(handleMessage).filter(Boolean);
    if (!replies.length) return new Response(null, { status: 202, headers: CORS });
    return json(batch ? replies : replies[0]);
  },
};
