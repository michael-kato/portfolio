export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    // GET: Fetch approved comments for a specific post
    if (url.pathname === '/comments' && request.method === 'GET') {
      const slug = url.searchParams.get('slug');
      if (!slug) return new Response('Missing slug', { status: 400 });
      
      const { results } = await env.DB.prepare(
        "SELECT author, text, created_at FROM comments WHERE post_slug = ? AND is_approved = 1 ORDER BY created_at ASC"
      ).bind(slug).all();
      
      return Response.json(results, { headers: corsHeaders });
    }

    // POST: Submit a new comment (defaults to unapproved)
    if (url.pathname === '/comments' && request.method === 'POST') {
      const { slug, author, text } = await request.json();
      if (!slug || !text) return new Response('Invalid data', { status: 400 });

      await env.DB.prepare(
        "INSERT INTO comments (post_slug, author, text) VALUES (?, ?, ?)"
      ).bind(slug, author || 'Anonymous', text).run();

      // Email Notification Logic
      // You can use Resend, Mailgun, or Cloudflare's Email Routing if configured
      await this.sendNotification(env, { slug, author, text });

      return Response.json({ success: true }, { headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404 });
  },

  async sendNotification(env, comment) {
    if (!env.EMAIL_API_KEY) return;

    // Example using Resend API to send a notification
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio <contact@michaelkato.work>',
        to: env.NOTIFICATION_EMAIL,
        subject: `New Comment on: ${comment.slug}`,
        text: `From: ${comment.author}\n\n${comment.text}`
      })
    });
  }
};