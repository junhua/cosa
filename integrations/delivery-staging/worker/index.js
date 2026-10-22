const order = 'FD-4821';
function allowed(origin) {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return (url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname) && url.port === '8081') ||
      (url.protocol === 'https:' && (url.hostname === 'www.figma.com' || url.hostname.endsWith('.figma.site') || url.hostname === 'cosahub-delivery-staging.aiitpelective2005.chatgpt.site'));
  } catch { return false; }
}
function view(row) {
  return row ? { deliveryId: order, booking: 'CSA-0913', lockerId: 'F03', reference: order, cycleId: row.cycle_id, status: row.status, deliveredAt: row.delivered_at, notificationSeen: !!row.seen_at } : null;
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = { 'Content-Type':'application/json', 'Cache-Control':'no-store', 'Vary':'Origin', 'Access-Control-Allow-Methods':'GET,POST,OPTIONS', 'Access-Control-Allow-Headers':'Content-Type', 'Access-Control-Max-Age':'600', ...(origin && allowed(origin) ? {'Access-Control-Allow-Origin':origin} : {}) };
    const reply = (body, status=200) => new Response(JSON.stringify(body), {status,headers});
    if (!allowed(origin)) return reply({error:'Origin not allowed'},403);
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/health') return reply({service:'CosaHub delivery staging', simulation:true, deliveryId:order, booking:'CSA-0913', lockerId:'F03'});
    const match = url.pathname.match(/^\/api\/staging\/deliveries\/FD-4821(?:\/(complete|seen|unlock|collect))?$/);
    if (!match) return reply({error:'Only the fixed staging delivery is supported'},404);
    const action = match[1];
    if ((!action && request.method !== 'GET') || (action && request.method !== 'POST')) return reply({error:'Method not allowed'},405);
    if (!env.DB) return reply({error:'Staging database unavailable'},503);
    try {
      const read = () => env.DB.prepare('SELECT * FROM delivery_test WHERE id = ?').bind(order).first();
      if (!action) {
        if (url.searchParams.get('booking') !== 'CSA-0913') return reply({error:'Unknown test booking'},403);
        return reply({delivery:view(await read())});
      }
      if (Number(request.headers.get('content-length') || 0) > 2048) return reply({error:'Request too large'},413);
      const raw = await request.text();
      if (raw.length > 2048) return reply({error:'Request too large'},413);
      let body;
      try { body = JSON.parse(raw); } catch { return reply({error:'Invalid JSON'},400); }
      const now = new Date().toISOString();
      if (action === 'complete') {
        if (body.booking !== 'CSA-0913' || body.lockerId !== 'F03' || typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(body.requestId)) return reply({error:'Invalid staging assignment'},400);
        const cycle = crypto.randomUUID();
        await env.DB.prepare("INSERT INTO delivery_test(id,request_id,cycle_id,status,delivered_at) VALUES(?,?,?,'ready',?) ON CONFLICT(id) DO UPDATE SET request_id=excluded.request_id,cycle_id=excluded.cycle_id,status='ready',delivered_at=excluded.delivered_at,seen_at=NULL,collected_at=NULL WHERE delivery_test.status='collected' AND delivery_test.request_id <> excluded.request_id").bind(order,body.requestId,cycle,now).run();
        const row = await read();
        if (row.request_id !== body.requestId) return reply({error:'The previous delivery is still awaiting collection. Collect it in CosaHub before starting another.'},409);
        return reply({delivery:view(row)});
      }
      if (typeof body.cycleId !== 'string') return reply({error:'Delivery cycle required'},400);
      const row = await read();
      if (!row || row.cycle_id !== body.cycleId) return reply({error:'Delivery changed. Refresh and try again.'},409);
      if (action === 'seen') await env.DB.prepare('UPDATE delivery_test SET seen_at = COALESCE(seen_at,?) WHERE id=? AND cycle_id=?').bind(now,order,body.cycleId).run();
      if (action === 'unlock') {
        if (row.status === 'collected') return reply({error:'Delivery already collected'},409);
        await env.DB.prepare("UPDATE delivery_test SET status='unlocked' WHERE id=? AND cycle_id=? AND status='ready'").bind(order,body.cycleId).run();
      }
      if (action === 'collect') {
        if (row.status === 'ready') return reply({error:'Unlock the assigned locker first'},409);
        await env.DB.prepare("UPDATE delivery_test SET status='collected',collected_at=? WHERE id=? AND cycle_id=? AND status='unlocked'").bind(now,order,body.cycleId).run();
      }
      return reply({delivery:view(await read())});
    } catch { return reply({error:'Delivery service unavailable. Please retry.'},503); }
  }
};
