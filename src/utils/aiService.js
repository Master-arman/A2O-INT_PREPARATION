// Unified AI Service Provider with Serverless & Client-Side Provider Abstraction
import { compareOutputs, estimateComplexity } from './testRunner.js';

const VERIFIED_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest'
];

const getApiKey = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    }
  } catch {}
  return '';
};

/**
 * Generate a dynamic solution for a problem in the requested programming language
 */
export async function generateAiSolution({ question, language, starterCode }) {
  const targetLang = (language || 'javascript').toLowerCase();

  // 1. First attempt: Secure Vercel Serverless API Route
  try {
    const apiRes = await fetch('/api/generate-solution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: question.title,
        description: question.description,
        language: targetLang,
        starterCode,
        exampleInput: question.exampleInput,
        exampleOutput: question.exampleOutput,
        constraints: question.constraints
      })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.code) {
        return {
          code: data.code,
          explanation: data.explanation || 'Optimal algorithmic solution.',
          algorithm: data.algorithm || 'Optimized Approach',
          timeComplexity: data.timeComplexity || 'O(n)',
          spaceComplexity: data.spaceComplexity || 'O(1)'
        };
      }
    }
  } catch (backendErr) {
    console.warn('Backend serverless generation endpoint unavailable, using client provider:', backendErr.message);
  }

  // 2. Client-Side Fallback via configured VITE_GEMINI_API_KEY
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('AI API Key is missing. Please configure GEMINI_API_KEY or VITE_GEMINI_API_KEY.');
  }

  const prompt = `You are a Principal Software Engineer and Coding Interview Expert.
Write an optimal, production-grade, bug-free solution for this coding problem in ${targetLang}.

PROBLEM TITLE: ${question.title}
PROBLEM DESCRIPTION:
${question.description}

EXAMPLE INPUT: ${question.exampleInput}
EXAMPLE OUTPUT: ${question.exampleOutput}

REQUIRED STARTER SIGNATURE:
\`\`\`${targetLang}
${starterCode}
\`\`\`

REQUIREMENTS:
1. Return ONLY valid, complete, working ${targetLang} code matching the function signature.
2. Provide exact Time Complexity (e.g. O(n)) and Space Complexity (e.g. O(1)).
3. Provide a brief 2-sentence explanation of the algorithm approach.

Return ONLY a raw JSON object (no markdown, no \`\`\`json wrappers):
{
  "code": "string",
  "explanation": "string",
  "algorithm": "string",
  "timeComplexity": "string",
  "spaceComplexity": "string"
}`;

  for (const model of VERIFIED_MODELS) {
    try {
      const res = await fetch(
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

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText
        .replace(/^```json/im, '')
        .replace(/^```/im, '')
        .replace(/```$/im, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (parsed && parsed.code) {
        return {
          code: parsed.code,
          explanation: parsed.explanation || 'Optimal algorithmic solution.',
          algorithm: parsed.algorithm || 'Optimized Approach',
          timeComplexity: parsed.timeComplexity || 'O(n)',
          spaceComplexity: parsed.spaceComplexity || 'O(1)'
        };
      }
    } catch {
      continue;
    }
  }

  throw new Error('AI solution generation failed. Please click Retry.');
}

/**
 * Strict AI Judge for multi-language evaluation
 */
export async function evaluateCodeWithAI({ code, language, question, testCases }) {
  const targetLang = (language || 'javascript').toLowerCase();

  // 1. First attempt: Secure Vercel Serverless API Route
  try {
    const apiRes = await fetch('/api/evaluate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language: targetLang,
        title: question.title,
        description: question.description,
        testCases
      })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && typeof data.testsPassed === 'number') {
        return postProcessEvaluation(data, testCases);
      }
    }
  } catch (backendErr) {
    console.warn('Backend serverless judge endpoint unavailable, using client provider:', backendErr.message);
  }

  // 2. Client-Side Fallback via configured VITE_GEMINI_API_KEY
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.');
  }

  const testCasesFormatted = JSON.stringify(testCases.map((tc, idx) => ({
    id: tc.id || (idx + 1),
    title: tc.title || `Case ${idx + 1}`,
    input: tc.input,
    expectedOutput: tc.expectedOutput
  })), null, 2);

  const prompt = `You are an automated, strict Online Judge and Code Compiler (like LeetCode or HackerRank).
Evaluate the submitted code for this problem against the test cases.

PROBLEM TITLE: ${question.title}
PROBLEM DESCRIPTION:
${question.description}

TEST CASES:
${testCasesFormatted}

SUBMITTED LANGUAGE: ${targetLang}
USER CODE:
\`\`\`${targetLang}
${code}
\`\`\`

CRITICAL JUDGING RULES:
1. STRICT VERIFICATION: If code is incomplete, empty boilerplate, or has syntax errors, it must FAIL (status: "Compilation Error" or "Wrong Answer").
2. For each test case, execute the logic mentally and record actualOutput.
3. Compute realistic runtime (e.g. 38ms), memory (e.g. 39 MB), Time Complexity (e.g. O(n)), and Space Complexity (e.g. O(1)).

Return ONLY a raw JSON object (no markdown):
{
  "status": "Accepted" | "Wrong Answer" | "Compilation Error",
  "overallPassed": boolean,
  "testsPassed": number,
  "totalTests": ${testCases.length},
  "timeComplexity": "string",
  "spaceComplexity": "string",
  "runtime": "string",
  "memory": "string",
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

  for (const model of VERIFIED_MODELS) {
    try {
      const res = await fetch(
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

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText
        .replace(/^```json/im, '')
        .replace(/^```/im, '')
        .replace(/```$/im, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (parsed && typeof parsed.testsPassed === 'number' && Array.isArray(parsed.testCases)) {
        return postProcessEvaluation(parsed, testCases);
      }
    } catch {
      continue;
    }
  }

  throw new Error('AI Code Evaluator failed to execute. Falling back to local verification.');
}

/**
 * Post-processes AI evaluation to eliminate false negatives caused by string formatting
 */
function postProcessEvaluation(aiResult, originalTestCases) {
  let passedCount = 0;
  const processedCases = (aiResult.testCases || []).map((tc, idx) => {
    const orig = originalTestCases[idx] || {};
    const expected = orig.expectedOutput || tc.expectedOutput;
    const actual = tc.actualOutput;

    // Apply reliable normalization comparison
    const comparison = compareOutputs(actual, expected);
    const passed = comparison.passed || tc.passed === true;

    if (passed) passedCount++;

    return {
      id: tc.id || (idx + 1),
      title: tc.title || orig.title || `Case ${idx + 1}`,
      input: orig.input || tc.input,
      expectedOutput: expected,
      actualOutput: actual || (passed ? expected : 'No output'),
      passed,
      explanation: tc.explanation || orig.explanation || (passed ? 'Output verified successfully.' : 'Output mismatch.')
    };
  });

  const total = processedCases.length || originalTestCases.length;
  const isAccepted = passedCount === total;

  return {
    status: isAccepted ? 'Accepted' : (aiResult.status === 'Compilation Error' ? 'Compilation Error' : 'Wrong Answer'),
    overallPassed: isAccepted,
    testsPassed: passedCount,
    totalTests: total,
    timeComplexity: aiResult.timeComplexity && aiResult.timeComplexity !== 'N/A' ? aiResult.timeComplexity : 'O(n)',
    spaceComplexity: aiResult.spaceComplexity && aiResult.spaceComplexity !== 'N/A' ? aiResult.spaceComplexity : 'O(1)',
    runtime: aiResult.runtime || '36ms',
    memory: aiResult.memory || '39.1 MB',
    feedback: aiResult.feedback || (isAccepted ? 'All test cases passed successfully!' : 'Some test cases produced incorrect results.'),
    testCases: processedCases
  };
}
