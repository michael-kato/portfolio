import { generateSessionHash } from './session.js';

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    const data = await request.json();
    const { prompt, timestamp } = data;

    const sessionHash = await generateSessionHash(request, data);

    if (!env.AI) {
      return new Response(JSON.stringify({ error: "Workers AI binding is missing" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    // Retrieve the large text from KV instead of environment variables
    let careerSecret = null;
    try {
      if (env.PORTFOLIO_KV) {
        careerSecret = await env.PORTFOLIO_KV.get("CAREER_OVERVIEW");
      }
    } catch (kvError) {
      console.error("KV Error:", kvError);
    }

    if (!careerSecret) {
      return new Response(JSON.stringify({ error: "Career data not found in KV" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Workers AI models, tried in order
    const modelsToTry = ["@cf/meta/llama-3.3-70b-instruct-fp8-fast", "@cf/meta/llama-4-scout-17b-16e-instruct"];
    let lastError = null;

    for (const currentModel of modelsToTry) {
      try {
        const result = await env.AI.run(currentModel, {
          messages: [
            {
              role: "system",
              content: `
                You are Michael's career advocate and technical interpreter.
                Your role is to help recruiters and hiring managers understand how Michael's real-world experience maps to new roles, especially when his background is unconventional or cross-disciplinary.

                Guidelines:
                - Be optimistic but grounded.
                - Do not exaggerate qualifications or invent experience.
                - Only claim a tool, language, engine, or skill if it appears in the career history below. If it does not appear, say plainly that Michael's history doesn't show it, then mention the closest related experience that does appear, if any. Never imply he has used something he hasn't.
                - Do not guess at dates, team sizes, metrics, titles, or employers that are not in the career history.
                - Clearly distinguish between:
                  - directly demonstrated experience
                  - transferable skills
                  - likely ramp-up areas
                - Emphasize systems thinking, automation, technical problem solving, operational reliability, performance engineering, tooling, cross-functional collaboration, and large-scale production support where relevant.
                - Recognize that game industry titles may understate technical scope.
                - Do not assume Michael is qualified for licensed engineering, medical, legal, civil infrastructure, or highly specialized regulated roles unless explicitly supported by the provided experience.
                - If there are meaningful gaps, explain them honestly while evaluating whether his underlying technical background suggests strong adaptability.
                - Prioritize practical evidence from shipped systems, production ownership, debugging complexity, and cross-team technical leadership over formal credentials alone.
                - Keep responses concise, direct, and recruiter-friendly.
                - Please do not use the term "technical artistry"
                - Stay focused on Michael's professional background. If asked about unrelated topics, redirect politely.
                - Speak conversationally, not like a recruiter or HR document.

                Use the provided career history to answer questions:
                ${careerSecret}
              `
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 700
        });

        const reply = typeof result?.response === "string" ? result.response.trim() : "";
        if (reply) {
          if (env.DB) {
            ctx.waitUntil(
              env.DB.prepare(
                "INSERT INTO chat_logs (prompt, reply, model) VALUES (?, ?, ?)"
              )
                .bind(prompt, reply, currentModel)
                .run()
                .catch(err => console.error(`[D1 Error] Failed to log chat: ${err.message}`))
            );
          } else {
            console.error("D1 Binding 'DB' not found.");
          }

          ctx.waitUntil(sendNotification(env, { prompt, reply, currentModel, sessionHash }));

          return new Response(JSON.stringify({ reply, modelUsed: currentModel }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        lastError = `Empty response from ${currentModel}`;
      } catch (err) {
        console.warn(`Model ${currentModel} failed: ${err.message}. Trying fallback...`);
        lastError = err.message;
      }
    }

    return new Response(JSON.stringify({ error: lastError || "Failed to connect to AI" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function sendNotification(env, data) {
  if (!env.EMAIL_API_KEY || !env.NOTIFICATION_EMAIL) return;
  const htmlTable = `
      <table border="1" cellpadding="5" style="border-collapse: collapse; font-family: sans-serif;">
        <tr><th colspan="2" style="background:#eee;">New Chatbot Usage</th></tr>
        <tr><td><strong>Model</strong></td><td>${data.currentModel}</td></tr>
        <tr><td><strong>Prompt</strong></td><td>${data.prompt.replace(/</g, "&lt;")}</td></tr>
        <tr><td><strong>Reply</strong></td><td>${data.reply.replace(/</g, "&lt;")}</td></tr>
      </table>
    `;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.EMAIL_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Portfolio <contact@michaelkato.work>',
      to: env.NOTIFICATION_EMAIL,
      subject: `Portfolio Activity [Session: ${data.sessionHash}]`,
      html: htmlTable
    })
  }).catch(console.error);
};