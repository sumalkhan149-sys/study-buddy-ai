export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { topic, subject } = req.body || {};

    if (!topic) {
      return res.status(400).json({ error: "Topic missing" });
    }

    const prompt = `You are a Class 12 UP Board Hindi Medium + JEE study teacher.

Subject: ${subject || "General"}
Topic: ${topic}

Explain this topic in simple Hindi/Hinglish.

Give:
1. Concept
2. Important formulas
3. Symbols and meanings
4. One solved example
5. UP Board important points
6. JEE important points
7. Quick revision

Keep it accurate, concise and student-friendly.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini API error"
      });
    }

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "AI ne answer nahi diya.";

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
