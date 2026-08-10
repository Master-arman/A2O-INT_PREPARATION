import { GoogleGenerativeAI } from '@google/generative-ai';

async function testKey() {
  const apiKey = 'AQ.Ab8RN6ILBx_MuTHepcmcJOgboDmVi74-AjbXJGLHbkP_l7SKHw'; // Note: User's exact key!
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  
  const historyText = 'None';
  
  const prompt = `You are an expert technical interviewer. Generate a new, unique algorithmic coding interview question.
  It MUST NOT be any of the following previously asked questions (by title/topic): ${historyText}.
  
  Return ONLY a raw JSON object (without markdown code blocks like \`\`\`json) with the exact following structure:
  {
    "id": "A unique ID string (e.g. Q7, Q8)",
    "title": "Question Title",
    "difficulty": "Easy, Medium, or Hard",
    "topic": "The main topic (e.g., Two Pointers, Dynamic Programming)",
    "description": "Full problem description",
    "exampleInput": "Example input",
    "exampleOutput": "Example output",
    "explanation": "Brief explanation of the example",
    "hint": "A helpful hint for the user",
    "boilerplates": {
      "javascript": "function solve() {\\n  // Write your code here\\n}",
      "python": "class Solution:\\n    def solve(self):\\n        # Write your code here\\n        pass",
      "java": "class Solution {\\n    public void solve() {\\n        // Write your code here\\n    }\\n}",
      "cpp": "class Solution {\\npublic:\\n    void solve() {\\n        // Write your code here\\n    }\\n}"
    }
  }`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    console.log("RAW TEXT:\n", text);
    
    text = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    
    const newQuestion = JSON.parse(text);
    console.log("Parsed JSON:", newQuestion.title);
  } catch (error) {
    console.error("Error:", error);
  }
}

testKey();
