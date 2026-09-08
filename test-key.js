import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

async function testKey() {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
  const apiKey = match ? match[1].trim() : '';
  
  const genAI = new GoogleGenerativeAI(apiKey);
  for (const modelName of ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-flash-latest", "gemini-pro-latest"]) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Give HTML code for an image tag with src attribute.");
      console.log(`Success with ${modelName}:`, result.response.text());
      return;
    } catch (e) {
      console.log(`Failed ${modelName}:`, e.message);
    }
  }
}

testKey();
