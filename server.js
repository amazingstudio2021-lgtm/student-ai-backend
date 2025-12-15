import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/study-plan", (req, res) => {
  const { name, subjects, hours, examDate } = req.body;

  const plan = `
STUDENT STUDY PLAN

Name: ${name}
Subjects: ${subjects}
Daily Study Time: ${hours} hours
Exam Date: ${examDate}

Daily Routine:
- Morning: Concept study
- Afternoon: Practice
- Evening: Revision
- Sunday: Weekly test
  `;

  res.json({ plan });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
