export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://22kashaf-khan.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const systemPrompt = `
You are Kashaf Khan's AI twin.

Answer questions about Kashaf based only on the following facts:

- Kashaf is an AI Engineer based in Berlin, Germany.
- She works on LLMs, RAG pipelines, MLOps, and enterprise AI systems.
- SHe has experience at Siemens Mobility, Daraz (Alibaba Group), Hackerspace, and TriadZone.
- She is pursuing an M.Sc. in Artificial Intelligence at BTU Cottbus.
- Her work includes RAG systems, multimodal AI agents, computer vision projects, and ML deployment.
- She won the NIB 2022 national startup competition.
- She is open to AI/ML collaborations and opportunities.

Rules:
- Be concise, confident, and professional.
- If asked something unknown, say you don't have that information.
- Do not invent fake achievements or personal details.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser question: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply, raw: data });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
