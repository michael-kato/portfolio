export default {
  async fetch(request, env, ctx) {
    const allowedOrigins = [
      "https://michael-kato.github.io",
      "http://127.0.0.1:4000" // Add your local development URL here
    ];

    const requestOrigin = request.headers.get("Origin");
    let corsAllowOrigin = "https://michael-kato.github.io"; // Default to production origin

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      corsAllowOrigin = requestOrigin;
    }

    // Define CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": corsAllowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
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
    const careerSecret = await env.PORTFOLIO_KV.get("CAREER_OVERVIEW");
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
              content: `You are Michael's Career Assistant. Use his provided career history to answer questions: ${careerSecret}. Be professional and highlight his skills and experience.`
            },
            { role: "user", content: prompt }
          ],
          model: modelName,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return new Response(JSON.stringify({ error: error.message || "AI API Error" }), { 
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