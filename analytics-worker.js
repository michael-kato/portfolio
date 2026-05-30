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
      
      const ip = request.headers.get("cf-connecting-ip") || "";
      const country = request.cf?.country || "";
      const city = request.cf?.city || "";
      const latitude = request.cf?.latitude || null;
      const longitude = request.cf?.longitude || null;

      const stmt = env.DB.prepare(`
        INSERT INTO analytics_events (
          session_id, url, referrer, user_agent, language, timezone,
          screen_res, device_memory, cores, conn_type, load_time_ms,
          ttfb_ms, max_scroll_depth, click_count,
          ip_address, country, city, latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.sessionId || null,
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
        ip, country, city, latitude, longitude
      );

      await stmt.run();

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
  }
};
