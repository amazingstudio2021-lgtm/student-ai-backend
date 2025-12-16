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
    const {
      name,
      studentClass,
      subjects,
      syllabus,
      hours,
      examDate
    } = req.body;

    const prompt = `
You are an experienced academic mentor and student counsellor.

STUDENT DETAILS:
Name: ${name}
Class / Year: ${studentClass}
Subjects: ${subjects}
Weak Areas / Syllabus Notes: ${syllabus}
Daily Study Hours Available: ${hours}
Exam Date: ${examDate}

TASK 1:
Create a practical, stress-free WEEKLY STUDY PLAN tailored to this student.

TASK 2:
Give PERSONALIZED STUDENT ADVICE in EXACTLY 3 PARAGRAPHS.
Rules:
- Address the student by name
- Consider time remaining for the exam
- Consider daily study capacity
- Be motivating but realistic
- Avoid generic advice
- Keep tone supportive and calm

FORMAT YOUR RESPONSE STRICTLY AS:

STUDY_PLAN:
<study plan text>

STUDENT_ADVICE:
<paragraph 1>

<paragraph 2>

<paragraph 3>
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You guide students with clarity, empathy, and practicality." },
        { role: "user", content: prompt }
      ]
    });

    const aiText = completion.choices[0].message.content;

    res.json({ plan: aiText });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
