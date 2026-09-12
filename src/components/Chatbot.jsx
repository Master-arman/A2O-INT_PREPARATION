import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Terminal, BookOpen, Lightbulb } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: '👋 Hi! I am your AI Tech & Interview Coach. Ask me about algorithms, coding problems, language syntax (JS, Python, Java, HTML/CSS, SQL), or mock interview questions!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const generateAiReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. IMAGE / IMG / SRC
    if (q.includes('img') || q.includes('image') || q.includes('src') || q.includes('photo')) {
      return `**HTML Image (\`<img>\`) Code & Explanation:**\n\n\`\`\`html\n<img \n  src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop" \n  alt="Description of image" \n  width="400" \n  height="250" \n  loading="lazy"\n  style="border-radius: 12px; object-fit: cover;"\n/>\n\`\`\`\n\n**Key Attributes:**\n• \`src\`: The path or URL of the image.\n• \`alt\`: Screen reader & SEO fallback text.\n• \`loading="lazy"\`: Defers offscreen image loading for peak performance.`;
    }

    // 2. NAVBAR / HEADER
    if (q.includes('nav') || q.includes('navbar') || q.includes('header')) {
      return `**Modern Responsive Flexbox Navbar:**\n\n\`\`\`html\n<nav style="display: flex; justify-content: space-between; align-items: center; background: #1e1e1e; padding: 14px 24px; border-radius: 10px; color: #fff;">\n  <a href="#" style="color: #ffa116; font-weight: bold; font-size: 1.2rem; text-decoration: none;">⚡ TechPrep</a>\n  <div style="display: flex; gap: 16px;">\n    <a href="#" style="color: #ccc; text-decoration: none;">Courses</a>\n    <a href="#" style="color: #ccc; text-decoration: none;">Practice</a>\n    <a href="#" style="color: #ccc; text-decoration: none;">Interviews</a>\n  </div>\n  <button style="background: #ffa116; color: #000; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Get Started</button>\n</nav>\n\`\`\``;
    }

    // 3. TREE / BST
    if (q.includes('tree') || q.includes('binary tree') || q.includes('bst')) {
      return `**Binary Trees & BSTs:**\n\n• A Binary Tree is a hierarchical data structure where each node has at most two children (left and right).\n• In a **Binary Search Tree (BST)**, the left subtree contains keys smaller than the node, and the right subtree contains keys greater.\n\n**Time Complexity:**\n- Search/Insert/Delete: Average $O(\\log n)$, Worst-case $O(n)$ if unbalanced.\n\n*Try practicing Tree problems in our Coding Editor!*`;
    }

    // 4. BIG O / TIME COMPLEXITY
    if (q.includes('time complexity') || q.includes('big o') || q.includes('space complexity')) {
      return `**Big-O Notation Quick Cheat Sheet:**\n\n• $O(1)$ - Constant Time (Hash map lookup, array index access)\n• $O(\\log n)$ - Logarithmic (Binary Search, balanced BST search)\n• $O(n)$ - Linear (Array iteration, linear search)\n• $O(n \\log n)$ - Linearithmic (MergeSort, QuickSort average)\n• $O(n^2)$ - Quadratic (Nested loops, BubbleSort)\n• $O(2^n)$ - Exponential (Recursive Fibonacci without memoization)\n\n**Rule of Thumb:** Aim for $O(n \\log n)$ or $O(n)$ in technical interview coding rounds!`;
    }

    // 5. JAVASCRIPT / REACT
    if (q.includes('javascript') || q.includes('closure') || q.includes('promise') || q.includes('async')) {
      return `**JavaScript Core Concepts:**\n\n• **Closures:** A function that retains access to its lexical scope even when executed outside that scope.\n• **Promises & Async/Await:** Modern async pattern replacing callback hell. Microtasks run before the next event loop macro-task.\n• **Event Loop:** Call Stack -> Web APIs -> Microtask Queue (Promises) -> Task Queue (setTimeout) -> Render pipeline.`;
    }

    if (q.includes('react') || q.includes('hook') || q.includes('useeffect') || q.includes('state')) {
      return `**React Key Principles:**\n\n• **useState:** Re-renders component when state changes via immutable setters.\n• **useEffect:** Synchronizes with external systems. Dependency array controls execution frequency.\n• **useMemo & useCallback:** Memoize expensive calculations and callback references to prevent unnecessary child re-renders.`;
    }

    if (q.includes('mock interview') || q.includes('interview question') || q.includes('system design')) {
      return `**System Design & Mock Interview Strategy (STAR Method):**\n\n1. **Situation:** Context of project or scale challenge (e.g., 100k QPS).\n2. **Task:** What bottleneck or feature you had to solve.\n3. **Action:** Architecture choices (Load balancer, Redis cache, DB indexing, microservices).\n4. **Result:** Latency reduced by 40%, 99.99% uptime achieved.\n\n*Check out the "Mock Interviews" tab in the left sidebar to practice real-time timed voice/coding rounds!*`;
    }

    return `**AI Tutor Analysis:**\n\nRegarding "${userQuery}":\n\n1. **Core Concept:** Break down the problem into smaller logical modules.\n2. **Best Practice:** Keep functions pure, handle boundary inputs (null/undefined/empty), and validate output results.\n3. **Tip:** You can test code snippets directly in our **Courses & Tutorials** interactive code playground!`;
  };

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query || !query.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    // Live Gemini API Attempt
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey.length > 20) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const res = await Promise.race([
          model.generateContent(`You are an expert tech tutor and coding mentor specializing in interview preparation. Answer this query helpfully and concisely, with code examples if relevant: "${query}"`),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
        ]);
        const text = res.response.text();
        if (text) {
          setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text }]);
          setIsTyping(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Chatbot Gemini fallback active:", e.message);
    }

    setTimeout(() => {
      setIsTyping(false);
      const reply = generateAiReply(query);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: reply }]);
    }, 450);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffa116] text-black shadow-[0_0_20px_rgba(255,161,22,0.4)] transition-all hover:bg-[#e08e13] border border-[#383838]"
        title="Open AI Tutor & Interview Assistant"
      >
        <MessageSquare className="h-5 w-5" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 left-4 z-50 flex h-[60vh] max-h-[600px] flex-col overflow-hidden rounded-2xl border border-[#383838] bg-[#1e1e1e] shadow-2xl md:left-auto md:right-6 md:h-[550px] md:w-[420px]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#383838] bg-[#262626] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffa116]/15 text-[#ffa116]">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI Learning Coach</h3>
                  <p className="flex items-center gap-1.5 text-xs text-[#8a8a8a]">
                    <span className="h-2 w-2 rounded-full bg-[#00b8a3] animate-pulse" /> Live & Ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-[#8a8a8a] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[88%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user' ? 'bg-[#ffa116] text-black font-bold' : 'bg-[#333] text-[#ffa116]'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div
                    className={`rounded-2xl p-3 leading-relaxed whitespace-pre-line shadow-md ${
                      msg.role === 'user'
                        ? 'bg-[#ffa116] font-semibold text-black rounded-tr-none'
                        : 'bg-[#282828] text-neutral-200 border border-[#383838] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#333] text-[#ffa116]">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-[#383838] bg-[#282828] p-3 text-[#ffa116]">
                    <Sparkles className="h-3.5 w-3.5 animate-spin mr-1" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1 px-3 py-1.5 bg-[#222] border-t border-[#333]">
              {['Big-O Complexities', 'React Hooks', 'Binary Trees', 'Interview STAR Method'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="rounded-full border border-[#383838] bg-[#1a1a1a] px-2 py-0.5 text-[10px] text-[#8a8a8a] hover:border-[#ffa116] hover:text-white transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex shrink-0 gap-2 border-t border-[#383838] bg-[#1a1a1a] p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI anything about coding or interviews..."
                className="flex-1 rounded-lg border border-[#383838] bg-[#242424] px-3 py-2 text-xs text-white placeholder:text-[#666] focus:border-[#ffa116] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-lg bg-[#ffa116] px-3.5 py-2 font-bold text-black transition-colors hover:bg-[#e08e13] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
