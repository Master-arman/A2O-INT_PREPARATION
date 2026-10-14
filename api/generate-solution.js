// Vercel Serverless Function: /api/generate-solution
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { title, description, language, starterCode, exampleInput, exampleOutput, constraints } = req.body || {};

  if (!title && !description) {
    return res.status(400).json({ error: 'Problem title or description is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'AI API key not configured on server.',
      hint: 'Configure GEMINI_API_KEY or AI_API_KEY in your Vercel project environment variables.' 
    });
  }

  const targetLang = language || 'javascript';
  const prompt = `You are a Principal Software Engineer and Coding Interview Expert.
Generate an optimal, production-grade, bug-free solution for this coding problem in ${targetLang}.

PROBLEM TITLE: ${title || 'Coding Problem'}
PROBLEM DESCRIPTION:
${description}

CONSTRAINTS & EXAMPLES:
Input Example: ${exampleInput || 'Standard input'}
Output Example: ${exampleOutput || 'Expected output'}
${constraints ? 'Constraints: ' + constraints : ''}

REQUIRED FUNCTION SIGNATURE / STARTER BOILERPLATE:
\`\`\`${targetLang}
${starterCode || ''}
\`\`\`

REQUIREMENTS:
1. Generate the exact complete, optimal working function matching the starter signature.
2. The function MUST accept the input parameters defined by the problem, compute the solution algorithmically, and RETURN the final result.
3. Calculate accurate Time Complexity (e.g. O(n), O(n log n)) and Space Complexity (e.g. O(1), O(n)).
4. Provide a clear, concise 2-sentence explanation of the algorithm approach.

Return ONLY a raw JSON object with NO markdown formatting, NO \`\`\`json wrappers:
{
  "code": "string (the complete working solution)",
  "explanation": "string (brief approach explanation)",
  "algorithm": "string (e.g., Two Pointers, Hash Map, Kadane's Algorithm)",
  "timeComplexity": "string (e.g., O(n))",
  "spaceComplexity": "string (e.g., O(1))"
}`;

  const modelCandidates = [
    'gemini-3.5-flash-lite',
    'gemini-3-flash-preview',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-flash-latest'
  ];

  for (const model of modelCandidates) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048
            }
          })
        }
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText
        .replace(/^```json/im, '')
        .replace(/^```/im, '')
        .replace(/```$/im, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (parsed && parsed.code) {
        return res.status(200).json({
          success: true,
          code: parsed.code,
          explanation: parsed.explanation || 'Optimal algorithmic solution.',
          algorithm: parsed.algorithm || 'Optimized Approach',
          timeComplexity: parsed.timeComplexity || 'O(n)',
          spaceComplexity: parsed.spaceComplexity || 'O(1)',
          modelUsed: model
        });
      }
    } catch {
      continue;
    }
  }

  return res.status(502).json({
    error: 'AI service temporarily unavailable. Please try again.',
    canRetry: true
  });
}
