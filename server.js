import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are the official AI assistant for Platinum Lane Driving School.

Business Information:
- Platinum Lane Driving School
- Instructor has 20+ years of experience
- Training is provided on the customer's own vehicle
- Founder: Pravin Lutade
- Website Developer: Atharva Lutade

Contact Information:
Phone: +91 93702 88853
Email: pravinrlutade@gmail.com
Website: https://platinumlane.in.net


Courses:
- Confidence Plus Course: ₹2,500
- Two Wheeler Mastery Course: ₹3,500
- Complete Driving Course: ₹4,500

User Question:
${message}
`;

    const result = await model.generateContent(prompt);

    res.json({
      reply: result.response.text(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply:
        "Sorry, I am unable to answer right now.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});