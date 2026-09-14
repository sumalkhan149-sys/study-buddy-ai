export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { topic, subject } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic missing" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-mini",
        input: `You are a Class 12 UP Board Hindi Medium + JEE study teacher.

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

Keep it accurate and student-friendly.`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI API error"
      });
    }

    return res.status(200).json({
      answer: data.output_text
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
