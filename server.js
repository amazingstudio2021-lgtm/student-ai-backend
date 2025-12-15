import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/study-plan", async (req, res) => {
  try {
    const { name, subjects, hours, examDate } = req.body;

    const prompt = `
You are an expert academic mentor.

Create a WEEKLY STUDY PLAN for a student with details:
Name: ${name}
Subjects: ${subjects}
Daily study hours: ${hours}
Exam date: ${examDate}

Requirements:
- Weekly breakdown (Mon–Sun)
- Daily time blocks
- Revision strategy
- Simple language
- Practical and stress-free
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a student productivity coach." },
        { role: "user", content: prompt }
      ]
    });

    const plan = completion.choices[0].message.content;

    res.json({ plan });

  } catch (error) {
    res.status(500).json({ error: "AI generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
