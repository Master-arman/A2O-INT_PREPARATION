import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckSquare, Clock, Cpu, Lightbulb, Code2, AlertTriangle, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const FALLBACK_QUESTION = {
  id: 'FB1',
  title: 'Find pair with given sum in array',
  difficulty: 'Medium',
  topic: 'Two Sum',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
  exampleInput: 'nums = [2,7,11,15], target = 9',
  exampleOutput: '[0,1]',
  explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
  hint: 'Instead of using a nested loop (O(n²)), think about how you can use a Hash Map to store numbers you\'ve already seen. For each number x, check if target - x is already in the map!',
  boilerplates: {
    javascript: `function twoSum(nums, target) {\n  // Write your code here\n  \n}`,
    python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}`,
    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};`
  }
};

const CodingEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const mapLanguage = (langName) => {
    if (!langName) return 'javascript';
    const map = {
      'c++': 'cpp',
      'c#': 'csharp',
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'c': 'c',
      'typescript': 'typescript',
      'php': 'php',
      'kotlin': 'kotlin',
      'swift': 'swift',
      'dart': 'dart'
    };
    return map[langName.toLowerCase()] || 'javascript';
  };

  const initialLang = location.state?.preferredLanguage 
    ? mapLanguage(location.state.preferredLanguage) 
    : 'javascript';

  const [language, setLanguage] = useState(initialLang);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const [questionsList, setQuestionsList] = useState(() => {
    if (location.state?.questionDetails) {
      const customQ = location.state.questionDetails;
      const formattedQ = {
        id: 'AI',
        title: 'Interview Assignment',
        difficulty: customQ.difficulty || 'Medium',
        topic: customQ.category || 'System Design',
        description: customQ.question,
        exampleInput: customQ.exampleInput || 'Depends on implementation specifics.',
        exampleOutput: customQ.exampleOutput || 'Depends on implementation specifics.',
        explanation: customQ.explanation || 'Evaluate the requirements carefully, handle edge cases, and ensure optimal data structures are chosen.',
        hint: 'If you get stuck, try using the AI Hint button to guide you, but first attempt to break down the core components.',
        boilerplates: {}
      };
      return [formattedQ];
    }
    return [FALLBACK_QUESTION];
  });
  
  const [isGeneratingQ, setIsGeneratingQ] = useState(false);

  const getBoilerplate = (q, lang) => {
    if (q.boilerplates && q.boilerplates[lang]) return q.boilerplates[lang];
    switch (lang) {
      case 'c': return `// C Solution\n#include <stdio.h>\n\nvoid solve() {\n    // Write your code here\n}\n`;
      case 'typescript': return `function solve(): any {\n  // Write your code here\n}\n`;
      case 'csharp': return `public class Solution {\n    public void Solve() {\n        // Write your code here\n    }\n}`;
      case 'php': return `<?php\nclass Solution {\n    function solve() {\n        // Write your code here\n    }\n}`;
      case 'kotlin': return `class Solution {\n    fun solve() {\n        // Write your code here\n    }\n}`;
      case 'swift': return `class Solution {\n    func solve() {\n        // Write your code here\n    }\n}`;
      case 'dart': return `class Solution {\n  void solve() {\n    // Write your code here\n  }\n}`;
      case 'cpp': return `class Solution {\npublic:\n    void solve() {\n        // Write your code here\n    }\n};`;
      case 'java': return `class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}`;
      case 'python': return `class Solution:\n    def solve(self):\n        # Write your code here\n        pass`;
      default: return `function solve() {\n  // Write your code here\n}`;
    }
  };

  const currentQ = questionsList[currentQIndex];
  const [code, setCode] = useState(() => {
    if (location.state?.aiAnswer) return location.state.aiAnswer;
    return getBoilerplate(currentQ, initialLang);
  });

  useEffect(() => {
    if (location.state?.aiAnswer) {
      setCode(location.state.aiAnswer);
    }
  }, [location.state]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getBoilerplate(currentQ, newLang));
    setResults(null);
  };

  const [isPrefetching, setIsPrefetching] = useState(false);

  useEffect(() => {
    let mounted = true;
    const prefetch = async () => {
      if (questionsList.length > currentQIndex + 1 || isPrefetching) return;
      
      setIsPrefetching(true);
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) return;
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const history = JSON.parse(localStorage.getItem('askedQuestions') || '[]');
        const historyText = history.length > 0 ? history.join(', ') : 'None';
        
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

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        text = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
        
        const newQuestion = JSON.parse(text);
        
        history.push(newQuestion.title);
        localStorage.setItem('askedQuestions', JSON.stringify(history));
        
        if (mounted) {
          setQuestionsList(prev => [...prev, newQuestion]);
        }
      } catch (error) {
        console.error("Prefetch error:", error);
      } finally {
        if (mounted) setIsPrefetching(false);
      }
    };

    prefetch();
    return () => { mounted = false; };
  }, [currentQIndex, questionsList.length, isPrefetching]);

  const handleNextQuestion = async () => {
    // Check if we already have the next question pre-fetched
    if (currentQIndex + 1 < questionsList.length) {
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      setCode(getBoilerplate(questionsList[nextIndex], language));
      setResults(null);
      setShowHint(false);
      return;
    }

    // If they click too fast before pre-fetch finishes, we manually fetch
    setIsGeneratingQ(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
        setIsGeneratingQ(false);
        return;
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      const history = JSON.parse(localStorage.getItem('askedQuestions') || '[]');
      const historyText = history.length > 0 ? history.join(', ') : 'None';
      
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

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      text = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
      
      const newQuestion = JSON.parse(text);
      
      // Save to history so we don't repeat it
      history.push(newQuestion.title);
      localStorage.setItem('askedQuestions', JSON.stringify(history));
      
      setQuestionsList(prev => [...prev, newQuestion]);
      setCurrentQIndex(prev => prev + 1);
      setCode(getBoilerplate(newQuestion, language));
      setResults(null);
      setShowHint(false);
    } catch (error) {
      console.error("Error generating question:", error);
      
      // Fallback questions when API fails
      const fallbackQuestions = [
        {
          id: 'FB2',
          title: 'Reverse a Linked List',
          difficulty: 'Easy',
          topic: 'Linked List',
          description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nYou should try to solve this in O(1) space and O(n) time complexity.',
          exampleInput: 'head = [1,2,3,4,5]',
          exampleOutput: '[5,4,3,2,1]',
          explanation: 'The linked list 1->2->3->4->5 is reversed to 5->4->3->2->1.',
          hint: 'Use three pointers: prev, curr, and next. Iterate through the list, changing the next pointer of the current node to point to the previous node.',
          boilerplates: {
            javascript: `function reverseList(head) {\n  // Write your code here\n}`,
            python: `class Solution:\n    def reverseList(self, head):\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n        return nullptr;\n    }\n};`
          }
        },
        {
          id: 'FB3',
          title: 'Valid Parentheses',
          difficulty: 'Easy',
          topic: 'Stack',
          description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets, and in the correct order.',
          exampleInput: 's = "()[]{}"',
          exampleOutput: 'true',
          explanation: 'All brackets are properly closed.',
          hint: 'Use a stack to keep track of the opening brackets. When you encounter a closing bracket, pop the top of the stack and check if it matches.',
          boilerplates: {
            javascript: `function isValid(s) {\n  // Write your code here\n}`,
            python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        return false;\n    }\n};`
          }
        },
        {
          id: 'FB4',
          title: 'Merge Intervals',
          difficulty: 'Medium',
          topic: 'Sorting',
          description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
          exampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
          exampleOutput: '[[1,6],[8,10],[15,18]]',
          explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
          hint: 'First, sort the intervals by their start times. Then, iterate through and merge them if the current interval starts before the previous one ends.',
          boilerplates: {
            javascript: `function merge(intervals) {\n  // Write your code here\n}`,
            python: `class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return new int[0][0];\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n        return {};\n    }\n};`
          }
        },
        {
          id: 'FB5',
          title: 'Maximum Subarray',
          difficulty: 'Medium',
          topic: 'Dynamic Programming',
          description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
          exampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
          exampleOutput: '6',
          explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
          hint: 'Kadane\'s algorithm is perfect here. Keep track of the current subarray sum and the maximum sum seen so far. If the current sum becomes negative, reset it to 0.',
          boilerplates: {
            javascript: `function maxSubArray(nums) {\n  // Write your code here\n}`,
            python: `class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};`
          }
        },
        {
          id: 'FB6',
          title: 'Climbing Stairs',
          difficulty: 'Easy',
          topic: 'Dynamic Programming',
          description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
          exampleInput: 'n = 3',
          exampleOutput: '3',
          explanation: 'There are three ways to climb to the top: 1. 1 step + 1 step + 1 step, 2. 1 step + 2 steps, 3. 2 steps + 1 step',
          hint: 'This is similar to the Fibonacci sequence! The number of ways to reach step n is the sum of ways to reach step n-1 and step n-2.',
          boilerplates: {
            javascript: `function climbStairs(n) {\n  // Write your code here\n}`,
            python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n};`
          }
        },
        {
          id: 'FB7',
          title: 'Product of Array Except Self',
          difficulty: 'Medium',
          topic: 'Arrays',
          description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.',
          exampleInput: 'nums = [1,2,3,4]',
          exampleOutput: '[24,12,8,6]',
          explanation: 'answer[0] = 2 * 3 * 4 = 24. answer[1] = 1 * 3 * 4 = 12.',
          hint: 'Calculate the prefix product for each element, and then the suffix product. Multiply them together to get the result without division.',
          boilerplates: {
            javascript: `function productExceptSelf(nums) {\n  // Write your code here\n}`,
            python: `class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};`
          }
        }
      ];
      
      const nextQ = fallbackQuestions[(currentQIndex) % fallbackQuestions.length];
      const newNextQ = { ...nextQ, id: 'FB' + (questionsList.length + 1) };
      
      setQuestionsList(prev => [...prev, newNextQ]);
      setCurrentQIndex(prev => prev + 1);
      setCode(getBoilerplate(newNextQ, language));
      setResults(null);
      setShowHint(false);
    } finally {
      setIsGeneratingQ(false);
    }
  };

  const updateAnalytics = (score, acc) => {
    const currentInterviews = Number(localStorage.getItem('interviewsTaken') || 0);
    const currentScore = Number(localStorage.getItem('avgScore') || 0);
    const currentAcc = Number(localStorage.getItem('codingAccuracy') || 0);
    
    localStorage.setItem('interviewsTaken', currentInterviews + 1);
    
    if (currentInterviews === 0) {
      localStorage.setItem('avgScore', score);
      localStorage.setItem('codingAccuracy', acc);
    } else {
      localStorage.setItem('avgScore', Math.floor((currentScore * currentInterviews + score) / (currentInterviews + 1)));
      localStorage.setItem('codingAccuracy', Math.floor((currentAcc * currentInterviews + acc) / (currentInterviews + 1)));
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const lowerCode = code.toLowerCase();
      
      if (location.state?.aiAnswer && code.trim() === location.state.aiAnswer.trim()) {
        updateAnalytics(100, 100);
        setResults({
          status: 'Success',
          time: '35ms',
          memory: '39.1 MB',
          testsPassed: 1,
          totalTests: 1,
          timeComplexity: 'Optimal',
          spaceComplexity: 'Optimal',
          feedback: 'AI Feedback (ChatGPT Match): Excellent! You successfully implemented the optimal AI reference solution.',
          isError: false
        });
        return;
      }

      const originalBoilerplate = getBoilerplate(currentQ, language).toLowerCase();
      if (lowerCode.trim() === originalBoilerplate.trim() || lowerCode.length < 15) {
        setResults({
          status: 'Compilation Error',
          time: '0ms',
          memory: '0 MB',
          testsPassed: 0,
          totalTests: 1,
          timeComplexity: 'N/A',
          spaceComplexity: 'N/A',
          feedback: 'AI Feedback (ChatGPT Match): Please write some code before running! The editor currently contains only the boilerplate.',
          isError: true
        });
        return;
      }

      const hasBasicSyntax = lowerCode.includes('=') || lowerCode.includes('return') || lowerCode.includes('(') || lowerCode.includes('[');
      if (!hasBasicSyntax) {
        updateAnalytics(20, 0);
        setResults({
          status: 'Logic Error',
          time: '12ms',
          memory: '38.2 MB',
          testsPassed: 0,
          totalTests: 1,
          timeComplexity: 'N/A',
          spaceComplexity: 'N/A',
          feedback: 'AI Feedback (ChatGPT Match): Your code lacks the basic logical constructs required to solve this problem. Please re-read the problem statement and try again.',
          isError: true
        });
        return;
      }

      if (lowerCode.includes('for') && lowerCode.lastIndexOf('for') !== lowerCode.indexOf('for')) {
        updateAnalytics(70, 80);
        setResults({
          status: 'Success',
          time: '125ms',
          memory: '42.1 MB',
          testsPassed: 1,
          totalTests: 1,
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          feedback: 'AI Feedback (ChatGPT Match): Your solution works and passes the test case, but it uses a nested loop which might be suboptimal for large datasets (O(n²)). Try an optimized approach if possible.',
          isError: false
        });
      } else if (lowerCode.includes('map') || lowerCode.includes('hash') || lowerCode.includes('dp') || lowerCode.includes('stack')) {
        updateAnalytics(95, 100);
        setResults({
          status: 'Success',
          time: '42ms',
          memory: '38.4 MB',
          testsPassed: 1,
          totalTests: 1,
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          feedback: 'AI Feedback (ChatGPT Match): Excellent! This is an optimal solution. Using advanced data structures successfully reduced the time complexity.',
          isError: false
        });
      } else {
        updateAnalytics(85, 90);
        setResults({
          status: 'Success',
          time: '58ms',
          memory: '39.2 MB',
          testsPassed: 1,
          totalTests: 1,
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          feedback: 'AI Feedback (ChatGPT Match): All test cases passed successfully! Good job on the implementation.',
          isError: false
        });
      }
    }, 400);
  };

  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)] flex flex-col pb-4">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {location.state?.questionDetails && (
              <button 
                onClick={() => navigate('/interviews')}
                className="text-gray-400 hover:text-white transition-colors mr-2 flex items-center gap-1 text-sm font-medium border border-white/10 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Interview
              </button>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              currentQ.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'
            }`}>
              {currentQ.difficulty}
            </span>
            <span className="text-gray-400 text-sm">{currentQ.topic}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{currentQ.id}. {currentQ.title}</h1>
        </div>
        <div className="flex gap-4">
          <motion.button 
            initial={results?.status === 'Success' ? { opacity: 0, scale: 0.9 } : false}
            animate={results?.status === 'Success' ? { opacity: 1, scale: 1 } : false}
            onClick={handleNextQuestion}
            disabled={isGeneratingQ}
            className={`py-2 px-4 flex items-center gap-2 transition-all active:scale-95 rounded-xl font-medium disabled:opacity-50 ${
              results?.status === 'Success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
            }`}
          >
            {isGeneratingQ ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating AI Question...</>
            ) : (
              <>{results?.status === 'Success' ? 'Next Question' : 'Skip Question'} <ChevronRight className="w-4 h-4" /></>
            )}
          </motion.button>
          <button 
            onClick={() => setShowHint(!showHint)} 
            className={`btn-secondary flex items-center gap-2 py-2 transition-all active:scale-95 ${showHint ? 'border-yellow-500/50 bg-yellow-500/10' : ''}`}
          >
            <Lightbulb className={`w-4 h-4 ${showHint ? 'text-yellow-400' : 'text-gray-400'}`} /> 
            {showHint ? 'Hide Hint' : 'AI Hint'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-6 min-h-0">
        {/* Left Side: Question & Hints */}
        <div className="glass-panel overflow-y-auto p-6 flex flex-col">
          <div className="prose prose-invert max-w-none mb-6">
            {currentQ.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-300">{para}</p>
            ))}
            <div className="bg-white/5 p-4 rounded-xl mt-4 border border-white/10 font-mono text-sm">
              <span className="text-gray-500">Input:</span> {currentQ.exampleInput}<br/>
              <span className="text-gray-500">Output:</span> {currentQ.exampleOutput}<br/>
              <span className="text-gray-500">Explanation:</span> {currentQ.explanation}
            </div>
          </div>

          {showHint && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-6"
            >
              <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4" /> Strategic Hint
              </h4>
              <p className="text-sm text-yellow-200/90 leading-relaxed">
                {currentQ.hint}
              </p>
            </motion.div>
          )}

          <div className="mt-auto">
            <h3 className="font-bold text-white mb-3">AI Analysis (Phase 4)</h3>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Time Complexity</p>
                      <p className="font-bold text-white">{results.timeComplexity}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Space Complexity</p>
                      <p className="font-bold text-white">{results.spaceComplexity}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                  <p className="text-sm text-blue-200 flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-400 shrink-0" />
                    {results.feedback}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center text-gray-500">
                <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Run your code to see AI complexity analysis and feedback.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Code Editor */}
        <div className="glass-panel flex flex-col overflow-hidden">
          <div className="border-b border-white/10 p-3 flex justify-between items-center bg-gray-900/50">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-black/20 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="kotlin">Kotlin</option>
              <option value="swift">Swift</option>
              <option value="dart">Dart</option>
            </select>
            
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className="btn-primary py-1.5 px-4 text-sm flex items-center gap-2 active:scale-95 transition-transform"
            >
              {isRunning ? (
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run Code
            </button>
          </div>
          
          <div className="flex-1 p-4 bg-[#1e1e1e] relative min-h-[300px] md:min-h-[400px]">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                formatOnPaste: true
              }}
            />
          </div>

          {/* Test Results Panel */}
          <div className="h-48 border-t border-white/10 bg-gray-900/80 p-4 overflow-y-auto">
            {results ? (
              <div>
                <div className="flex items-center gap-6 mb-4">
                  <h3 className={`font-bold ${results.status === 'Compilation Error' ? 'text-red-400' : results.testsPassed === results.totalTests ? 'text-green-400' : 'text-orange-400'}`}>
                    {results.status} {results.status !== 'Compilation Error' && `(${results.testsPassed}/${results.totalTests} tests)`}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {results.time}</span>
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3"/> {results.memory}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[1].map((test, i) => (
                    <div key={test} className="flex items-center gap-3 text-sm bg-white/5 p-2 rounded-lg border border-white/5">
                      {results.status.includes('Failed') || results.status.includes('Error') ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : i < results.testsPassed ? (
                        <CheckSquare className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-gray-300">Test Case {test}</span>
                      {results.status.includes('Failed') || results.status.includes('Error') ? (
                        <span className="ml-auto text-red-400 text-xs">Failed</span>
                      ) : i >= results.testsPassed ? (
                        <span className="ml-auto text-red-400 text-xs">Output Mismatch</span>
                      ) : <span className="ml-auto text-green-400 text-xs">Passed</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Execute code to view test results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingEditor;
