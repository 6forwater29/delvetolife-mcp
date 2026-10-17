// Usage: node scripts/smoke-test.mjs [https://mcp.delvetolife.com/mcp]
// Without a URL, runs the worker in-process (Node 22+ for JSON import attributes via loader below).
import assert from 'node:assert/strict';

const target = process.argv[2];
let send;
if (target) {
  send = async (body) => {
    const r = await fetch(target, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify(body) });
    return { status: r.status, json: r.status === 202 ? null : await r.json() };
  };
} else {
  const { register } = await import('node:module');
  register('data:text/javascript,' + encodeURIComponent(`
    export async function load(url, ctx, next) {
      if (url.endsWith('.json')) return next(url, { ...ctx, importAttributes: { type: 'json' } });
      return next(url, ctx);
    }`));
  const worker = (await import('../src/index.js')).default;
  send = async (body) => {
    const r = await worker.fetch(new Request('https://mcp.delvetolife.com/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }));
    return { status: r.status, json: r.status === 202 ? null : await r.json() };
  };
}

let id = 0;
const rpc = async (method, params) => (await send({ jsonrpc: '2.0', id: ++id, method, params })).json;
const call = async (name, args) => (await rpc('tools/call', { name, arguments: args })).result;

const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '1' } });
assert.equal(init.result.serverInfo.name, 'delve-to-life');
assert.equal(init.result.protocolVersion, '2025-06-18');
assert.equal((await send({ jsonrpc: '2.0', method: 'notifications/initialized' })).status, 202);

const tools = (await rpc('tools/list')).result.tools.map((t) => t.name);
assert.deepEqual(tools, ['list_dress_codes', 'explain_dress_code', 'suggest_outfit', 'colour_combinations', 'search_guides']);

const ladder = await call('list_dress_codes', {});
assert.equal(ladder.structuredContent.ladder.length, 9);

for (const [q, want] of [['cocktail attire', 'cocktail'], ['Semi-formal', 'cocktail'], ['lounge suits', 'lounge-suits'], ['black tie optional', 'black-tie-optional'], ['Black Tie', 'black-tie'], ['smart casual', 'smart-casual'], ['white tie', 'white-tie'], ['business casual', 'business-casual']]) {
  const r = await call('explain_dress_code', { code: q });
  assert.equal(r.structuredContent.id, want, q);
}
assert.equal((await call('explain_dress_code', { code: 'pyjama party' })).isError, true);

const look = await call('suggest_outfit', { occasion: 'work', weather: 'wet', mood: 'easy' });
assert.equal(look.structuredContent.pieces.length, 5);
assert.match(look.structuredContent.adjust_in_studio, /occasion=work&weather=wet&mood=easy&utm_source=mcp/);

const olive = await call('colour_combinations', { colour: 'olive' });
assert.ok(olive.structuredContent.combinations.some((c) => c.colours.includes('olive')));
const blue = await call('colour_combinations', { colour: 'blue' });
assert.ok(blue.structuredContent.combinations.length >= 4);

const funeral = await call('search_guides', { query: 'what to wear to a funeral' });
assert.match(funeral.structuredContent.results[0].url, /what-to-wear-to-a-funeral/);
const wedding = await call('search_guides', { query: 'wedding guest outfit' });
assert.match(wedding.structuredContent.results[0].url, /wedding-guest-attire/);

assert.equal((await rpc('tools/call', { name: 'nope', arguments: {} })).error.code, -32602);
assert.equal((await rpc('bogus/method')).error.code, -32601);

console.log('ALL OK against', target || 'in-process worker');
console.log('\nSample suggest_outfit text:\n' + look.content[0].text);
console.log('\nSample explain_dress_code text:\n' + (await call('explain_dress_code', { code: 'lounge suits' })).content[0].text);
