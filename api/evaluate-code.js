// Vercel Serverless Function: /api/evaluate-code
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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

  const { code, language, title, description, testCases } = req.body || {};

  if (!code) {
    return res.status(400).json({ error: 'Code is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'AI API key not configured on server.' 
    });
  }

  const targetLang = language || 'javascript';
  const testCasesStr = JSON.stringify(testCases || [], null, 2);

  const prompt = `You are a strict, precise Online Judge (like LeetCode).
Evaluate the submitted ${targetLang} code for this problem against the test cases.

PROBLEM TITLE: ${title || 'Coding Problem'}
PROBLEM DESCRIPTION:
${description || ''}

TEST CASES:
${testCasesStr}

SUBMITTED CODE:
\`\`\`${targetLang}
${code}
\`\`\`

JUDGING INSTRUCTIONS:
1. Examine code syntax, logic, and edge cases.
2. If code is empty, unaltered boilerplate, dummy return, or syntax error, mark status as "Compilation Error" or "Wrong Answer" and overallPassed as false.
3. For EACH test case in the list, trace the actual execution output.
4. Normalize output so that trivial whitespace differences do not cause false failures, but verify mathematical and logical correctness strictly.
5. Determine accurate Time and Space Complexity.

Return ONLY a raw JSON object (no markdown):
{
  "status": "Accepted" | "Wrong Answer" | "Compilation Error" | "Runtime Error",
  "overallPassed": boolean,
  "testsPassed": number,
  "totalTests": number,
  "timeComplexity": "string (e.g. O(n))",
  "spaceComplexity": "string (e.g. O(1))",
  "runtime": "string (e.g. 42ms)",
  "memory": "string (e.g. 38.4 MB)",
  "feedback": "string",
  "testCases": [
    {
      "id": 1,
      "title": "string",
      "input": "string",
      "expectedOutput": "string",
      "actualOutput": "string",
      "passed": boolean,
      "explanation": "string"
    }
  ]
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
              temperature: 0.1,
              maxOutputTokens: 2048
            }
          })
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText
        .replace(/^```json/im, '')
        .replace(/^```/im, '')
        .replace(/```$/im, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (parsed && typeof parsed.testsPassed === 'number' && Array.isArray(parsed.testCases)) {
        return res.status(200).json({
          success: true,
          ...parsed
        });
      }
    } catch {
      continue;
    }
  }

  return res.status(502).json({
    error: 'AI Judge temporarily unavailable.',
    canRetry: true
  });
}
