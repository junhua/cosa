import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../worker/index.js';
function db() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../drizzle/0000_delivery_test.sql',import.meta.url),'utf8'));
  return { prepare(query) { let args=[]; return { bind(...values) { args=values; return this; }, async first() { return sql.prepare(query).get(...args) || null; }, async run() { return sql.prepare(query).run(...args); } }; } };
}
test('completion is idempotent, wrong assignment is rejected, collection requires unlock and repeat uses a new cycle', async () => {
  const env={DB:db()};
  const base='https://example.test/api/staging/deliveries/FD-4821';
  const call=async (path,body)=>worker.fetch(new Request(base+path,body?{method:'POST',headers:{'Content-Type':'application/json','Origin':'http://localhost:8081'},body:JSON.stringify(body)}:{}),env);
  const input={booking:'CSA-0913',lockerId:'F03',requestId:'test-request-000000001'};
  assert.equal((await call('/complete',{...input,lockerId:'F04'})).status,400);
  const first=await (await call('/complete',input)).json();
  const cycleId=first.delivery.cycleId;
  assert.equal(first.delivery.status,'ready');
  assert.equal((await (await call('/complete',input)).json()).delivery.cycleId,cycleId);
  assert.equal((await call('/complete',{...input,requestId:'test-request-000000002'})).status,409);
  assert.equal((await call('/collect',{cycleId})).status,409);
  assert.equal((await call('/unlock',{cycleId:'stale'})).status,409);
  assert.equal((await (await call('/seen',{cycleId})).json()).delivery.notificationSeen,true);
  assert.equal((await (await call('/unlock',{cycleId})).json()).delivery.status,'unlocked');
  assert.equal((await (await call('/collect',{cycleId})).json()).delivery.status,'collected');
  assert.equal((await (await call('/complete',input)).json()).delivery.status,'collected');
  const next=await (await call('/complete',{...input,requestId:'test-request-000000002'})).json();
  assert.notEqual(next.delivery.cycleId,cycleId);
  assert.equal((await call('/collect',{cycleId})).status,409);
  assert.equal((await call('?booking=OTHER')).status,403);
  const blocked=await worker.fetch(new Request(base+'?booking=CSA-0913',{headers:{Origin:'https://not-figma.site'}}),env);
  assert.equal(blocked.status,403);
});
