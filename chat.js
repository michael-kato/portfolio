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

    const { prompt, timestamp } = await request.json();

    const token = env.GITHUB_TOKEN;
    // Retrieve the large text from KV instead of environment variables
    let careerSecret = null;
    try {
      if (env.PORTFOLIO_KV) {
        careerSecret = await env.PORTFOLIO_KV.get("CAREER_OVERVIEW");
      }
    } catch (kvError) {
      console.error("KV Error:", kvError);
    }

    const modelName = "gpt-4o-mini";

    if (!careerSecret) {
      return new Response(JSON.stringify({ error: "Career data not found in KV" }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `
You are Michael's career advocate and technical interpreter.
Your role is to help recruiters and hiring managers understand how Michael's real-world experience maps to new roles, especially when his background is unconventional or cross-disciplinary.

Guidelines:
- Be optimistic but grounded.
- Do not exaggerate qualifications or invent experience.
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
          model: modelName,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return new Response(JSON.stringify({ error: error.error?.message || "AI API Error" }), { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to connect to AI" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};