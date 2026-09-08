import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Clock3, Code2, Mic, Pause, Play, Send, Volume2 } from 'lucide-react';

const starterCode = {
  JavaScript: `function twoSum(nums, target) {\n  const seen = new Map();\n\n  for (let i = 0; i < nums.length; i++) {\n    const needed = target - nums[i];\n    if (seen.has(needed)) return [seen.get(needed), i];\n    seen.set(nums[i], i);\n  }\n\n  return [];\n}`,
  Python: `def two_sum(nums, target):\n    seen = {}\n\n    for index, value in enumerate(nums):\n        needed = target - value\n        if needed in seen:\n            return [seen[needed], index]\n        seen[value] = index\n\n    return []`,
  Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
  'C++': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
};

const MockInterviewModal = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState(starterCode.JavaScript);
  const [runStatus, setRunStatus] = useState('');
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    if (!isOpen || isPaused || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, isPaused, secondsLeft]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const formattedTime = useMemo(() => `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`, [secondsLeft]);
  const codeLines = code.split('\n');

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    setCode(starterCode[nextLanguage]);
    setRunStatus('');
  };

  const handleRun = () => {
    setRunStatus('Tests passed: 2/2');
  };

  const handleSubmit = () => {
    setRunStatus('Answer submitted for review');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#1a1a1a] text-white">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#383838] bg-[#262626] px-4 py-3 md:px-6">
        <div className="flex items-center gap-3"><button onClick={onClose} className="rounded-lg p-2 text-[#9ca3af] hover:bg-[#383838] hover:text-white" aria-label="Back to dashboard"><ArrowLeft className="h-5 w-5" /></button><div><p className="text-xs text-[#8a8a8a]">AI Mock Interview</p><h1 className="text-sm font-semibold">Frontend Engineer</h1></div></div>
        <div className="flex items-center gap-3"><div className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm ${secondsLeft < 300 ? 'border-[#ff375f] text-[#ff375f]' : 'border-[#383838] text-[#00b8a3]'}`}><Clock3 className="h-4 w-4" /> {formattedTime}</div><button onClick={() => setIsPaused((value) => !value)} className="flex items-center gap-2 rounded-lg border border-[#383838] px-3 py-2 text-xs text-[#d1d1d1] hover:bg-[#383838]">{isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{isPaused ? 'Resume' : 'Pause'}</button><button onClick={onClose} className="rounded-lg border border-[#ff375f]/40 px-3 py-2 text-xs text-[#ff6b84] hover:bg-[#ff375f]/10">End Session</button></div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <section className="min-h-0 overflow-y-auto border-b border-[#383838] bg-[#1a1a1a] p-5 md:p-8 lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-2xl"><div className="mb-6 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#ffc01e]/10 px-2.5 py-1 text-xs text-[#ffc01e]">Medium</span><span className="rounded-full bg-[#00b8a3]/10 px-2.5 py-1 text-xs text-[#00b8a3]">Algorithms</span><span className="rounded-full bg-[#383838] px-2.5 py-1 text-xs text-[#9ca3af]">Meta</span></div><h2 className="text-2xl font-bold">Find Pair With Given Sum</h2><p className="mt-4 leading-7 text-[#c1c1c1]">Given an array of integers <code className="rounded bg-[#282828] px-1.5 py-0.5 text-[#00b8a3]">nums</code> and an integer <code className="rounded bg-[#282828] px-1.5 py-0.5 text-[#00b8a3]">target</code>, return the indices of the two numbers such that they add up to target.</p><p className="mt-3 leading-7 text-[#c1c1c1]">You may assume that each input has exactly one solution, and you may not use the same element twice.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-[#383838] bg-[#282828] p-4"><h3 className="text-sm font-semibold">Constraints</h3><ul className="mt-3 space-y-2 text-xs leading-5 text-[#9ca3af]"><li>• 2 ≤ nums.length ≤ 10,000</li><li>• -10⁹ ≤ nums[i] ≤ 10⁹</li><li>• Exactly one valid answer exists</li></ul></div><div className="rounded-xl border border-[#383838] bg-[#282828] p-4"><h3 className="text-sm font-semibold">Example</h3><p className="mt-3 font-mono text-xs text-[#9ca3af]">Input: [2, 7, 11, 15], 9</p><p className="mt-2 font-mono text-xs text-[#00b8a3]">Output: [0, 1]</p></div></div><button onClick={() => setShowHints((value) => !value)} className="mt-5 flex w-full items-center justify-between rounded-xl border border-[#383838] bg-[#282828] px-4 py-3 text-left text-sm font-semibold hover:bg-[#323232]"><span className="flex items-center gap-2"><Code2 className="h-4 w-4 text-[#00b8a3]" /> AI Hints</span>{showHints ? <ChevronUp className="h-4 w-4 text-[#8a8a8a]" /> : <ChevronDown className="h-4 w-4 text-[#8a8a8a]" />}</button>{showHints && <div className="rounded-b-xl border border-t-0 border-[#383838] bg-[#222222] p-4 text-sm leading-6 text-[#bdbdbd]">Use a hash map to remember values already seen. For each number, check whether <code className="text-[#00b8a3]">target - number</code> is already stored before adding the current value.</div>}
            <div className="mt-8 rounded-xl border border-[#383838] bg-[#282828] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${isListening ? 'bg-[#00b8a3]/15 text-[#00b8a3]' : 'bg-[#383838] text-[#8a8a8a]'}`}><Mic className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Voice AI Interviewer</p><p className="text-xs text-[#8a8a8a]">{isListening ? 'Interviewer is listening...' : 'Microphone paused'}</p></div></div><button onClick={() => setIsListening((value) => !value)} className="rounded-lg p-2 text-[#9ca3af] hover:bg-[#383838] hover:text-white" aria-label={isListening ? 'Pause microphone' : 'Resume microphone'}>{isListening ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</button></div><div className="mt-4 flex h-10 items-center gap-1">{Array.from({ length: 34 }, (_, index) => <span key={index} className={`w-1 rounded-full transition-all ${isListening ? 'bg-[#00b8a3]' : 'bg-[#444444]'}`} style={{ height: `${10 + ((index * 17) % 25)}px`, opacity: isListening ? 0.45 + (index % 3) * 0.2 : 0.5 }} />)}</div></div>
          </div>
        </section>

        <section className="flex min-h-0 flex-col bg-[#202020] p-4 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#383838] pb-3"><div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-[#00b8a3]" /><span className="text-sm font-semibold">Solution</span></div><select value={language} onChange={handleLanguageChange} className="rounded-lg border border-[#383838] bg-[#282828] px-3 py-2 text-xs text-[#d1d1d1] outline-none focus:border-[#00b8a3]"><option>JavaScript</option><option>Python</option><option>Java</option><option>C++</option></select></div><div className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-xl border border-[#383838] bg-[#151515] font-mono text-sm"><div className="select-none border-r border-[#282828] px-3 py-4 text-right leading-6 text-[#555555]">{codeLines.map((_, index) => <div key={index}>{index + 1}</div>)}</div><textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck="false" className="min-h-[360px] flex-1 resize-none bg-transparent p-4 leading-6 text-[#e5e5e5] outline-none" aria-label={`${language} code editor`} /></div><div className="mt-4 rounded-xl border border-[#383838] bg-[#282828] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold">Test Cases</p><p className="mt-1 text-xs text-[#8a8a8a]">2 hidden cases ready</p></div><div className="flex gap-2"><button onClick={handleRun} className="flex items-center gap-2 rounded-lg bg-[#ffa116] px-3 py-2 text-xs font-semibold text-black hover:bg-[#e08e13]"><Play className="h-3.5 w-3.5" /> Run Code</button><button onClick={handleSubmit} className="flex items-center gap-2 rounded-lg bg-[#ffa116] px-3 py-2 text-xs font-semibold text-black hover:bg-[#e08e13]"><Send className="h-3.5 w-3.5" /> Submit Answer</button></div></div>{runStatus && <p className="mt-3 flex items-center gap-2 text-xs text-[#00b8a3]"><CheckCircle2 className="h-4 w-4" /> {runStatus}</p>}</div></section>
      </main>
    </div>
  );
};

export default MockInterviewModal;
