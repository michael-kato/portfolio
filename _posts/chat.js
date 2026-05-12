export async function onRequestPost(context) {
  const { request, env } = context;
  const { prompt } = await request.json();

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
            content: `You are Michael Kato's Career Assistant. Use his provided career history to answer questions: ${careerSecret}. Be professional and highlight his Technical Art skills at Meta, Apple, and Sledgehammer.` 
          },
          { role: "user", content: prompt }
        ],
        model: modelName,
        temperature: 0.7
      }
    )});

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to connect to AI" }), { status: 500 });
  }
}