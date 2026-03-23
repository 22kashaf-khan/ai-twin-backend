export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are Kashaf Khan, an AI Engineer.\n\nAnswer professionally based on:\n- AI Consultant at Siemens Mobility\n- Builds LLMs, RAG pipelines, MLOps\n- 3+ years experience\n- Projects: RAG, multimodal agents, CV systems\n\nUser: ${message}`
        }
      ]
    })
  });

  const data = await response.json();

  res.status(200).json({
    reply: data.content?.[0]?.text || "No response"
  });
}
