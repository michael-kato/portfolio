import { generateSessionHash } from './session.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {
      // GET: Fetch approved comments for a specific post
      if (url.pathname === '/comments' && request.method === 'GET') {
        const slug = url.searchParams.get('slug');
        if (!slug) return new Response('Missing slug', { status: 400, headers: corsHeaders });

        const { results } = await env.DB.prepare(
          "SELECT author, text, created_at FROM comments WHERE post_slug = ? AND is_approved = 1 ORDER BY created_at ASC"
        ).bind(slug).all();

        return Response.json(results, { headers: corsHeaders });
      }

      // POST: Submit a new comment (defaults to unapproved)
      if (url.pathname === '/comments' && request.method === 'POST') {
        const data = await request.json();
        const { slug, author, text } = data;
        if (!slug || !text) return new Response('Invalid data', { status: 400, headers: corsHeaders });

        const sessionHash = await generateSessionHash(request, data);

        await env.DB.prepare(
          "INSERT INTO comments (post_slug, author, text) VALUES (?, ?, ?)"
        ).bind(slug, author || 'Anonymous', text).run();

        // Email Notification Logic
        // You can use Resend, Mailgun, or Cloudflare's Email Routing if configured
        await this.sendNotification(env, { slug, author, text, sessionHash });

        return Response.json({ success: true }, { headers: corsHeaders });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  async sendNotification(env, comment) {
    if (!env.EMAIL_API_KEY) {
      console.warn("EMAIL_API_KEY is not defined. Skipping email notification.");
      return;
    }

    console.log(`Attempting to send email notification for post: ${comment.slug}`);
    // Example using Resend API to send a notification
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio <contact@michaelkato.work>',
        to: env.NOTIFICATION_EMAIL,
        subject: `New Comment from ID: ${comment.sessionHash}]`,
        text: `${comment.slug}\n\nFrom: ${comment.author}\n\n${comment.text}`
      })
    });

    if (response.ok) {
      console.log("Email notification sent successfully.");
    } else {
      const errorText = await response.text();
      console.error(`Failed to send email. Status: ${response.status}, Response: ${errorText}`);
    }
  }
};