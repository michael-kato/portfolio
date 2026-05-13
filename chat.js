export default {
  async fetch(request, env, ctx) {
    // Define CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://michael-kato.github.io",
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
      return new Response('Method not allowed', { status: 405 });
    }

    const { prompt, timestamp } = await request.json();

    const token = env.GITHUB_TOKEN;
    const careerSecret = env.CAREER_OVERVIEW;
    const modelName = "gpt-4o-mini";

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
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
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