import { generateSessionHash } from './session.js';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST" || !new URL(request.url).pathname.endsWith("/api/analytics")) {
      return new Response("Not found", { status: 404 });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    };

    try {
      const rawBody = await request.text();
      const data = JSON.parse(rawBody);

      const rawIp = request.headers.get("cf-connecting-ip") || "";
      const asnOrg = request.cf?.asOrganization || "Unknown";
      const country = request.cf?.country || "";
      const city = request.cf?.city || "";

      const sessionHash = await generateSessionHash(request, data);

      const stmt = env.DB.prepare(`
        INSERT INTO analytics_events (
          session_id, url, referrer, user_agent, language, timezone,
          screen_res, device_memory, cores, conn_type, load_time_ms,
          ttfb_ms, max_scroll_depth, click_count,
          organization, country, city
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        sessionHash,
        data.url || null,
        data.referrer || null,
        data.userAgent || null,
        data.language || null,
        data.timezone || null,
        data.screenRes || null,
        data.deviceMemory || null,
        data.cores || null,
        data.connType || null,
        data.loadTimeMs || null,
        data.ttfbMs || null,
        data.maxScrollDepth || 0,
        data.clickCount || 0,
        asnOrg, country, city
      );

      await stmt.run();

      ctx.waitUntil(sendNotification(env, data, { sessionHash, asnOrg, country, city }));

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
  }
};

async function sendNotification(env, data, extra) {
  if (!env.EMAIL_API_KEY || !env.NOTIFICATION_EMAIL) return;
  const htmlTable = `
      <table border="1" cellpadding="5" style="border-collapse: collapse; font-family: sans-serif;">
        <tr><th colspan="2" style="background:#eee;">New Site Visitor</th></tr>
        <tr><td><strong>Session</strong></td><td>${extra.sessionHash}</td></tr>
        <tr><td><strong>URL</strong></td><td>${data.url}</td></tr>
        <tr><td><strong>Referrer</strong></td><td>${data.referrer || 'Direct'}</td></tr>
        <tr><td><strong>Organization</strong></td><td>${extra.asnOrg}</td></tr>
        <tr><td><strong>Location</strong></td><td>${extra.city || 'Unknown'}, ${extra.country || 'Unknown'}</td></tr>
        <tr><td><strong>Device</strong></td><td>${data.deviceMemory || '?'}GB, ${data.cores || '?'} cores</td></tr>
        <tr><td><strong>Screen</strong></td><td>${data.screenRes || 'Unknown'}</td></tr>
        <tr><td><strong>Connection</strong></td><td>${data.connType || 'Unknown'}</td></tr>
        <tr><td><strong>Load Time</strong></td><td>${data.loadTimeMs || 0}ms (TTFB: ${data.ttfbMs || 0}ms)</td></tr>
        <tr><td><strong>Scroll Depth</strong></td><td>${data.maxScrollDepth || 0}%</td></tr>
        <tr><td><strong>Clicks</strong></td><td>${data.clickCount || 0}</td></tr>
      </table>
    `;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.EMAIL_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Portfolio <contact@michaelkato.work>',
      to: env.NOTIFICATION_EMAIL,
      subject: `Portfolio Activity [Session: ${extra.sessionHash}]`,
      html: htmlTable
    })
  }).catch(console.error);
};