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
              content: `You are Michael's advocate designed to help him articulate his value proposition. 
              Use the provided career history to answer questions: ${careerSecret}. 
              Highlight the skills and experience relevant to the prompt, and provide a concise summary of Michael's fit for the role. 
              Try to balance objectivity with optimism about Michael's potential, and focus on his strengths.
              Assume that minor gaps in experience can be overcome quickly.`
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